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

@Component({
  selector: 'app-polling-content-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'
  ]
})
export class PollingContentAddComponent implements OnInit, AfterViewInit {
  requestCategoryId = 0;
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
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.loadingOption.cdr = this.cdr;

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  dataModel = new PollingContentModel();
  dataAccessModel: AccessModel;
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
    this.requestCategoryId = + Number(this.activatedRoute.snapshot.paramMap.get('CategoryId'));
    if (this.requestCategoryId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.dataModel.LinkCategoryId = this.requestCategoryId;

    this.DataGetAccess();
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
    if (this.requestCategoryId <= 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }

    this.DataEditContent();


  }
  DataGetAccess(): void {
    this.pollingContentService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.IsSuccess) {
            this.dataAccessModel = ret.Access;
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.ErrorMessage);
          }
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
        }
      }
      );
  }
  DataGetOne(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.pollingContentService
      .ServiceGetOneById(this.dataModelResult.Item.Id)
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);
          this.dataModelResult = ret;
          this.formInfo.FormSubmitAllow = true;

          if (ret.IsSuccess) {
            this.dataModel = ret.Item;
            const lat = this.dataModel.Geolocationlatitude;
            const lon = this.dataModel.Geolocationlongitude;
            if (lat > 0 && lon > 0) {
              this.mapMarkerPoints = [];
              this.mapMarkerPoints.push({ lat, lon });
              this.receiveMap();
            }
            this.DataOptionGetAll();
            this.loading.Stop(pName);

          } else {
            this.cmsToastrService.typeErrorGetOne(ret.ErrorMessage);
          }
        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
        }
      }
      );
  }
  DataOptionGetAll(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.Receiving_Options_From_The_Server');
    this.formInfo.FormError = '';
    this.loadingOption.Start('main');


    const filteModel = new FilterModel();

    const filter = new FilterDataModel();
    filter.PropertyName = 'LinkPollingContentId';
    filter.Value = this.dataModelResult.Item.Id;
    filteModel.Filters.push(filter);
    this.pollingOptionService
      .ServiceGetAll(filteModel)
      .subscribe({
        next: (ret) => {
          this.loadingOption.Stop('main');
          this.formInfo.FormSubmitAllow = true;
          this.dataOptionModelResult = ret;
          if (ret.IsSuccess) {
            this.optionDataModel = ret.ListItems;
            this.optionTabledataSource.data = ret.ListItems;
          } else {
            this.cmsToastrService.typeErrorGetAll(ret.ErrorMessage);
          }
        },
        error: (er) => {
          this.loadingOption.Stop('main');
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetAll(er);
        }
      }
      );
  }


  DataAddContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.pollingContentService
      .ServiceAdd(this.dataModel)
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);
          this.dataModelResult = ret;
          if (ret.IsSuccess) {
            this.cmsToastrService.typeSuccessAdd();
            this.dataModel = ret.Item;
          } else {
            this.cmsToastrService.typeErrorAdd(ret.ErrorMessage);
          }
          this.formInfo.FormAlert = '';
          this.formInfo.FormSubmitAllow = true;
        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(er);
        }
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
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);

          this.formInfo.FormSubmitAllow = true;
          this.dataModelResult = ret;
          if (ret.IsSuccess) {

            this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
            this.cmsToastrService.typeSuccessEdit();

            setTimeout(() => this.router.navigate(['/polling/content']), 1000);
          } else {
            this.cmsToastrService.typeErrorEdit(ret.ErrorMessage);
          }
          this.loading.Stop(pName);

        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeError(er);;
        }
      }
      );
  }

  onActionSelectorSelect(model: PollingCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
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
      this.pollingOptionService.ServiceEdit(this.optionSelected).subscribe({
        next: (ret) => {
          if (ret.IsSuccess) {
            this.optionSelected = new PollingOptionModel();
            this.optionActionTitle = this.translate.instant('ACTION.Add_To_List');
            this.optionSelected = new PollingOptionModel();
            this.DataOptionGetAll();
          }
          else {
            this.cmsToastrService.typeErrorEdit(ret.ErrorMessage);
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
      this.optionSelected.LinkPollingContentId = this.dataModelResult.Item.Id;
      this.pollingOptionService.ServiceAdd(this.optionSelected).subscribe({
        next: (ret) => {
          if (ret.IsSuccess) {
            this.optionSelected = new PollingOptionModel();
            this.optionActionTitle = this.translate.instant('ACTION.Add_To_List');
            this.optionSelected = new PollingOptionModel();
            this.DataOptionGetAll();
          } else {
            this.cmsToastrService.typeErrorAdd(ret.ErrorMessage);
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
    this.pollingOptionService.ServiceDelete(this.optionSelected.Id).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.DataOptionGetAll();
          this.optionSelected = new PollingOptionModel();
        } else {
          this.cmsToastrService.typeErrorRemove(ret.ErrorMessage);
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
    if (!this.dataModelResult || !this.dataModelResult.Item || this.dataModelResult.Item.Id <= 0) {
      this.DataAddContent();
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

  onActionSelectorLocation(model: CoreLocationModel | null): void {
    if (!model || !model.Id || model.Id <= 0) {
      const message = this.translate.instant('MESSAGE.Information_area_deleted');
      this.cmsToastrService.typeWarningSelected(message);
      this.dataModel.LinkLocationId = null;
      return;
    }
    this.dataModel.LinkLocationId = model.Id;
  }
}
