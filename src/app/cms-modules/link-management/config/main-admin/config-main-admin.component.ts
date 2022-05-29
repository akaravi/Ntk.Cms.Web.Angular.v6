//**msh */
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel,
  CoreEnumService,
  DataFieldInfoModel,
  FormInfoModel,
  LinkManagementConfigurationService,
  LinkManagementModuleConfigAdminMainValuesModel,
  LinkManagementModuleConfigSiteAccessValuesModel,
  LinkManagementModuleConfigSiteValuesModel,
  TokenInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TreeModel } from 'src/filemanager-api';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { PoinModel } from 'src/app/core/models/pointModel';


@Component({
  selector: 'app-linkmanagement-config-mainadmin',
  templateUrl: './config-main-admin.component.html',
})
export class LinkManagementConfigMainAdminComponent implements OnInit, OnDestroy {
  requestLinkSiteId = 0;
  constructor(
    private configService: LinkManagementConfigurationService,
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  dataConfigSiteValuesDefaultModel = new LinkManagementModuleConfigSiteValuesModel();
  dataConfigSiteAccessValuesDefaultModel = new LinkManagementModuleConfigSiteAccessValuesModel();
  dataConfigAdminMainModel = new LinkManagementModuleConfigAdminMainValuesModel();
  tokenInfo = new TokenInfoModel();

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenForm = false;
  appLanguage = 'fa';

  fileManagerTree: TreeModel;
  mapMarker: any;
  mapOptonCenter = new PoinModel();

  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.requestLinkSiteId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkSiteId'));

    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.onLoadDate();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.onLoadDate();
    });

    this.onLoadDate();
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }

  onLoadDate(): void {
    if (!this.requestLinkSiteId || this.requestLinkSiteId === 0) {
      this.requestLinkSiteId = this.tokenInfo.SiteId;
    }
    if (this.tokenInfo.UserAccessAdminAllowToProfessionalData) {
      this.GetServiceSiteConfigDefault();
      this.GetServiceSiteAccessDefault();
      this.GetServiceAdminMain();
    }

  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }
    if (this.tokenInfo.UserAccessAdminAllowToProfessionalData) {
      this.SetServiceSiteConfigDefaultSave();
      this.SetServiceSiteAccessDefaultSave();
      this.SetServiceAdminMainSave();
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

  onActionBackToParent(): void {
    this.router.navigate(['/core/site/']);
  }

  GetServiceSiteConfigDefault(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';

    const pName = this.constructor.name + 'ServiceSiteConfigDefault';
    this.loading.Start(pName, 'دریافت تنظیمات پیش فرض ماژول');
    this.configService
      .ServiceSiteConfigDefault()
      .subscribe({
        next: (ret) => {
          this.formInfo.FormSubmitAllow = true;
          if (ret.IsSuccess) {
            this.dataConfigSiteValuesDefaultModel = ret.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.ErrorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
  SetServiceSiteConfigDefaultSave(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';


    const pName = this.constructor.name + 'ServiceSiteConfigDefault';
    this.loading.Start(pName, 'ذخیره تنظیمات پیش فرض ماژول');
    this.configService
      .ServiceSiteConfigDefaultSave(this.dataConfigSiteValuesDefaultModel)
      .subscribe({
        next: (ret) => {
          if (ret.IsSuccess) {
            this.dataConfigSiteValuesDefaultModel = ret.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.ErrorMessage);
          }
          this.formInfo.FormSubmitAllow = true;
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
        }
      }
      );
  }

  GetServiceSiteAccessDefault(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';

    const pName = this.constructor.name + 'ServiceSiteAccessDefault';
    this.loading.Start(pName, 'دریافت دسترسی پیش فرض ماژول');
    this.configService
      .ServiceSiteAccessDefault()
      .subscribe({
        next: (ret) => {
          this.formInfo.FormSubmitAllow = true;
          if (ret.IsSuccess) {
            this.dataConfigSiteAccessValuesDefaultModel = ret.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.ErrorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
  SetServiceSiteAccessDefaultSave(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';

    const pName = this.constructor.name + 'ServiceSiteAccessDefaultSave';
    this.loading.Start(pName, 'ذخیره دسترسی پیش فرض ماژول');
    this.configService
      .ServiceSiteAccessDefaultSave(this.dataConfigSiteAccessValuesDefaultModel)
      .subscribe({
        next: (ret) => {
          this.formInfo.FormSubmitAllow = true;
          if (ret.IsSuccess) {
            this.dataConfigSiteAccessValuesDefaultModel = ret.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.ErrorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
  GetServiceAdminMain(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';

    const pName = this.constructor.name + 'ServiceAdminMain';
    this.loading.Start(pName, 'دریافت تنظیمات ماژول');
    this.configService
      .ServiceAdminMain()
      .subscribe({
        next: (ret) => {
          this.formInfo.FormSubmitAllow = true;
          if (ret.IsSuccess) {
            this.dataConfigAdminMainModel = ret.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.ErrorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
  SetServiceAdminMainSave(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';

    const pName = this.constructor.name + 'ServiceAdminMain';
    this.loading.Start(pName, 'ذخیره تنظیمات ماژول');
    this.configService
      .ServiceAdminMainSave(this.dataConfigAdminMainModel)
      .subscribe({
        next: (ret) => {
          this.formInfo.FormSubmitAllow = true;
          if (ret.IsSuccess) {
            this.dataConfigAdminMainModel = ret.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.ErrorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
}
