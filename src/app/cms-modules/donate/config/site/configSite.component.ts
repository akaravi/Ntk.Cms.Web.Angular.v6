import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel,
  CoreEnumService,
  DataFieldInfoModel,
  FormInfoModel,
  DonateConfigurationService,
  DonateModuleConfigSiteAccessValuesModel,
  DonateModuleConfigSiteValuesModel,
  DonateModuleSiteStorageValuesModel,
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
  selector: 'app-hypershop-config-site',
  templateUrl: './configSite.component.html',
  styleUrls: ['./configSite.component.scss']
})
export class DonateConfigSiteComponent implements OnInit {
  requestLinkSiteId = 0;
  constructor(
    private configService: DonateConfigurationService,
    private cmsApiStore: NtkCmsApiStoreService,
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  dataSiteStorageModel = new DonateModuleSiteStorageValuesModel();
  dataConfigSiteValuesModel = new DonateModuleConfigSiteValuesModel();
  dataConfigSiteAccessValuesModel = new DonateModuleConfigSiteAccessValuesModel();
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
    this.router.navigate(['/core/site/modulelist']);
  }

  GetServiceSiteStorage(SiteId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    this.loading.Start('main');

    this.configService
      .ServiceSiteStorage(SiteId)
      .subscribe(
        async (next) => {
          this.loading.Stop('main');

          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataSiteStorageModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.Stop('main');

          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
  SetServiceSiteStorageSave(SiteId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';
    this.loading.Start('main');

    this.configService
      .ServiceSiteStorageSave(SiteId, this.dataSiteStorageModel)
      .subscribe(
        async (next) => {
          this.loading.Stop('main');

          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataSiteStorageModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.Stop('main');

          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
  GetServiceSiteConfig(SiteId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    this.loading.Start('main');

    this.configService
      .ServiceSiteConfig(SiteId)
      .subscribe(
        async (next) => {
          this.loading.Stop('main');

          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigSiteValuesModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.Stop('main');

          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
  SetServiceSiteConfigSave(SiteId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';
    this.loading.Start('main');

    this.configService
      .ServiceSiteConfigSave(SiteId, this.dataConfigSiteValuesModel)
      .subscribe(
        async (next) => {
          this.loading.Stop('main');

          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigSiteValuesModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.Stop('main');

          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
  GetServiceSiteAccess(SiteId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    this.loading.Start('main');

    this.configService
      .ServiceSiteAccess(SiteId)
      .subscribe(
        async (next) => {
          this.loading.Stop('main');

          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigSiteAccessValuesModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.Stop('main');

          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
  SetServiceSiteAccessSave(SiteId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ذخیره اطلاعات در سرور';
    this.formInfo.FormError = '';
    this.loading.Start('main');

    this.configService
      .ServiceSiteAccessSave(SiteId, this.dataConfigSiteAccessValuesModel)
      .subscribe(
        async (next) => {
          this.loading.Stop('main');

          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataConfigSiteAccessValuesModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.Stop('main');

          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }

}
