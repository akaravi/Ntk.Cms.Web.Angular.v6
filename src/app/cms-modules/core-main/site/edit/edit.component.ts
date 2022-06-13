//**msh */
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel,
  CoreSiteModel,
  CoreSiteService,
  CoreEnumService,
  DataFieldInfoModel,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreSiteCategoryModel,
  TokenInfoModel,
  CoreUserModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { NodeInterface, TreeModel } from 'src/filemanager-api';
import { PoinModel } from 'src/app/core/models/pointModel';
import { Map as leafletMap } from 'leaflet';
import * as Leaflet from 'leaflet';
import { TranslateService } from '@ngx-translate/core';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { Subscription } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
@Component({
  selector: 'app-core-site-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class CoreSiteEditComponent implements OnInit, OnDestroy {
  requestId = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private coreSiteService: CoreSiteService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.requestId = + Number(this.activatedRoute.snapshot.paramMap.get('Id'));
    if (this.requestId === 0 && this.tokenInfo && this.tokenInfo.siteId>0) {
      this.requestId = this.tokenInfo.siteId;
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      if (this.requestId === 0 && this.tokenInfo && this.tokenInfo.siteId>0)  {
        this.requestId = this.tokenInfo.siteId;
      }
      this.DataGetOne(this.requestId);
    });
    
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      if (this.requestId === 0 && this.tokenInfo && this.tokenInfo.siteId>0)  {
        this.requestId = this.tokenInfo.siteId;
      }
      this.DataGetOne(this.requestId);
    });
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModel = new CoreSiteModel();
  dataModelResult: ErrorExceptionResult<CoreSiteModel> = new ErrorExceptionResult<CoreSiteModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumSiteStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumLanguageResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenFormAboutUsLinkImageId = false;
  fileManagerOpenFormLinkFavIconId = false;
  fileManagerOpenFormPwaIconSize190x192Id = false;
  fileManagerOpenFormPwaIconSize512x512Id = false;
  fileManagerOpenFormLinkFileIdLogo = false;
  fileManagerOpenFormLinkImageLogoId = false;
  appLanguage = 'fa';
  tokenInfo = new TokenInfoModel();
  cmsApiStoreSubscribe: Subscription;
  fileManagerTree: TreeModel;
  mapMarker: any;
  private mapModel: leafletMap;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter = new PoinModel();
  keywordDataModel = [];
  ngOnInit(): void {
    this.getEnumRecordStatus();
    this.getEnumSiteStatus();
    this.getEnumLanguage();

  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  getEnumSiteStatus(): void {
    this.coreEnumService.ServiceEnumSiteStatus().subscribe((next) => {
      this.dataModelEnumSiteStatusResult = next;
    });
  }
  getEnumLanguage(): void {
    this.coreEnumService.ServiceEnumLanguage().subscribe((next) => {
      this.dataModelEnumLanguageResult = next;
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
    if (this.dataModel.linkCreatedBySiteId <= 0) {
      this.cmsToastrService.typeErrorEdit('سورس کد برنامه مشخص  کنید');

      return;
    }
    this.dataModel.seoKeyword = '';
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
        this.dataModel.seoKeyword = listKeyword.join(',');
      }
    }
    this.DataEditContent();
  }
  DataGetOne(id: number): void {
    if(!id || id<=0)
    return;
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    /*َAccess Field*/
    this.coreSiteService.setAccessLoad();
    this.coreSiteService
      .ServiceGetOneById(id)
      .subscribe({
        next: (ret) => {
          /*َAccess Field*/
          this.dataAccessModel = ret.access;
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          this.dataModelResult = ret;
          this.formInfo.formSubmitAllow = true;
          if (ret.isSuccess) {
            this.dataModel = ret.item;
            const lat = this.dataModel.aboutUsGeolocationlatitude;
            const lon = this.dataModel.aboutUsGeolocationlongitude;
            if (lat > 0 && lon > 0) {
              this.mapMarkerPoints = [];
              this.mapMarkerPoints.push({ lat, lon });
              this.receiveMap();
            }
            this.keywordDataModel = [];
            if (this.dataModel.seoKeyword && this.dataModel.seoKeyword.length > 0) {
              this.keywordDataModel = this.dataModel.seoKeyword.split(',');
            }
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
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
    this.coreSiteService
      .ServiceEdit(this.dataModel)
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = !ret.isSuccess;
          this.dataModelResult = ret;
          if (ret.isSuccess) {
            this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
            this.cmsToastrService.typeSuccessEdit();
            this.formInfo.formSubmitAllow = true;
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
      if (lat === this.dataModel.aboutUsGeolocationlatitude && lon === this.dataModel.aboutUsGeolocationlongitude) {
        this.dataModel.aboutUsGeolocationlatitude = null;
        this.dataModel.aboutUsGeolocationlongitude = null;
        return;
      }
      this.mapMarker = Leaflet.marker([lat, lon]).addTo(this.mapModel);
      this.dataModel.aboutUsGeolocationlatitude = lat;
      this.dataModel.aboutUsGeolocationlongitude = lon;
    });
  }
  onActionBackToParent(): void {
    this.router.navigate(['/core/site/']);
  }
  onActionFileSelectedAboutUsLinkImageId(model: NodeInterface): void {
    this.dataModel.aboutUsLinkImageId = model.id;
    this.dataModel.aboutUsLinkImageIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFavIconId(model: NodeInterface): void {
    this.dataModel.linkFavIconId = model.id;
    this.dataModel.linkFavIconIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedPwaIconSize190x192Id(model: NodeInterface): void {
    this.dataModel.pwaIconSize190x192Id = model.id;
    this.dataModel.pwaIconSize190x192IdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedPwaIconSize512x512Id(model: NodeInterface): void {
    this.dataModel.linkFavIconId = model.id;
    this.dataModel.pwaIconSize512x512IdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkImageLogoId(model: NodeInterface): void {
    this.dataModel.linkImageLogoId = model.id;
    this.dataModel.linkImageLogoIdSrc = model.downloadLinksrc;
  }
  onActionSelectCategory(model: CoreSiteCategoryModel | null): void {
    if (!model || model.id <= 0) {
      const message = 'دسته بندی سایت مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.linkSiteCategoryId = model.id;
  }
  onActionSelectorLinkResellerSiteIdSelect(model: CoreSiteModel | null): void {
    this.dataModel.linkResellerSiteId = null;
    if (!model || model.id <= 0) {
      return;
    }
    this.dataModel.linkResellerSiteId = model.id;
  }
  onActionSelectorLinkResellerUserIdSelect(model: CoreUserModel | null): void {
    this.dataModel.linkResellerUserId = null;
    if (!model || model.id <= 0) {
      return;
    }
    this.dataModel.linkResellerUserId = model.id;
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