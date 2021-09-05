import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { FormGroup } from '@angular/forms';
import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel,
  PollingContentModel,
  PollingContentService,
  FilterDataModel,
  PollingCategoryModel,
  DataFieldInfoModel,
  AccessModel,
  PollingOptionModel,
  PollingOptionService,
} from 'ntk-cms-api';
import { ActivatedRoute, Router } from '@angular/router';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { NodeInterface, TreeModel } from 'projects/ntk-cms-filemanager/src/public-api';
import { Map as leafletMap } from 'leaflet';


import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { PoinModel } from 'src/app/core/models/pointModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-polling-content-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'
  ]
})
export class PollingContentEditComponent implements OnInit, AfterViewInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    public coreEnumService: CoreEnumService,
    public publicHelper: PublicHelper,
    private pollingContentService: PollingContentService,
    private pollingOptionService: PollingOptionService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loadingOption.cdr = this.cdr;

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  requestId = 0;
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  dataModel = new PollingContentModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModelResult: ErrorExceptionResult<PollingContentModel> = new ErrorExceptionResult<PollingContentModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  optionSelected: PollingOptionModel = new PollingOptionModel();
  optionDataModel = new Array<PollingOptionModel>();
  optionTabledataSource = new MatTableDataSource<PollingOptionModel>();
  dataOptionModelResult: ErrorExceptionResult<PollingOptionModel> = new ErrorExceptionResult<PollingOptionModel>();
  optionActionTitle = 'اضافه به لیست';
  optionActionButtomEnable = true;
  optionTabledisplayedColumns = ['Id', 'Option', 'OptionAnswer', 'IsCorrectAnswer', 'NumberOfVotes', 'ScoreOfVotes', 'Action'];


  loading = new ProgressSpinnerModel();
  loadingOption = new ProgressSpinnerModel();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypePodcast = ['mp3'];
  selectFileTypeMovie = ['mp4'];
  formInfo: FormInfoModel = new FormInfoModel();
  fileManagerOpenForm = false;
  fileManagerOpenFormPodcast = false;
  fileManagerOpenFormMovie = false;
  fileManagerTree: TreeModel;
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
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }
    this.DataGetOne();
    this.getEnumRecordStatus();
  }
  ngAfterViewInit(): void {

  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFilePodcastId(model: NodeInterface): void {
    this.dataModel.LinkFilePodcastId = model.id;
    this.dataModel.LinkFilePodcastIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileMovieId(model: NodeInterface): void {
    this.dataModel.LinkFileMovieId = model.id;
    this.dataModel.LinkFileMovieIdSrc = model.downloadLinksrc;
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }


  onFormSubmit(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }


    this.DataEditContent();
  }

  DataGetOne(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    /*َAccess Field*/
    this.pollingContentService.setAccessLoad();
    this.pollingContentService
      .ServiceGetOneById(this.requestId)
      .subscribe(
        async (next) => {

          /*َAccess Field*/
          this.dataAccessModel = next.Access;
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

          this.loading.Stop(pName);

          this.dataModelResult = next;
          this.formInfo.FormSubmitAllow = true;

          if (next.IsSuccess) {
            this.dataModel = next.Item;
            const lat = this.dataModel.Geolocationlatitude;
            const lon = this.dataModel.Geolocationlongitude;
            if (lat > 0 && lon > 0) {
              this.mapMarkerPoints.push({ lat, lon });
            }
            this.DataOptionGetAll();
            // this.DataOtherInfoGetAll();
            // this.DataSimilarGetAllIds();
            this.loading.Stop(pName);

          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.Stop(pName);

          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
  DataOptionGetAll(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال دریافت گزینه ها از سرور';
    this.formInfo.FormError = '';
    this.loadingOption.Start('main');


    const filteModel = new FilterModel();

    const filter = new FilterDataModel();
    filter.PropertyName = 'LinkPollingContentId';
    filter.Value = this.requestId;
    filteModel.Filters.push(filter);
    this.pollingOptionService
      .ServiceGetAll(filteModel)
      .subscribe(
        async (next) => {
          this.loadingOption.Stop('main');
          this.formInfo.FormSubmitAllow = true;
          this.dataOptionModelResult = next;
          if (next.IsSuccess) {
            this.optionDataModel = next.ListItems;
            this.optionTabledataSource.data = next.ListItems;
          } else {
            this.cmsToastrService.typeErrorGetAll(next.ErrorMessage);
          }
        },
        (error) => {
          this.loadingOption.Stop('main');
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetAll(error);
        }
      );
  }
  DataEditContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.pollingContentService
      .ServiceEdit(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.Stop(pName);

          this.formInfo.FormSubmitAllow = true;
          this.dataModelResult = next;
          if (next.IsSuccess) {

            this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
            this.cmsToastrService.typeSuccessAdd();

            setTimeout(() => this.router.navigate(['/polling/content']), 1000);
          } else {
            this.cmsToastrService.typeErrorAdd(next.ErrorMessage);
          }
          this.loading.Stop(pName);

        },
        (error) => {
          this.loading.Stop(pName);

          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(error);
        }
      );
  }
  // async DataActionAfterAddContentSuccessfullOption(model: PollingContentModel): Promise<any> {
  //   const dataListAdd = new Array<PollingOptionModel>();
  //   const dataListDelete = new Array<PollingOptionModel>();
  //   if (this.optionDataModel) {
  //     this.optionDataModel.forEach(item => {
  //       const row = new PollingOptionModel();
  //       row.LinkPollingContentId = model.Id;
  //       if (!this.dataOptionModelResult.ListItems || !item.Id || !this.dataOptionModelResult.ListItems.find(x => x.Id === item.Id)) {
  //         dataListAdd.push(row);
  //       }
  //     });
  //   }
  //   if (this.dataOptionModelResult.ListItems) {
  //     this.dataOptionModelResult.ListItems.forEach(item => {
  //       if (!this.optionDataModel || !this.optionDataModel.find(x => x.Id === item.Id)) {
  //         dataListDelete.push(item);
  //       }
  //     });
  //   }
  //   if (dataListAdd && dataListAdd.length > 0) {
  //   }
  //   if (dataListDelete && dataListDelete.length > 0) {
  //   }
  // }
  onActionSelectorSelect(model: PollingCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      const message = 'دسته بندی اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkCategoryId = model.Id;
  }

  onActionOptionAddToList(): void {
    if (!this.optionSelected) {
      return;
    }
    if (this.optionDataModel.find(x => x.Option === this.optionSelected.Option)) {
      this.cmsToastrService.typeErrorAddDuplicate();
      return;
    }

    this.optionActionButtomEnable = false;
    if (this.optionSelected.Id > 0) {
      this.pollingOptionService.ServiceEdit(this.optionSelected).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.optionSelected = new PollingOptionModel();
            this.optionActionTitle = 'اضافه به لیست';
            this.optionSelected = new PollingOptionModel();
            this.DataOptionGetAll();
          }
          else {
            this.cmsToastrService.typeErrorEdit(next.ErrorMessage);
          }
          this.optionActionButtomEnable = true;
        },
        (error) => {
          this.cmsToastrService.typeError(error);
          this.optionActionButtomEnable = true;
        });
    }
    else {
      this.optionSelected.LinkPollingContentId = this.requestId;
      this.pollingOptionService.ServiceAdd(this.optionSelected).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.optionSelected = new PollingOptionModel();
            this.optionActionTitle = 'اضافه به لیست';
            this.optionSelected = new PollingOptionModel();
            this.DataOptionGetAll();
          } else {
            this.cmsToastrService.typeErrorAdd(next.ErrorMessage);
          }
          this.optionActionButtomEnable = true;
        },
        (error) => {
          this.cmsToastrService.typeError(error);
          this.optionActionButtomEnable = true;
        });

    }


  }
  onActionOptionRemoveFromList(index: number): void {

    if (index < 0) {
      return;
    }
    if (!this.optionDataModel || this.optionDataModel.length === 0) {
      return;
    }
    this.optionSelected = this.optionDataModel[index];

    // this.optionDataModel.splice(index, 1);
    // this.optionTabledataSource.data = this.optionDataModel;
    this.pollingOptionService.ServiceDelete(this.optionSelected.Id).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.DataOptionGetAll();
          this.optionSelected = new PollingOptionModel();
        } else {
          this.cmsToastrService.typeErrorRemove(next.ErrorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
      });
  }
  onActionOptionEditFromList(index: number): void {

    if (index < 0) {
      return;
    }
    if (!this.optionDataModel || this.optionDataModel.length === 0) {
      return;
    }
    this.optionSelected = this.optionDataModel[index];
    this.optionDataModel.splice(index, 1);
    this.optionTabledataSource.data = this.optionDataModel;
    this.optionActionTitle = 'ویرایش';
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
    this.router.navigate(['/polling/content/']);
  }
  receiveMap(model: leafletMap): void {
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
      if (lat === this.dataModel.Geolocationlatitude && lon === this.dataModel.Geolocationlongitude) {
        this.dataModel.Geolocationlatitude = null;
        this.dataModel.Geolocationlongitude = null;
        return;
      }
      this.mapMarker = Leaflet.marker([lat, lon]).addTo(this.mapModel);
      this.dataModel.Geolocationlatitude = lat;
      this.dataModel.Geolocationlongitude = lon;
    });

  }

  receiveZoom(mode: leafletMap): void {
  }
}
