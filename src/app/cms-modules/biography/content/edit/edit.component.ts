//**msh */
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { FormGroup } from '@angular/forms';
import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel,
  BiographyContentModel,
  BiographyContentService,
  FilterDataModel,
  BiographyCategoryModel,
  BiographyContentTagService,
  BiographyContentTagModel,
  BiographyContentSimilarService,
  BiographyContentOtherInfoService,
  BiographyContentOtherInfoModel,
  BiographyContentSimilarModel,
  AccessModel,
  DataFieldInfoModel,
  EnumClauseType,
  BiographyContentCategoryService,
  BiographyContentCategoryModel,
  EnumManageUserAccessDataTypes
} from 'ntk-cms-api';
import { ActivatedRoute, Router } from '@angular/router';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { NodeInterface, TreeModel } from 'src/filemanager-api';
import { Map as leafletMap } from 'leaflet';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { PoinModel } from 'src/app/core/models/pointModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';
import { CoreLocationModel } from 'ntk-cms-api';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, of } from 'rxjs';
@Component({
  selector: 'app-biography-content-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'
  ]
})
export class BiographyContentEditComponent implements OnInit, AfterViewInit {
  requestId = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    public coreEnumService: CoreEnumService,
    public publicHelper: PublicHelper,
    public contentService: BiographyContentService,
    private contentCategoryService: BiographyContentCategoryService,
    private contentTagService: BiographyContentTagService,
    private contentSimilarService: BiographyContentSimilarService,
    private contentOtherInfoService: BiographyContentOtherInfoService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModel = new BiographyContentModel();
  dataModelResult: ErrorExceptionResult<BiographyContentModel> = new ErrorExceptionResult<BiographyContentModel>();
  dataContentTagModelResult: ErrorExceptionResult<BiographyContentTagModel> = new ErrorExceptionResult<BiographyContentTagModel>();
  dataContentSimilarModelResult: ErrorExceptionResult<BiographyContentSimilarModel> =
    new ErrorExceptionResult<BiographyContentSimilarModel>();
  dataContentOtherInfoModelResult: ErrorExceptionResult<BiographyContentOtherInfoModel> =
    new ErrorExceptionResult<BiographyContentOtherInfoModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataContentCategoryModel: number[] = [];
  similarDataModel = new Array<BiographyContentModel>();
  otherInfoDataModel = new Array<BiographyContentOtherInfoModel>();
  contentSimilarSelected: BiographyContentModel = new BiographyContentModel();
  contentOtherInfoSelected: BiographyContentOtherInfoModel = new BiographyContentOtherInfoModel();
  otherInfoTabledisplayedColumns = ['Id', 'Title', 'TypeId', 'Action'];
  similarTabledisplayedColumns = ['LinkMainImageIdSrc', 'Id', 'RecordStatus', 'Title', 'Action'];
  similarTabledataSource = new MatTableDataSource<BiographyContentModel>();
  otherInfoTabledataSource = new MatTableDataSource<BiographyContentOtherInfoModel>();
  dataAccessModel: AccessModel;
  loading = new ProgressSpinnerModel();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypePodcast = ['mp3'];
  selectFileTypeMovie = ['mp4', 'webm'];
  formInfo: FormInfoModel = new FormInfoModel();
  fileManagerOpenForm = false;
  fileManagerOpenFormPodcast = false;
  fileManagerOpenFormMovie = false;
  fileManagerTree: TreeModel;
  keywordDataModel = [];
  tagIdsData: number[];
  appLanguage = 'fa';
  viewMap = false;
  mapMarker: any;
  private mapModel: leafletMap;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter = new PoinModel();
  ngOnInit(): void {
    this.requestId = + Number(this.activatedRoute.snapshot.paramMap.get('Id'));
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.DataGetOne();
    this.DataCategoryGetAll();
    this.getEnumRecordStatus();
  }
  ngAfterViewInit(): void {
  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFilePodcastId(model: NodeInterface): void {
    this.dataModel.linkFilePodcastId = model.id;
    this.dataModel.linkFilePodcastIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileMovieId(model: NodeInterface): void {
    this.dataModel.linkFileMovieId = model.id;
    this.dataModel.linkFileMovieIdSrc = model.downloadLinksrc;
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  onFormSubmit(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }
    this.dataModel.keyword = '';
    if (this.keywordDataModel && this.keywordDataModel.length > 0) {
      const listKeyword = [];
      this.keywordDataModel.forEach(element => {
        if (element.display) {
          listKeyword.push(element.display);
        } else {
          listKeyword.push(element);
        }
      });
      if (listKeyword && listKeyword.length > 0) {
        this.dataModel.keyword = listKeyword.join(',');
      }
    }
    this.DataEditContent();
  }
  DataGetOne(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    /*َAccess Field*/
    this.contentService.setAccessLoad();
    this.contentService.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
    this.contentService
      .ServiceGetOneById(this.requestId)
      .subscribe({
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          this.loading.Stop(pName);
          this.dataModelResult = ret;
          this.formInfo.formSubmitAllow = true;
          if (ret.isSuccess) {
            /*َAccess Field*/
            this.dataAccessModel = ret.access;
            this.dataModel = ret.item;
            const lat = this.dataModel.geolocationlatitude;
            const lon = this.dataModel.geolocationlongitude;
            if (lat > 0 && lon > 0) {
              this.mapMarkerPoints = [];
              this.mapMarkerPoints.push({ lat, lon });
              this.receiveMap();
            }
            this.dataModel.keyword = this.dataModel.keyword + '';
            this.keywordDataModel = this.dataModel.keyword.split(',');
            this.DataTagGetAll();
            this.DataOtherInfoGetAll();
            this.DataSimilarGetAllIds();
            this.loading.Stop(pName);
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
        }
      }
      );
  }
  DataTagGetAll(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.Receiving_tag_information_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Receiving_tag_information_from_the_server'));
    const filteModel = new FilterModel();
    const aaa3 = {
      PropertyName: 'LinkContentId',
      Value: this.requestId,
    };
    filteModel.filters.push(aaa3 as unknown  as FilterDataModel);
    this.tagIdsData = [];
    this.contentTagService
      .ServiceGetAll(filteModel)
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);
          this.dataContentTagModelResult = ret;
          this.formInfo.formSubmitAllow = true;
          if (ret.isSuccess) {
            const list = [];
            this.dataContentTagModelResult.listItems.forEach(x => {
              list.push(x.linkTagId);
            });
            this.tagIdsData = list;
          } else {
            this.cmsToastrService.typeErrorGetAll(ret.errorMessage);
          }
        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetAll(er);
        }
      }
      );
  }
  DataOtherInfoGetAll(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_other_information_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    const filteModel = new FilterModel();
    const aaa3 = {
      PropertyName: 'LinkContentId',
      Value: this.requestId,
    };
    filteModel.filters.push(aaa3 as unknown  as FilterDataModel);
    this.contentOtherInfoService
      .ServiceGetAll(filteModel)
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);
          this.formInfo.formSubmitAllow = true;
          this.dataContentOtherInfoModelResult = ret;
          if (ret.isSuccess) {
            this.otherInfoDataModel = ret.listItems;
            this.otherInfoTabledataSource.data = ret.listItems;
          } else {
            this.cmsToastrService.typeErrorGetAll(ret.errorMessage);
          }
        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetAll(er);
        }
      }
      );
  }
  DataSimilarGetAllIds(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_other_information_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    const filteModel = new FilterModel();
    const aaa1 = {
      PropertyName: 'LinkSourceId',
      Value: this.requestId,
      ClauseType: 1
    };
    const aaa2 = {
      PropertyName: 'LinkDestinationId',
      Value: this.requestId,
      ClauseType: 1
    };
    filteModel.filters.push(aaa1 as unknown  as FilterDataModel);
    filteModel.filters.push(aaa2 as unknown  as FilterDataModel);
    this.contentSimilarService
      .ServiceGetAll(filteModel)
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);
          this.formInfo.formSubmitAllow = true;
          this.dataContentSimilarModelResult = ret;
          if (ret.isSuccess) {
            const listIds = Array<number>();
            ret.listItems.forEach(x => {
              if (x.linkDestinationId === this.requestId) {
                listIds.push(x.linkSourceId);
              } else {
                listIds.push(x.linkDestinationId);
              }
            });
            this.DataSimilarGetAll(listIds);
          } else {
            this.cmsToastrService.typeErrorGetAll(ret.errorMessage);
          }
        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetAll(er);
        }
      }
      );
  }
  DataSimilarGetAll(ids: Array<number>): void {
    if (!ids || ids.length === 0) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_other_information_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    const filteModel = new FilterModel();
    ids.forEach(item => {
      const aaa3 = {
        PropertyName: 'Id',
        Value: item + '',
        ClauseType: 1
      };
      filteModel.filters.push(aaa3 as unknown as FilterDataModel);
    });
    this.contentService
      .ServiceGetAll(filteModel)
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);
          this.formInfo.formSubmitAllow = true;
          if (ret.isSuccess) {
            this.similarDataModel = ret.listItems;
            this.similarTabledataSource.data = ret.listItems;
          } else {
            this.cmsToastrService.typeErrorGetAll(ret.errorMessage);
          }
        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetAll(er);
        }
      }
      );
  }
  DataEditContent(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.sending_information_to_the_server'));
    this.contentService
      .ServiceEdit(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.Stop(pName);
          this.formInfo.formSubmitAllow = true;
          this.dataModelResult = next;
          if (next.isSuccess) {
            this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
            this.cmsToastrService.typeSuccessEdit();
            await this.DataActionAfterAddContentSuccessfulTag(this.dataModel);
            await this.DataActionAfterAddContentSuccessfulSimilar(this.dataModel);
            await this.DataActionAfterAddContentSuccessfulOtherInfo(this.dataModel);
            setTimeout(() => this.router.navigate(['/biography/content']), 1000);
          } else {
            this.cmsToastrService.typeErrorEdit(next.errorMessage);
          }
          this.loading.Stop(pName);
        },
        (error) => {
          this.loading.Stop(pName);
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorEdit(error);
        }
      );
  }
  async DataActionAfterAddContentSuccessfulTag(model: BiographyContentModel): Promise<any> {
    const dataListAdd = new Array<BiographyContentTagModel>();
    const dataListDelete = new Array<BiographyContentTagModel>();
    if (this.tagIdsData) {
      this.tagIdsData.forEach(item => {
        const row = new BiographyContentTagModel();
        row.linkContentId = model.id;
        row.linkTagId = item;
        if (!this.dataContentTagModelResult.listItems || !this.dataContentTagModelResult.listItems.find(x => x.linkTagId === item)) {
          dataListAdd.push(row);
        }
      });
    }
    if (this.dataContentTagModelResult.listItems) {
      this.dataContentTagModelResult.listItems.forEach(item => {
        if (!this.tagIdsData || !this.tagIdsData.find(x => x === item.linkTagId)) {
          dataListDelete.push(item);
        }
      });
    }
    if (dataListAdd && dataListAdd.length > 0) {
      this.contentTagService.ServiceAddBatch(dataListAdd).pipe(
        map(response => {
          if (response.isSuccess) {
            this.cmsToastrService.typeSuccessAddTag();
          } else {
            this.cmsToastrService.typeErrorAddTag();
          }
          
          return of(response);
        })).toPromise();
    }
    if (dataListDelete && dataListDelete.length > 0) {
      this.contentTagService.ServiceDeleteBatch(dataListDelete).pipe(
        map(response => {
          if (response.isSuccess) {
            this.cmsToastrService.typeSuccessRemoveTag();
          } else {
            this.cmsToastrService.typeErrorRemoveTag();
          }
          
          return of(response);
        })).toPromise();
    }
  }
  async DataActionAfterAddContentSuccessfulOtherInfo(model: BiographyContentModel): Promise<any> {
    const dataListAdd = new Array<BiographyContentOtherInfoModel>();
    const dataListDelete = new Array<BiographyContentOtherInfoModel>();
    if (this.otherInfoDataModel) {
      this.otherInfoDataModel.forEach(item => {
        const row = new BiographyContentOtherInfoModel();
        row.linkContentId = model.id;
        if (!this.dataContentOtherInfoModelResult.listItems ||
          !item.id ||
          !this.dataContentOtherInfoModelResult.listItems.find(x => x.id === item.id)) {
          dataListAdd.push(row);
        }
      });
    }
    if (this.dataContentOtherInfoModelResult.listItems) {
      this.dataContentOtherInfoModelResult.listItems.forEach(item => {
        if (!this.otherInfoDataModel || !this.otherInfoDataModel.find(x => x.id === item.id)) {
          dataListDelete.push(item);
        }
      });
    }
    if (dataListAdd && dataListAdd.length > 0) {
    }
    if (dataListDelete && dataListDelete.length > 0) {
   
    }
  }
  async DataActionAfterAddContentSuccessfulSimilar(model: BiographyContentModel): Promise<any> {
    const dataListAdd = new Array<BiographyContentSimilarModel>();
    const dataListDelete = new Array<BiographyContentSimilarModel>();
    if (this.similarDataModel) {
      this.similarDataModel.forEach(item => {
        const row = new BiographyContentSimilarModel();
        row.linkSourceId = model.id;
        row.linkDestinationId = item.id;
        if (!this.dataContentSimilarModelResult.listItems ||
          !this.dataContentSimilarModelResult.listItems.find(x => x.linkSourceId === item.id || x.linkDestinationId === item.id)) {
          dataListAdd.push(row);
        }
      });
    }
    if (this.dataContentSimilarModelResult.listItems) {
      this.dataContentSimilarModelResult.listItems.forEach(item => {
        if (!this.similarDataModel || !this.similarDataModel.find(x => x.id === item.linkSourceId || x.id === item.linkDestinationId)) {
          dataListDelete.push(item);
        }
      });
    }
    if (dataListAdd && dataListAdd.length > 0) {
    }
    if (dataListDelete && dataListDelete.length > 0) {
    }
  }
  onActionSelectorSelect(model: BiographyCategoryModel | null): void {
    if (!model || model.id <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.linkCategoryId = model.id;
  }
  DataCategoryGetAll(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_category_information_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    const filteModel = new FilterModel();
    const filter = new FilterDataModel();
    filter.propertyName = 'LinkContentId';
    filter.value = this.requestId;
    filter.clauseType = EnumClauseType.And;
    filteModel.filters.push(filter);
    this.tagIdsData = [];
    this.contentCategoryService
      .ServiceGetAll(filteModel)
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);
          const itemList = [];
          ret.listItems.forEach(element => {
            itemList.push(element.linkCategoryId);
          });
          this.dataContentCategoryModel = itemList;
          this.formInfo.formSubmitAllow = true;
        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetAll(er);
        }
      }
      );
  }
  onActionCategorySelectChecked(model: number): void {

    if (!model || model <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    const entity = new BiographyContentCategoryModel();
    entity.linkCategoryId = model;
    entity.linkContentId = this.dataModel.id;
    this.contentCategoryService.ServiceAdd(entity).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_in_this_group_was_successful');
          this.cmsToastrService.typeSuccessEdit();
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
      }
    }
    );
  }
  onActionCategorySelectDisChecked(model: number): void {

    if (!model || model <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    const entity = new BiographyContentCategoryModel();
    entity.linkCategoryId = model;
    entity.linkContentId = this.dataModel.id;
    this.contentCategoryService.ServiceDeleteEntity(entity).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_in_this_group_was_successful');
          this.cmsToastrService.typeSuccessEdit();
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
      }
    }
    );
  }
  onActionTagChange(ids: number[]): void {
    this.tagIdsData = ids;
  }
  onActionContentSimilarSelect(model: BiographyContentModel | null): void {
    if (!model || model.id <= 0) {
      return;
    }
    this.contentSimilarSelected = model;
  }
  onActionContentSimilarAddToLIst(): void {
    if (!this.contentSimilarSelected || this.contentSimilarSelected.id <= 0) {
      return;
    }
    if (this.similarDataModel.find(x => x.id === this.contentSimilarSelected.id)) {
      this.cmsToastrService.typeErrorAddDuplicate();
      return;
    }
    this.similarDataModel.push(this.contentSimilarSelected);
    this.similarTabledataSource.data = this.similarDataModel;
  }
  onActionContentSimilarRemoveFromLIst(model: BiographyContentModel | null): void {
    if (!model || model.id <= 0) {
      return;
    }
    if (!this.similarDataModel || this.similarDataModel.length === 0) {
      return;
    }
    const retOut = new Array<BiographyContentModel>();
    this.similarDataModel.forEach(x => {
      if (x.id !== model.id) {
        retOut.push(x);
      }
    });
    this.similarDataModel = retOut;
    this.similarTabledataSource.data = this.similarDataModel;
  }
  onActionContentOtherInfoAddToLIst(): void {
    if (!this.contentOtherInfoSelected) {
      return;
    }
    if (this.otherInfoDataModel.find(x => x.title === this.contentOtherInfoSelected.title)) {
      this.cmsToastrService.typeErrorAddDuplicate();
      return;
    }
    this.otherInfoDataModel.push(this.contentOtherInfoSelected);
    this.contentOtherInfoSelected = new BiographyContentOtherInfoModel();
    this.otherInfoTabledataSource.data = this.otherInfoDataModel;
  }
  onActionContentOtherInfoRemoveFromLIst(index: number): void {
    if (index < 0) {
      return;
    }
    if (!this.otherInfoDataModel || this.otherInfoDataModel.length === 0) {
      return;
    }
    this.otherInfoDataModel.splice(index, 1);
    this.otherInfoTabledataSource.data = this.otherInfoDataModel;

  }
  onActionContentOtherInfoEditFromLIst(index: number): void {
    if (index < 0) {
      return;
    }
    if (!this.otherInfoDataModel || this.otherInfoDataModel.length === 0) {
      return;
    }
    this.contentOtherInfoSelected = this.otherInfoDataModel[index];
    this.otherInfoDataModel.splice(index, 1);
    this.otherInfoTabledataSource.data = this.otherInfoDataModel;
  }
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      if (!this.formGroup.valid) {
        this.cmsToastrService.typeErrorFormInvalid();
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
    }
  }
  onActionBackToParent(): void {
    this.router.navigate(['/biography/content/']);
  }
  receiveMap(model: leafletMap = this.mapModel): void {
    if (!model) {
      return;
    }
    this.mapModel = model;
    if (this.mapMarkerPoints && this.mapMarkerPoints.length > 0) {
      this.mapMarkerPoints.forEach(item => {
        this.mapMarker = Leaflet.marker([item.lat, item.lon]).addTo(this.mapModel);
      });
      this.mapOptonCenter = this.mapMarkerPoints[0];
      this.mapMarkerPoints = [];
    }
    this.mapModel.on('click', (e) => {
      // @ts-ignore
      const lat = e.latlng.lat;
      // @ts-ignore
      const lon = e.latlng.lng;
      if (this.mapMarker !== undefined) {
        this.mapModel.removeLayer(this.mapMarker);
      }
      if (lat === this.dataModel.geolocationlatitude && lon === this.dataModel.geolocationlongitude) {
        this.dataModel.geolocationlatitude = null;
        this.dataModel.geolocationlongitude = null;
        return;
      }
      this.mapMarker = Leaflet.marker([lat, lon]).addTo(this.mapModel);
      this.dataModel.geolocationlatitude = lat;
      this.dataModel.geolocationlongitude = lon;
    });
  }
  receiveZoom(mode: leafletMap): void {
  }


  onActionSelectorLocation(model: CoreLocationModel | null): void {
    if (!model || !model.id || model.id <= 0) {
      const message = this.translate.instant('MESSAGE.Information_area_deleted');
      this.cmsToastrService.typeWarningSelected(message);
      this.dataModel.linkLocationId = null;
      return;
    }
    this.dataModel.linkLocationId = model.id;
  }
  	
		 /**
   * tag
   */
      addOnBlurTag = true;
      readonly separatorKeysCodes = [ENTER, COMMA] as const;
      addTag(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        // Add our item
        if (value) {
          this.keywordDataModel.push( value);
        }
        // Clear the input value
        event.chipInput!.clear();
      }
    
      removeTag(item: string): void {
        const index = this.keywordDataModel.indexOf(item);
    
        if (index >= 0) {
          this.keywordDataModel.splice(index, 1);
        }
      }
      /**
       * tag
       */
}