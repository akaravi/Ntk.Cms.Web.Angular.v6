import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel, ApplicationEnumService,
  ApplicationAppModel,
  ApplicationAppService,
  CoreEnumService,
  DataFieldInfoModel,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  ApplicationSourceModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ApplicationThemeConfigModel } from 'ntk-cms-api';
import { PoinModel } from 'src/app/core/models/pointModel';
import { Map as leafletMap } from 'leaflet';
import * as Leaflet from 'leaflet';
import { TranslateService } from '@ngx-translate/core';
import { NodeInterface, TreeModel } from 'src/filemanager-api';
import { CmsMapComponent } from 'src/app/shared/cms-map/cms-map.component';
@Component({
  selector: 'app-aplication-app-edit',
  templateUrl: './edit.component.html',
})
export class ApplicationAppEditComponent implements OnInit {
  requestId = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public applicationEnumService: ApplicationEnumService,
    private applicationAppService: ApplicationAppService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private router: Router) {
    this.loading.cdr = this.cdr;
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  @ViewChild(CmsMapComponent) childMap: CmsMapComponent;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModel = new ApplicationAppModel();
  dataModelResult: ErrorExceptionResult<ApplicationAppModel> = new ErrorExceptionResult<ApplicationAppModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumLangResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenFormAboutUsLinkImageId = false;
  fileManagerOpenFormLinkFileIdIcon = false;
  fileManagerOpenFormLinkFileIdLogo = false;
  fileManagerOpenFormLinkFileIdSplashScreen = false;
  fileManagerOpenFormLinkMainImageId = false;
  appLanguage = 'fa';
  fileManagerTree: TreeModel;
  mapMarker: any;
  private mapModel: leafletMap;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter = new PoinModel();
  ngOnInit(): void {
    this.requestId = + Number(this.activatedRoute.snapshot.paramMap.get('Id'));
    if (!this.requestId || this.requestId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.DataGetOne(this.requestId);
    this.getEnumRecordStatus();
    this.getEnumLang();
  }
  getEnumLang(): void {
    this.coreEnumService.ServiceEnumLanguage().subscribe((res) => {
      this.dataModelEnumLangResult = res;
    });
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }
    if (this.dataModel.LinkSourceId <= 0) {
      this.cmsToastrService.typeErrorAdd(this.translate.instant('MESSAGE.Specify_the_source_code_of_the_program'));
      return;
    }
    if (this.dataModel.LinkThemeConfigId <= 0) {
      this.cmsToastrService.typeErrorAdd(this.translate.instant('MESSAGE.Specify_the_application_format'));
      return;
    }
    this.DataEditContent();
  }
  DataGetOne(requestId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'ServiceGetOneById';
    this.loading.Start(pName,this.translate.instant('MESSAGE.get_information_from_the_server'));
    /*َAccess Field*/
    this.applicationAppService.setAccessLoad();
    this.applicationAppService
      .ServiceGetOneById(requestId)
      .subscribe(
        async (next) => {
          /*َAccess Field*/
          this.dataAccessModel = next.Access;
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
          this.dataModelResult = next;
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataModel = next.Item;
            const lat = this.dataModel.AboutUsGeolocationlatitude;
            const lon = this.dataModel.AboutUsGeolocationlongitude;
            if (lat > 0 && lon > 0) {
              this.mapMarkerPoints = [];
              this.mapMarkerPoints.push({ lat, lon });
              this.receiveMap();
            }
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
          this.loading.Stop(pName);
        },
        (error) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(pName);
        }
      );
  }
  DataEditContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName,this.translate.instant('MESSAGE.sending_information_to_the_server'));
    this.applicationAppService
      .ServiceEdit(this.dataModel)
      .subscribe(
        async (next) => {
          this.formInfo.FormSubmitAllow = !next.IsSuccess;
          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
            this.cmsToastrService.typeSuccessEdit();
            setTimeout(() => this.router.navigate(['/application/app/']), 1000);
          } else {
            this.cmsToastrService.typeErrorEdit(next.ErrorMessage);
          }
          this.loading.Stop(pName);
        },
        (error) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorEdit(error);
          this.loading.Stop(pName);
        }
      );
  }
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
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
      if (lat === this.dataModel.AboutUsGeolocationlatitude && lon === this.dataModel.AboutUsGeolocationlongitude) {
        this.dataModel.AboutUsGeolocationlatitude = null;
        this.dataModel.AboutUsGeolocationlongitude = null;
        return;
      }
      this.mapMarker = Leaflet.marker([lat, lon]).addTo(this.mapModel);
      this.dataModel.AboutUsGeolocationlatitude = lat;
      this.dataModel.AboutUsGeolocationlongitude = lon;
    });
  }
  onActionBackToParent(): void {
    this.router.navigate(['/application/app/']);
  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileIdIcon(model: NodeInterface): void {
    this.dataModel.LinkFileIdIcon = model.id;
    this.dataModel.LinkFileIdIconSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileIdLogo(model: NodeInterface): void {
    this.dataModel.LinkFileIdLogo = model.id;
    this.dataModel.LinkFileIdLogoSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileIdSplashScreen(model: NodeInterface): void {
    this.dataModel.LinkFileIdSplashScreen = model.id;
    this.dataModel.LinkFileIdSplashScreenSrc = model.downloadLinksrc;
  }
  onActionFileSelectedAboutUsLinkImageId(model: NodeInterface): void {
    this.dataModel.AboutUsLinkImageId = model.id;
    this.dataModel.AboutUsLinkImageIdSrc = model.downloadLinksrc;
  }
  onActionSelectSource(model: ApplicationSourceModel | null): void {
    if (!model || model.Id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        'سورس را مشخص کنید',
        'سورس اپلیکیشن اطلاعات مشخص نیست'
      );
      return;
    }
    if (this.dataModel.LinkSourceId !== model.Id) {
      this.cmsToastrService.typeErrorMessage(
        'سورس قابل تغییر نمی باشد',
        'سورس اپلیکیشن در حالت ویرایش قابل تغییر نمی باشد'
      );
    }
  }
  onActionSelectTheme(model: ApplicationThemeConfigModel | null): void {
    if (!model || model.Id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        'قالب را مشخص کنید',
        'قالب اپلیکیشن اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.LinkThemeConfigId = model.Id;
  }
  ActionCurrentPoint(): void {
    this.childMap.getPosition().then(pos => {
      const lat = pos.lat;
      const lon = pos.lon;
      if (lat > 0 && lon > 0) {
        if (this.mapMarker !== undefined) {
          this.mapModel.removeLayer(this.mapMarker);
        }
        this.mapMarkerPoints = [];
        this.mapMarkerPoints.push({ lat, lon });
        this.dataModel.AboutUsGeolocationlatitude = lat;
        this.dataModel.AboutUsGeolocationlongitude = lon;
        this.receiveMap();
      }
    });
  }
}
