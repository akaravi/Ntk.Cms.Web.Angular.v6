import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  AuthRenewTokenModel,

  CoreAuthService,
  CoreSiteAddFirstSiteDtoModel,
  CoreSiteCategoryModel,
  CoreSiteCategoryService,
  CoreSiteService,
  DataFieldInfoModel,
  DomainModel, ErrorExceptionResult,
  FilterModel,
  FormInfoModel
} from 'ntk-cms-api';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { CmsToastrService } from '../../../../core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { FormGroup } from '@angular/forms';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-core-site-add-first',
  templateUrl: './addFirst.component.html',
  styleUrls: ['./addFirst.component.scss']
})
export class CoreSiteAddFirstComponent implements OnInit {

  constructor(
    private cmsToastrService: CmsToastrService,
    private coreSiteService: CoreSiteService,
    private translate: TranslateService,
    private publicHelper: PublicHelper,
    private coreAuthService: CoreAuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.loading.cdr = this.cdr;
    this.loadingDomain.cdr = this.cdr;
    this.formInfo.FormTitle = 'ایجاد اولین سامانه شما';
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  alphaExp = /^[a-zA-Z]+$/;

  loading = new ProgressSpinnerModel();
  loadingDomain = new ProgressSpinnerModel();

  dataModel = new CoreSiteAddFirstSiteDtoModel();
  filterModel = new FilterModel();
  dataModelResultDomains = new ErrorExceptionResult<string>();

  formInfo: FormInfoModel = new FormInfoModel();
  modelDateSiteCategory = new CoreSiteCategoryModel();
  validateDomain = true;
  ngOnInit(): void {
    this.DataGetAccess();
  }
  checkValidateDomain() {
    this.validateDomain = this.alphaExp.test(this.dataModel.SubDomain);
  }
  DataGetAccess(): void {
    const processName = 'DataGetAccess';
    this.loading.Start(processName);
    this.coreSiteService
      .ServiceViewModel()
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            // this.dataAccessModel = next.Access;
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(next.ErrorMessage);
          }
          this.loading.Stop(processName);
        },
        (error) => {
          this.cmsToastrService.typeErrorGetAccess(error);
          this.loading.Stop(processName);
        }
      );
  }

  GetDomainList(): void {
    const processName = 'GetDomainList';
    this.loadingDomain.Start(processName);
    this.coreSiteService.ServiceGetRegDomains(this.dataModel.LinkSiteCategoryId).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResultDomains = next;
          if (next.ListItems.length > 0) {
            this.dataModel.Domain = next.ListItems[0];
          }
          if (this.dataModel.SubDomain.length === 0) {
            this.dataModel.SubDomain = 'myname';
          }
        }
        this.loadingDomain.Stop(processName);
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loadingDomain.Stop(processName);
      }
    );
  }

  protocolSelect(): void {
  }

  domain(item): void {
    this.dataModel.Domain = item;
  }

  onFormSubmit(): void {
    if (this.dataModel.LinkSiteCategoryId <= 0) {
      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.System_type_not_selected'));
      return;
    }
    if (!this.dataModel.Title || this.dataModel.Title.length === 0) {
      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.As_the_system_is_not_selected'));

      return;
    }
    if (!this.dataModel.Domain || this.dataModel.Domain.length === 0) {

      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.System_domain_not_selected'));

      return;
    }
    if (!this.dataModel.SubDomain || this.dataModel.SubDomain.length === 0) {
      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.System_parent_domain_not_selected'));


      return;
    }

    this.formInfo.FormSubmitAllow = false;
    const processName = 'onFormSubmit';
    this.loading.Start(processName);
    this.coreSiteService.ServiceAddFirstSite(this.dataModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.cmsToastrService.typeSuccessAddFirstSite();
          this.clickSelectSite(next.Item.Id);
        } else {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(next.ErrorMessage);
        }
        this.loading.Stop(processName);
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.formInfo.FormSubmitAllow = true;
        this.loading.Stop(processName);
      }
    );
  }

  clickSelectSite(Id: number): void {
    const processName = 'clickSelectSite';
    this.loading.Start(processName);

    let authModel: AuthRenewTokenModel;
    authModel = new AuthRenewTokenModel();
    authModel.SiteId = Id;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (res) => {
        if (res.IsSuccess) {
          setTimeout(() => this.router.navigate([environment.cmsUiConfig.Pathdashboard]), 1000);
        }
        this.loading.Stop(processName);
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(processName);
      }
    );
  }
  onActionSelectorSelect(model: CoreSiteCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        'نوع سامانه را مشخص کنید',
        'نوع سامانه اطلاعات مشخص نیست'
      );
      return;
    }
    this.modelDateSiteCategory = model;
    this.dataModel.LinkSiteCategoryId = model.Id;
    this.GetDomainList();
  }
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      if (!this.formGroup.valid) {
        this.cmsToastrService.typeErrorFormInvalid();
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
      if (!this.dataModel.LinkSiteCategoryId || this.dataModel.LinkSiteCategoryId <= 0) {

        this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.System_type_not_selected'));
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
    }
  }
}
