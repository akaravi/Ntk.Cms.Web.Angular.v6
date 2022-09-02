
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AccessModel,
  CoreEnumService,
  DataFieldInfoModel,
  FormInfoModel,
  BankPaymentConfigurationService,
  BankPaymentModuleConfigSiteAccessValuesModel,
  BankPaymentModuleConfigSiteValuesModel,
  BankPaymentModuleSiteStorageValuesModel,
  TokenInfoModel,
  ErrorExceptionResult,
  EnumInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TreeModel } from 'ntk-cms-filemanager';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { PoinModel } from 'src/app/core/models/pointModel';
@Component({
  selector: 'app-bankpayment-config-site',
  templateUrl: './config-site.component.html',
})
export class BankPaymentConfigSiteComponent implements OnInit {
  requestLinkSiteId = 0;
  constructor(
    private configService: BankPaymentConfigurationService,
    private tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  dataSiteStorageModel = new BankPaymentModuleSiteStorageValuesModel();
  dataConfigSiteValuesModel = new BankPaymentModuleConfigSiteValuesModel();
  dataConfigSiteAccessValuesModel = new BankPaymentModuleConfigSiteAccessValuesModel();
  tokenInfo = new TokenInfoModel();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenForm = false;
  appLanguage = 'fa';
  fileManagerTree: TreeModel;
  mapMarker: any;
  mapOptonCenter = new PoinModel();
  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.onLoadDate();
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
      this.requestLinkSiteId = this.tokenInfo.siteId;
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
      if (this.tokenInfo.userAccessAdminAllowToProfessionalData) {
        this.SetServiceSiteStorageSave(this.requestLinkSiteId);
        this.SetServiceSiteAccessSave(this.requestLinkSiteId);
      }
    }
  }
  onStepClick(event: StepperSelectionEvent, stepper: any): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {

    }
  }
  onActionBackToParent(): void {
    this.router.navigate(['/core/site/']);
  }
  GetServiceSiteStorage(SiteId: number): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'ServiceSiteStorage';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_saved_module_values'));
    this.configService
      .ServiceSiteStorage(SiteId)
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = true;
          if (ret.isSuccess) {
            this.dataSiteStorageModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.formInfo.formSubmitAllow = true;
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetOne(er);
          this.formInfo.formSubmitAllow = true;
          this.loading.Stop(pName);
        }
      }
      );
  }
  SetServiceSiteStorageSave(SiteId: number): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.Saving_Information_On_The_Server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'ServiceSiteStorageSave';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Save_the_stored_values_​​of_the_module'));
    this.configService
      .ServiceSiteStorageSave(SiteId, this.dataSiteStorageModel)
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = true;
          if (ret.isSuccess) {
            this.dataSiteStorageModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.formInfo.formSubmitAllow = true;
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
  GetServiceSiteConfig(SiteId: number): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'ServiceSiteConfig';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_module_setting'));
    this.configService
      .ServiceSiteConfig(SiteId)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.dataConfigSiteValuesModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.formInfo.formSubmitAllow = true;
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
  SetServiceSiteConfigSave(SiteId: number): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.Saving_Information_On_The_Server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'ServiceSiteConfigSave';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Save_module_setting'));
    this.configService
      .ServiceSiteConfigSave(SiteId, this.dataConfigSiteValuesModel)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.dataConfigSiteValuesModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.formInfo.formSubmitAllow = true;
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
  GetServiceSiteAccess(SiteId: number): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'ServiceSiteAccess';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_module_access'));
    this.configService
      .ServiceSiteAccess(SiteId)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.dataConfigSiteAccessValuesModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.formInfo.formSubmitAllow = true;
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
  SetServiceSiteAccessSave(SiteId: number): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.Saving_Information_On_The_Server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'ServiceSiteAccessSave';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Save_module_access'));
    this.configService
      .ServiceSiteAccessSave(SiteId, this.dataConfigSiteAccessValuesModel)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.dataConfigSiteAccessValuesModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.formInfo.formSubmitAllow = true;
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetOne(er);
          this.formInfo.formSubmitAllow = true;
          this.loading.Stop(pName);
        }
      }
      );
  }
}