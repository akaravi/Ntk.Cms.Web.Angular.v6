import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  EstateAccountUserService,
  EstateAccountUserModel,
  DataFieldInfoModel,
  CoreLocationModel,
  CoreUserModel,
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
import {
  TreeModel,
} from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import * as Leaflet from 'leaflet';
import { Map as leafletMap } from 'leaflet';
import { PoinModel } from 'src/app/core/models/pointModel';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-estate-accountuser-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EstateAccountUserEditComponent implements OnInit {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstateAccountUserEditComponent>,
    public coreEnumService: CoreEnumService,
    public estateAccountUserService: EstateAccountUserService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    if (data) {
      this.requestId = data.id;
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<EstateAccountUserModel> = new ErrorExceptionResult<EstateAccountUserModel>();
  dataModel: EstateAccountUserModel = new EstateAccountUserModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  fileManagerOpenForm = false;
  

  /** map */
  viewMap = false;
  private mapModel: leafletMap;
  mapMarker: any;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter = {};

  ngOnInit(): void {
    this.formInfo.FormTitle = 'ویرایش  ';
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();
    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult=await this.publicHelper.getEnumRecordStatus();
  }

  DataGetOneContent(): void {

    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.Start('main');
    this.cdr.detectChanges();
    this.estateAccountUserService.setAccessLoad();
    this.estateAccountUserService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        this.dataModel = next.Item;
        if (next.IsSuccess) {
          const lat = this.dataModel.Geolocationlatitude;
          const lon = this.dataModel.Geolocationlongitude;
          if (lat > 0 && lon > 0) {
            this.mapMarkerPoints.push({ lat, lon });
          }
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.Title;
          this.formInfo.FormAlert = '';
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop('main');
    this.cdr.detectChanges();
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop('main');
    this.cdr.detectChanges();
      }
    );
  }
  DataEditContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    this.loading.Start('main');
    this.cdr.detectChanges();
    this.estateAccountUserService.ServiceEdit(this.dataModel).subscribe(
      (next) => {
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop('main');
    this.cdr.detectChanges();
        this.formInfo.FormSubmitAllow = true;
      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop('main');
    this.cdr.detectChanges();
      }
    );
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

  receiveZoom(zoom: number): void {
  }
  onActionSelectorUser(model: CoreUserModel | null): void {
    this.dataModel.LinkCmsUserId = null;
    if (model && model.Id > 0) {
      this.dataModel.LinkCmsUserId = model.Id;
    }
  }
  onActionSelectorLocation(model: CoreLocationModel | null): void {
    this.dataModel.LinkLocationId = null;
    if (model && model.Id > 0) {
      this.dataModel.LinkLocationId = model.Id;
    }
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
