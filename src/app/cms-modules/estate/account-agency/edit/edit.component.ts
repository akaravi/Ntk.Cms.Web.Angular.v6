
import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  EstateAccountAgencyService,
  EstateAccountAgencyModel,
  DataFieldInfoModel,
  CoreUserModel,
  EnumManageUserAccessDataTypes,
  EstateAccountUserModel,
  EstateAccountAgencyUserModel,
  EstateAccountAgencyUserService,
  FilterModel,
  FilterDataModel,
  EstateAccountUserService,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import * as Leaflet from 'leaflet';
import { Map as leafletMap } from 'leaflet';
import { PoinModel } from 'src/app/core/models/pointModel';
import { TranslateService } from '@ngx-translate/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-estate-account-agency-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EstateAccountAgencyEditComponent implements OnInit {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstateAccountAgencyEditComponent>,
    public coreEnumService: CoreEnumService,
    public estateAccountAgencyService: EstateAccountAgencyService,
    private estateAccountUserService:EstateAccountUserService,
    private cmsToastrService: CmsToastrService,
    private estateAccountAgencyUserService: EstateAccountAgencyUserService,
    public publicHelper: PublicHelper,
    public tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestId = data.id;
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.tokenHelper.CheckIsAdmin();
    this.DataGetAccess();
    
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  fieldsInfoAgencyUser: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<EstateAccountAgencyModel> = new ErrorExceptionResult<EstateAccountAgencyModel>();
  dataModel: EstateAccountAgencyModel = new EstateAccountAgencyModel();
  dataEstateAccountAgencyUserModel: EstateAccountAgencyUserModel = new EstateAccountAgencyUserModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  fileManagerOpenForm = false;
  loadingOption = new ProgressSpinnerModel();
  
  optionTabledataSource = new MatTableDataSource<EstateAccountAgencyUserModel>();
  optionTabledisplayedColumns = ['LinkEstateAccountUserId','LinkEstateAccountAgencyId','AccessShareUserToAgency','AccessShareAgencyToUser','Action'];

  /** map */
  viewMap = false;
  private mapModel: leafletMap;
  mapMarker: any;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter = new PoinModel();

  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.Edit');
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();
    this.getEnumRecordStatus();
    this.DataGetAllGroup();
  }

  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  DataGetAccess(): void {
    this.estateAccountAgencyUserService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.fieldsInfoAgencyUser = this.publicHelper.fieldInfoConvertor(ret.access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.errorMessage);
          }
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
        }
      }
      );
  }
  DataGetOneContent(): void {

    this.formInfo.formAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.estateAccountAgencyService.setAccessLoad();
    this.estateAccountAgencyService.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
    this.estateAccountAgencyService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.title;
          this.formInfo.formAlert = '';
          const lat = this.dataModel.geolocationlatitude;
          const lon = this.dataModel.geolocationlongitude;
          if (lat > 0 && lon > 0) {
            this.mapMarkerPoints = [];
            this.mapMarkerPoints.push({ lat, lon });
            this.receiveMap();
          }
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }
  DataEditContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.sending_information_to_the_server'));

    this.estateAccountAgencyService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
        this.dataModelResult = ret;
        if (ret.isSuccess) {

          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

        this.formInfo.formSubmitAllow = true;
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
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

  receiveZoom(zoom: number): void {
  }
  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;

  }
  onActionSelectorUser(model: CoreUserModel | null): void {
    this.dataModel.linkCmsUserId = null;
    if (model && model.id > 0) {
      this.dataModel.linkCmsUserId = model.id;
    }
  }
  onStepClick(event: StepperSelectionEvent, stepper: any): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      // if (!this.formGroup.valid) {
      //   this.cmsToastrService.typeErrorFormInvalid();
      //   setTimeout(() => {
      //     stepper.selectedIndex = event.previouslySelectedIndex;
      //     // stepper.previous();
      //   }, 10);
      // }
    }
  }
   dataEstateAccountUserModel: EstateAccountAgencyUserModel[] = [];
  DataGetAllGroup(): void {

    if (this.requestId.length <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.formAlert = this.translate.instant('MESSAGE.Getting_access_category_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    const filteModelContent = new FilterModel();
    const filter = new FilterDataModel();
    filter.propertyName = 'linkEstateAccountAgencyId';
    filter.value = this.requestId;
    filteModelContent.filters.push(filter);

    this.estateAccountAgencyUserService.ServiceGetAll(filteModelContent).subscribe({
      next: (ret) => {
        this.dataEstateAccountUserModel = ret.listItems;
        this.optionTabledataSource.data = this.dataEstateAccountUserModel;

        if (ret.isSuccess) {
          this.formInfo.formAlert = '';
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }


  onActionDataGetAddGroup(): void {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.estateAccountAgencyUserService.ServiceAdd(this.dataEstateAccountAgencyUserModel).subscribe({
      next: (ret) => {
       
        if (ret.isSuccess) {
          this.formInfo.formAlert = '';
          this.optionTabledataSource.data = ret.listItems;
          this.DataGetAllGroup();
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    });
  
  }
  onActionDataGetDeleteGroup(model: EstateAccountAgencyUserModel): void {
    const pName = this.constructor.name + 'onActionDataGetDeleteGroup';
    this.loading.Start(pName);
    this.estateAccountAgencyUserService.ServiceDeleteEntity(model).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.cmsToastrService.typeSuccessRemove();
          this.DataGetAllGroup();
        } else {
          this.cmsToastrService.typeErrorRemove();
        }
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }

  onActionSelectorAccountUser(model: EstateAccountUserModel | null): void {
    this.dataEstateAccountAgencyUserModel.linkEstateAccountUserId = null;
    this.dataEstateAccountAgencyUserModel.linkEstateAccountAgencyId = this.requestId;
    if (model && model.id.length > 0) {
      this.dataEstateAccountAgencyUserModel.linkEstateAccountUserId = model.id;
    }

  }
  
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
