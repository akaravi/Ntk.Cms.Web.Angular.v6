import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CaptchaModel,
  CoreAuthService,
  FormInfoModel,
  AuthUserSignInBySmsDtoModel,
  EnumManageUserAccessTokenTypes
} from 'ntk-cms-api';
import { Router } from '@angular/router';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'src/app/core/i18n/translation.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-auth-singin-bysms',
  templateUrl: './singin-bysms.component.html',
  styleUrls: ['./singin-bysms.component.scss'],
})
export class AuthSingInBySmsComponent implements OnInit {
  constructor(
    private coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private translate: TranslateService,
    private router: Router,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loading.cdr = this.cdr;
    this.RePasswordModel = '';
  }
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  dataModelAuthUserSignInBySms: AuthUserSignInBySmsDtoModel = new AuthUserSignInBySmsDtoModel();
  captchaModel: CaptchaModel = new CaptchaModel();
  // private fields
  forgetState = 'sms';
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  passwordIsValid = false;
  RePasswordModel = '';
  onCaptchaOrderInProcess = false;
  ngOnInit(): void {
    this.onCaptchaOrder();
  }



  onActionSubmitOrderCodeBySms(): void {
    this.formInfo.ButtonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelAuthUserSignInBySms.CaptchaKey = this.captchaModel.Key;
    this.dataModelAuthUserSignInBySms.lang = this.translationService.getSelectedLanguage();

    const pName = this.constructor.name + '.ServiceSigninUserBySMS';
    this.loading.Start(pName, 'ارسال درخواست ورود با یک بار رمز');
    this.coreAuthService
      .ServiceSigninUserBySMS(this.dataModelAuthUserSignInBySms)
      .subscribe((res) => {
        if (res.IsSuccess) {
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.The_login_code_was_texted_with_you'));
          this.forgetState = 'entrycode';
        }
        else {
          this.cmsToastrService.typeErrorMessage(res.ErrorMessage);
        }
        this.formInfo.ButtonSubmittedEnabled = true;
        this.onCaptchaOrder();
        this.loading.Stop(pName);
      },
        (error) => {
          this.cmsToastrService.typeError(error);
          this.formInfo.ButtonSubmittedEnabled = true;
          this.onCaptchaOrder();
          this.loading.Stop(pName);
        });
  }

  onActionSubmitEntryPinCode(): void {
    this.formInfo.ButtonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelAuthUserSignInBySms.CaptchaKey = this.captchaModel.Key;
    this.dataModelAuthUserSignInBySms.UserAccessTokenType = EnumManageUserAccessTokenTypes.ControlPanel;
    this.dataModelAuthUserSignInBySms.lang = this.translationService.getSelectedLanguage();
    const pName = this.constructor.name + '.ServiceSigninUserBySMS';
    this.loading.Start(pName, 'ارسال درخواست ورود با یک بار رمز');
    /** read storage */
    const siteId = + localStorage.getItem('siteId');
    if (siteId > 0) {
      this.dataModelAuthUserSignInBySms.SiteId = siteId;
    }
    const ResellerSiteId = + localStorage.getItem('ResellerSiteId');
    if (ResellerSiteId > 0) {
      this.dataModelAuthUserSignInBySms.ResellerSiteId = ResellerSiteId;
    }
    const ResellerUserId = + localStorage.getItem('ResellerUserId');
    if (ResellerUserId > 0) {
      this.dataModelAuthUserSignInBySms.ResellerUserId = ResellerUserId;
    }
    /** read storage */

    this.coreAuthService
      .ServiceSigninUserBySMS(this.dataModelAuthUserSignInBySms)
      .subscribe((res) => {
        if (res.IsSuccess) {
          this.cmsToastrService.typeSuccessLogin();
          if (res.Item.SiteId > 0) {
            setTimeout(() => this.router.navigate(['/dashboard']), 1000);
          }
          else {
            setTimeout(() => this.router.navigate(['/core/site/selection']), 1000);
          }
        }
        else {
          this.cmsToastrService.typeErrorMessage(res.ErrorMessage);
        }
        this.formInfo.ButtonSubmittedEnabled = true;
        this.onCaptchaOrder();
        this.loading.Stop(pName);
      },
        (error) => {
          this.cmsToastrService.typeError(error);
          this.formInfo.ButtonSubmittedEnabled = true;
          this.onCaptchaOrder();
          this.loading.Stop(pName);
        }
      );
  }
  passwordValid(event): void {
    this.passwordIsValid = event;
  }

  onCaptchaOrder(): void {
    if (this.onCaptchaOrderInProcess) {
      return;
    }
    this.dataModelAuthUserSignInBySms.CaptchaText = '';
    const pName = this.constructor.name + '.ServiceCaptcha';
    this.loading.Start(pName, 'دریافت محتوای عکس امنیتی');
    this.coreAuthService.ServiceCaptcha().subscribe(
      (next) => {
        this.captchaModel = next.Item;
        this.onCaptchaOrderInProcess = false;
        this.loading.Stop(pName);
      }
      , (error) => {
        this.onCaptchaOrderInProcess = false;
        this.loading.Stop(pName);
      }
    );
  }
  changeforgetState(model: string): void {
    this.forgetState = model;
  }
}
