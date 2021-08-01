import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel,
  CoreEnumService,
  DataFieldInfoModel,
  FormInfoModel,
  PollingConfigurationService,
  PollingModuleConfigAdminMainValuesModel,
  PollingModuleConfigSiteAccessValuesModel,
  PollingModuleConfigSiteValuesModel,
  PollingModuleSiteStorageValuesModel,
  NtkCmsApiStoreService,
  TokenInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TreeModel } from 'ntk-cms-filemanager';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-polling-config-mainadmin',
  templateUrl: './configMainAdmin.component.html',
  styleUrls: ['./configMainAdmin.component.scss']
})
export class PollingConfigMainAdminComponent implements OnInit {
  requestLinkSiteId = 0;
  constructor(
    private configService: PollingConfigurationService,
    private cmsApiStore: NtkCmsApiStoreService,
    private activatedRoute: ActivatedRoute,
    private cmsStoreService: CmsStoreService,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private translate: TranslateService,) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  dataConfigSiteValuesDefaultModel = new PollingModuleConfigSiteValuesModel();
  dataConfigSiteAccessValuesDefaultModel = new PollingModuleConfigSiteAccessValuesModel();
  dataConfigAdminMainModel = new PollingModuleConfigAdminMainValuesModel();
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

    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.tokenInfo = next;
      this.onLoadDate();
    });

    this.onLoadDate();
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
    this.router.navigate(['/core/site/modulelist']);
  }

  GetServiceSiteConfigDefault(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    this.loading.display = true;
    this.configService
      .ServiceSiteConfigDefault()
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigSiteValuesDefaultModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
  SetServiceSiteConfigDefaultSave(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    this.configService
      .ServiceSiteConfigDefaultSave(this.dataConfigSiteValuesDefaultModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigSiteValuesDefaultModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }

  GetServiceSiteAccessDefault(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    this.loading.display = true;
    this.configService
      .ServiceSiteAccessDefault()
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigSiteAccessValuesDefaultModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
  SetServiceSiteAccessDefaultSave(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    this.configService
      .ServiceSiteAccessDefaultSave(this.dataConfigSiteAccessValuesDefaultModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigSiteAccessValuesDefaultModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }

  GetServiceAdminMain(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    this.loading.display = true;
    this.configService
      .ServiceAdminMain()
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigAdminMainModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
  SetServiceAdminMainSave(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    this.configService
      .ServiceAdminMainSave(this.dataConfigAdminMainModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigAdminMainModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
}
