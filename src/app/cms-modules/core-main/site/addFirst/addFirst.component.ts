import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AuthRenewTokenModel,
  CaptchaModel,
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
    private router: Router
  ) {

  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  loading = new ProgressSpinnerModel();

  dataModel = new CoreSiteAddFirstSiteDtoModel();
  filterModel = new FilterModel();
  dataModelResultDomains = new ErrorExceptionResult<string>();
  captchaModel: CaptchaModel = new CaptchaModel();
  expireDate: string;
  aoutoCaptchaOrder = 1;

  formInfo: FormInfoModel = new FormInfoModel();
  modelDateSiteCategory = new CoreSiteCategoryModel();

  ngOnInit(): void {

    this.onCaptchaOrder();
    this.DataGetAccess();

  }

  DataGetAccess(): void {
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
        },
        (error) => {
          this.cmsToastrService.typeErrorGetAccess(error);
        }
      );
  }

  GetDomainList(): void {
    this.coreSiteService.ServiceGetRegDomains(this.dataModel.LinkSiteCategoryId).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResultDomains = next;
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
      }
    );
  }

  protocolSelect(): void {
  }

  domain(item): void {
    this.dataModel.Domain = item;
  }
  onCaptchaOrder(): void {
    this.dataModel.CaptchaText = '';
    this.coreAuthService.ServiceCaptcha().subscribe(
      (next) => {

        this.captchaModel = next.Item;
        this.expireDate = next.Item.Expire.split('+')[1];
        const startDate = new Date();
        const endDate = new Date(next.Item.Expire);
        const seconds = (endDate.getTime() - startDate.getTime());
        if (this.aoutoCaptchaOrder < 10) {
          this.aoutoCaptchaOrder = this.aoutoCaptchaOrder + 1;
          setTimeout(() => { this.onCaptchaOrder(); }, seconds);
        }
        if (!next.IsSuccess) {
          this.cmsToastrService.typeErrorGetCpatcha(next.ErrorMessage);
        }
      }
    );
  }
  onFormSubmit(): void {
    this.dataModel.CaptchaKey = this.captchaModel.Key;
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
    if (!this.dataModel.CaptchaText || this.dataModel.CaptchaText.length === 0) {
      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.The_content_of_Kapjas_photo_was_not_entered'));


      return;
    }
    this.formInfo.FormSubmitAllow = false;
    this.coreSiteService.ServiceAddFirstSite(this.dataModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.cmsToastrService.typeSuccessAddFirstSite();
          this.clickSelectSite(next.Item.Id);
        } else {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(next.ErrorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.formInfo.FormSubmitAllow = true;
      }
    );
  }

  clickSelectSite(Id: number): void {
    let authModel: AuthRenewTokenModel;
    authModel = new AuthRenewTokenModel();
    authModel.SiteId = Id;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (res) => {
        if (res.IsSuccess) {
          setTimeout(() => this.router.navigate([environment.cmsUiConfig.Pathdashboard]), 100);
        } else {
          this.onCaptchaOrder();
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.onCaptchaOrder();
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
