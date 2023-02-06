
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as Leaflet from 'leaflet';
import { Map as leafletMap } from 'leaflet';
import {
  AccessModel, CoreEnumService, DataFieldInfoModel, EnumInfoModel, EnumManageUserAccessDataTypes, ErrorExceptionResult, FilterDataModel, FilterModel,
  FormInfoModel, PollingCategoryModel, PollingContentModel,
  PollingContentService, PollingOptionModel,
  PollingOptionService
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { CoreLocationModel } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { PoinModel } from 'src/app/core/models/pointModel';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

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
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.loadingOption.cdr = this.cdr;

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  requestId = 0;
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  dataModel = new PollingContentModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModelResult: ErrorExceptionResult<PollingContentModel> = new ErrorExceptionResult<PollingContentModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  optionSelected: PollingOptionModel = new PollingOptionModel();
  optionDataModel = new Array<PollingOptionModel>();
  optionTabledataSource = new MatTableDataSource<PollingOptionModel>();
  dataOptionModelResult: ErrorExceptionResult<PollingOptionModel> = new ErrorExceptionResult<PollingOptionModel>();
  optionActionTitle = this.translate.instant('ACTION.Add_To_List');
  optionActionButtomEnable = true;
  optionTabledisplayedColumns = ['Id', 'Option', 'OptionAnswer', 'IsCorrectAnswer', 'NumberOfVotes', 'ScoreOfVotes', 'Action'];


  loading = new ProgressSpinnerModel();
  loadingOption = new ProgressSpinnerModel();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypePodcast = ['mp3'];
  selectFileTypeMovie = ['mp4', 'webm'];
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
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    /*َAccess Field*/
    this.pollingContentService.setAccessLoad();
    this.pollingContentService.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
    this.pollingContentService
      .ServiceGetOneById(this.requestId)
      .subscribe({
        next: (ret) => {

          /*َAccess Field*/
          this.dataAccessModel = ret.access;
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

          this.loading.Stop(pName);

          this.dataModelResult = ret;
          this.formInfo.formSubmitAllow = true;

          if (ret.isSuccess) {
            this.dataModel = ret.item;
            const lat = this.dataModel.geolocationlatitude;
            const lon = this.dataModel.geolocationlongitude;
            if (lat > 0 && lon > 0) {
              this.mapMarkerPoints = [];
              this.mapMarkerPoints.push({ lat, lon });
              this.receiveMap();
            }
            this.DataOptionGetAll();
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
  DataOptionGetAll(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.Receiving_Options_From_The_Server');
    this.formInfo.formError = '';
    this.loadingOption.Start('main');


    const filterModel = new FilterModel();

    const filter = new FilterDataModel();
    filter.propertyName = 'LinkPollingContentId';
    filter.value = this.requestId;
    filterModel.filters.push(filter);
    this.pollingOptionService
      .ServiceGetAll(filterModel)
      .subscribe({
        next: (ret) => {
          this.loadingOption.Stop('main');
          this.formInfo.formSubmitAllow = true;
          this.dataOptionModelResult = ret;
          if (ret.isSuccess) {
            this.optionDataModel = ret.listItems;
            this.optionTabledataSource.data = ret.listItems;
          } else {
            this.cmsToastrService.typeErrorGetAll(ret.errorMessage);
          }
        },
        error: (er) => {
          this.loadingOption.Stop('main');
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


    this.pollingContentService
      .ServiceEdit(this.dataModel)
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);

          this.formInfo.formSubmitAllow = true;
          this.dataModelResult = ret;
          if (ret.isSuccess) {

            this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
            this.cmsToastrService.typeSuccessEdit();

            setTimeout(() => this.router.navigate(['/polling/content']), 1000);
          } else {
            this.cmsToastrService.typeErrorEdit(ret.errorMessage);
          }
          this.loading.Stop(pName);

        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeError(er);;
        }
      }
      );
  }
  onActionSelectorSelect(model: PollingCategoryModel | null): void {
    if (!model || model.id <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.linkCategoryId = model.id;
  }

  onActionOptionAddToList(): void {
    if (!this.optionSelected) {
      return;
    }
    if (this.optionDataModel.find(x => x.option === this.optionSelected.option)) {
      this.cmsToastrService.typeErrorAddDuplicate();
      return;
    }

    this.optionActionButtomEnable = false;
    if (this.optionSelected.id > 0) {
      this.pollingOptionService.ServiceEdit(this.optionSelected).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.optionSelected = new PollingOptionModel();
            this.optionActionTitle = this.translate.instant('ACTION.Add_To_List');
            this.optionSelected = new PollingOptionModel();
            this.DataOptionGetAll();
          }
          else {
            this.cmsToastrService.typeErrorEdit(ret.errorMessage);
          }
          this.optionActionButtomEnable = true;
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.optionActionButtomEnable = true;
        }
      }
      );
    }
    else {
      this.optionSelected.linkPollingContentId = this.requestId;
      this.pollingOptionService.ServiceAdd(this.optionSelected).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.optionSelected = new PollingOptionModel();
            this.optionActionTitle = this.translate.instant('ACTION.Add_To_List');
            this.optionSelected = new PollingOptionModel();
            this.DataOptionGetAll();
          } else {
            this.cmsToastrService.typeErrorAdd(ret.errorMessage);
          }
          this.optionActionButtomEnable = true;
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.optionActionButtomEnable = true;
        }
      }
      );

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
    this.pollingOptionService.ServiceDelete(this.optionSelected.id).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.DataOptionGetAll();
          this.optionSelected = new PollingOptionModel();
        } else {
          this.cmsToastrService.typeErrorRemove(ret.errorMessage);
        }
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
      }
    }
    );
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
    this.optionActionTitle = this.translate.instant('ACTION.EDIT');
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
}
