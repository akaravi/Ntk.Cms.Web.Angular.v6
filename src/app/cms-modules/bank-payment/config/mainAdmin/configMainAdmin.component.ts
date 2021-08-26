import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel,
  CoreEnumService,
  DataFieldInfoModel,
  FormInfoModel,
  BankPaymentConfigurationService,
  BankPaymentModuleConfigAdminMainValuesModel,
  BankPaymentModuleConfigSiteAccessValuesModel,
  BankPaymentModuleConfigSiteValuesModel,
  NtkCmsApiStoreService,
  TokenInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TreeModel } from 'projects/ntk-cms-filemanager/src/public-api';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';


@Component({
  selector: 'app-bankpayment-config-mainadmin',
  templateUrl: './configMainAdmin.component.html',
  styleUrls: ['./configMainAdmin.component.scss']
})
export class BankPaymentConfigMainAdminComponent implements OnInit {
  requestLinkSiteId = 0;
  constructor(
    private configService: BankPaymentConfigurationService,
    private cmsApiStore: NtkCmsApiStoreService,
    private activatedRoute: ActivatedRoute,
    private tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  dataConfigSiteValuesDefaultModel = new BankPaymentModuleConfigSiteValuesModel();
  dataConfigSiteAccessValuesDefaultModel = new BankPaymentModuleConfigSiteAccessValuesModel();
  dataConfigAdminMainModel = new BankPaymentModuleConfigAdminMainValuesModel();

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
  mapOptonCenter = {};

  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.requestLinkSiteId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkSiteId'));

    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
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

    const processName = this.constructor.name + 'ServiceSiteConfigDefault';
    this.loading.Start(processName, 'دریافت تنظیمات پیش فرض ماژول');
    this.configService
      .ServiceSiteConfigDefault()
      .subscribe(
        async (next) => {
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigSiteValuesDefaultModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
          this.loading.Stop(processName);
        },
        (error) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(processName);
        }
      );
  }
  SetServiceSiteConfigDefaultSave(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';
    this.loading.Start(this.constructor.name + 'main');

    
    const processName = this.constructor.name + 'ServiceSiteConfigDefault';
    this.loading.Start(processName, 'ذخیره تنظیمات پیش فرض ماژول');
    this.configService
      .ServiceSiteConfigDefaultSave(this.dataConfigSiteValuesDefaultModel)
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.dataConfigSiteValuesDefaultModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
          this.formInfo.FormSubmitAllow = true;
          this.loading.Stop(processName);
        },
        (error) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(processName);
        }
      );
  }

  GetServiceSiteAccessDefault(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';

    const processName = this.constructor.name + 'ServiceSiteAccessDefault';
    this.loading.Start(processName, 'دریافت دسترسی پیش فرض ماژول');
    this.configService
      .ServiceSiteAccessDefault()
      .subscribe(
        async (next) => {
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigSiteAccessValuesDefaultModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
          this.loading.Stop(processName);
        },
        (error) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(processName);
        }
      );
  }
  SetServiceSiteAccessDefaultSave(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';

    const processName = this.constructor.name + 'ServiceSiteAccessDefaultSave';
    this.loading.Start(processName, 'ذخیره دسترسی پیش فرض ماژول');
    this.configService
      .ServiceSiteAccessDefaultSave(this.dataConfigSiteAccessValuesDefaultModel)
      .subscribe(
        async (next) => {
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigSiteAccessValuesDefaultModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
          this.loading.Stop(processName);
        },
        (error) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(processName);
        }
      );
  }
  GetServiceAdminMain(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    
    const processName = this.constructor.name + 'ServiceAdminMain';
    this.loading.Start(processName, 'دریافت تنظیمات ماژول');
    this.configService
      .ServiceAdminMain()
      .subscribe(
        async (next) => {
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigAdminMainModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
          this.loading.Stop(processName);
        },
        (error) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(processName);
        }
      );
  }
  SetServiceAdminMainSave(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';
    
    const processName = this.constructor.name + 'ServiceAdminMain';
    this.loading.Start(processName, 'ذخیره تنظیمات ماژول');
    this.configService
      .ServiceAdminMainSave(this.dataConfigAdminMainModel)
      .subscribe(
        async (next) => {
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigAdminMainModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
          this.loading.Stop(processName);
        },
        (error) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(processName);
        }
      );
  }
}
