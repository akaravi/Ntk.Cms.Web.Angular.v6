import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, ApplicationConfigurationService,
  ApplicationModuleConfigAdminMainValuesModel,
  ApplicationModuleConfigSiteAccessValuesModel,
  ApplicationModuleConfigSiteValuesModel, CoreEnumService,
  DataFieldInfoModel,
  FormInfoModel, TokenInfoModel
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { PoinModel } from 'src/app/core/models/pointModel';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-application-config-mainadmin',
  templateUrl: './config-main-admin.component.html',
})
export class ApplicationConfigMainAdminComponent implements OnInit, OnDestroy {
  requestLinkSiteId = 0;
  constructor(
    private configService: ApplicationConfigurationService,
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  dataConfigSiteValuesDefaultModel = new ApplicationModuleConfigSiteValuesModel();
  dataConfigSiteAccessValuesDefaultModel = new ApplicationModuleConfigSiteAccessValuesModel();
  dataConfigAdminMainModel = new ApplicationModuleConfigAdminMainValuesModel();
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
      this.requestLinkSiteId = this.tokenInfo.siteId;
    }
    if (this.tokenInfo.userAccessAdminAllowToProfessionalData) {
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
    if (this.tokenInfo.userAccessAdminAllowToProfessionalData) {
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
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.formError = '';

    const pName = this.constructor.name + 'ServiceSiteConfigDefault';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_the_module_default_settings'));
    this.configService
      .ServiceSiteConfigDefault()
      .subscribe(
        async (next) => {
          this.formInfo.formSubmitAllow = true;
          if (next.isSuccess) {
            this.dataConfigSiteValuesDefaultModel = next.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.errorMessage);
          }
          this.loading.Stop(pName);
        },
        (error) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(pName);
        }
      );
  }
  SetServiceSiteConfigDefaultSave(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.Saving_Information_On_The_Server');
    this.formInfo.formError = '';

    const pName = this.constructor.name + 'ServiceSiteConfigDefault';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Save_module_default_setting'));
    this.configService
      .ServiceSiteConfigDefaultSave(this.dataConfigSiteValuesDefaultModel)
      .subscribe(
        async (next) => {
          if (next.isSuccess) {
            this.dataConfigSiteValuesDefaultModel = next.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.errorMessage);
          }
          this.formInfo.formSubmitAllow = true;
          this.loading.Stop(pName);
        },
        (error) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(pName);
        }
      );
  }

  GetServiceSiteAccessDefault(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.formError = '';

    const pName = this.constructor.name + 'ServiceSiteAccessDefault';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_the_module_default_access'));
    this.configService
      .ServiceSiteAccessDefault()
      .subscribe(
        async (next) => {
          this.formInfo.formSubmitAllow = true;
          if (next.isSuccess) {
            this.dataConfigSiteAccessValuesDefaultModel = next.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.errorMessage);
          }
          this.loading.Stop(pName);
        },
        (error) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(pName);
        }
      );
  }
  SetServiceSiteAccessDefaultSave(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.Saving_Information_On_The_Server');
    this.formInfo.formError = '';

    const pName = this.constructor.name + 'ServiceSiteAccessDefaultSave';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Save_the_module_default_access'));
    this.configService
      .ServiceSiteAccessDefaultSave(this.dataConfigSiteAccessValuesDefaultModel)
      .subscribe(
        async (next) => {
          this.formInfo.formSubmitAllow = true;
          if (next.isSuccess) {
            this.dataConfigSiteAccessValuesDefaultModel = next.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.errorMessage);
          }
          this.loading.Stop(pName);
        },
        (error) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(pName);
        }
      );
  }
  GetServiceAdminMain(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.formError = '';

    const pName = this.constructor.name + 'ServiceAdminMain';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_module_setting'));
    this.configService
      .ServiceAdminMain()
      .subscribe(
        async (next) => {
          this.formInfo.formSubmitAllow = true;
          if (next.isSuccess) {
            this.dataConfigAdminMainModel = next.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.errorMessage);
          }
          this.loading.Stop(pName);
        },
        (error) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(pName);
        }
      );
  }
  SetServiceAdminMainSave(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.Saving_Information_On_The_Server');
    this.formInfo.formError = '';

    const pName = this.constructor.name + 'ServiceAdminMain';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Save_module_setting'));
    this.configService
      .ServiceAdminMainSave(this.dataConfigAdminMainModel)
      .subscribe(
        async (next) => {
          this.formInfo.formSubmitAllow = true;
          if (next.isSuccess) {
            this.dataConfigAdminMainModel = next.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.errorMessage);
          }
          this.loading.Stop(pName);
        },
        (error) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(pName);
        }
      );
  }
}
