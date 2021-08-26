import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel,
  CoreEnumService,
  DataFieldInfoModel,
  FormInfoModel,
  BlogConfigurationService,
  BlogModuleConfigSiteAccessValuesModel,
  BlogModuleConfigSiteValuesModel,
  BlogModuleSiteStorageValuesModel,
  NtkCmsApiStoreService,
  TokenInfoModel,
  ErrorExceptionResult,
  EnumModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TreeModel } from 'projects/ntk-cms-filemanager/src/public-api';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';


@Component({
  selector: 'app-blog-config-site',
  templateUrl: './configSite.component.html',
  styleUrls: ['./configSite.component.scss']
})
export class BlogConfigSiteComponent implements OnInit {
  requestLinkSiteId = 0;
  constructor(
    private configService: BlogConfigurationService,
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
  dataSiteStorageModel = new BlogModuleSiteStorageValuesModel();
  dataConfigSiteValuesModel = new BlogModuleConfigSiteValuesModel();
  dataConfigSiteAccessValuesModel = new BlogModuleConfigSiteAccessValuesModel();
  tokenInfo = new TokenInfoModel();

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenForm = false;
  appLanguage = 'fa';

  fileManagerTree: TreeModel;
  mapMarker: any;
  mapOptonCenter = {};

  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {

    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.onLoadDate();
    });

    this.onLoadDate();
    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  onLoadDate(): void {
    if (!this.requestLinkSiteId || this.requestLinkSiteId === 0) {
      this.requestLinkSiteId = this.tokenInfo.SiteId;
    }

    if (this.requestLinkSiteId > 0) {
      this.GetServiceSiteStorage(this.requestLinkSiteId);
      this.GetServiceSiteConfig(this.requestLinkSiteId);
      this.GetServiceSiteAccess(this.requestLinkSiteId);
    }
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }

    if (this.requestLinkSiteId > 0) {
      this.SetServiceSiteConfigSave(this.requestLinkSiteId);
      if (this.tokenInfo.UserAccessAdminAllowToProfessionalData) {
        this.SetServiceSiteStorageSave(this.requestLinkSiteId);
        this.SetServiceSiteAccessSave(this.requestLinkSiteId);
      }
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

  GetServiceSiteStorage(SiteId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    const processName = this.constructor.name + 'ServiceSiteStorage';
    this.loading.Start(processName, 'دریافت مقادیر ذخیره شده ماژول');

    this.configService
      .ServiceSiteStorage(SiteId)
      .subscribe(
        async (next) => {
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataSiteStorageModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
          this.formInfo.FormSubmitAllow = true;
          this.loading.Stop(processName);
        },
        (error) => {
          this.cmsToastrService.typeErrorGetOne(error);
          this.formInfo.FormSubmitAllow = true;
          this.loading.Stop(processName);
        }
      );
  }
  SetServiceSiteStorageSave(SiteId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';

    const processName = this.constructor.name + 'ServiceSiteStorageSave';
    this.loading.Start(processName, 'ذخیره مقادیر ذخیره شده ماژول');
    this.configService
      .ServiceSiteStorageSave(SiteId, this.dataSiteStorageModel)
      .subscribe(
        async (next) => {
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataSiteStorageModel = next.Item;
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
  GetServiceSiteConfig(SiteId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';

    const processName = this.constructor.name + 'ServiceSiteConfig';
    this.loading.Start(processName, 'دریافت تنظیمات ماژول');
    this.configService
      .ServiceSiteConfig(SiteId)
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.dataConfigSiteValuesModel = next.Item;
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
  SetServiceSiteConfigSave(SiteId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';
    const processName = this.constructor.name + 'ServiceSiteConfigSave';
    this.loading.Start(processName, 'ذخیره تنظیمات ماژول');

    this.configService
      .ServiceSiteConfigSave(SiteId, this.dataConfigSiteValuesModel)
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.dataConfigSiteValuesModel = next.Item;
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
  GetServiceSiteAccess(SiteId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';

    const processName = this.constructor.name + 'ServiceSiteAccess';
    this.loading.Start(processName, 'دریافت دسترسی های ماژول');

    this.configService
      .ServiceSiteAccess(SiteId)
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.dataConfigSiteAccessValuesModel = next.Item;
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
  SetServiceSiteAccessSave(SiteId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';



    const processName = this.constructor.name + 'ServiceSiteAccessSave';
    this.loading.Start(processName, 'ذخیره دسترسی های ماژول');

    this.configService
      .ServiceSiteAccessSave(SiteId, this.dataConfigSiteAccessValuesModel)
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.dataConfigSiteAccessValuesModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
          this.formInfo.FormSubmitAllow = true;
          this.loading.Stop(processName);
        },
        (error) => {
          this.cmsToastrService.typeErrorGetOne(error);
          this.formInfo.FormSubmitAllow = true;
          this.loading.Stop(processName);
        }
      );
  }


}
