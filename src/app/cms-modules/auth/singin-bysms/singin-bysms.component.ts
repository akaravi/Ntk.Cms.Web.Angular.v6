
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthUserSignInBySmsDtoModel, CaptchaModel,
  CoreAuthService,
  FormInfoModel
} from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { TranslationService } from 'src/app/core/i18n/translation.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}
export class processModel {
  progressBarValue: number;
  progressBarMaxValue: number;
  message: string;
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
    public translate: TranslateService,
    private router: Router,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
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
  prorocess: processModel;
  buttonnResendSmsDisable = true;
  onActionSubmitOrderCodeBySms(): void {

    if (this.forgetState == 'entrycode') {
      if (!this.dataModelAuthUserSignInBySms.captchaText || this.dataModelAuthUserSignInBySms.captchaText.length == 0) {
        this.cmsToastrService.typeWarningMessage(this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSetCpatcha'));
        return;
      }
    }
    this.formInfo.buttonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelAuthUserSignInBySms.captchaKey = this.captchaModel.key;
    this.dataModelAuthUserSignInBySms.lang = this.translationService.getSelectedLanguage();
    const pName = this.constructor.name + '.ServiceSigninUserBySMS';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Send_login_request_with_one_time_password'));
    this.coreAuthService
      .ServiceSigninUserBySMS(this.dataModelAuthUserSignInBySms)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.The_login_code_was_texted_with_you'));
            this.forgetState = 'entrycode';
            //TimeDown 
            this.prorocess = new processModel();
            this.prorocess.progressBarValue = 0;
            this.prorocess.progressBarMaxValue = 60;
            this.prorocess.message = '';
            this.buttonnResendSmsDisable = true;
            var timeleft = this.prorocess.progressBarMaxValue;
            let downloadTimer = setInterval(() => {
              this.prorocess.progressBarValue = this.prorocess.progressBarMaxValue - timeleft;
              this.prorocess.message = '(' + timeleft + ' ' + 'ثانیه' + ')';
              timeleft -= 1;
              if (timeleft <= 0) {
                this.buttonnResendSmsDisable = false;
                this.prorocess.message = '';
                clearInterval(downloadTimer);
              }
              this.cdr.detectChanges();

            }, 1000)
            //TimeDown 
          }
          else {
            this.cmsToastrService.typeErrorMessage(res.errorMessage);
          }
          this.formInfo.buttonSubmittedEnabled = true;
          this.onCaptchaOrder();
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.formInfo.buttonSubmittedEnabled = true;
          this.onCaptchaOrder();
          this.loading.Stop(pName);
        }
      });
  }
  onActionSubmitEntryPinCode(): void {
    this.formInfo.buttonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelAuthUserSignInBySms.captchaKey = this.captchaModel.key;
    this.dataModelAuthUserSignInBySms.lang = this.translationService.getSelectedLanguage();
    const pName = this.constructor.name + '.ServiceSigninUserBySMS';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Send_login_request_with_one_time_password'));
    /** read storage */
    const siteId = + localStorage.getItem('siteId');
    if (siteId > 0) {
      this.dataModelAuthUserSignInBySms.siteId = siteId;
    }
    const ResellerSiteId = + localStorage.getItem('ResellerSiteId');
    if (ResellerSiteId > 0) {
      this.dataModelAuthUserSignInBySms.resellerSiteId = ResellerSiteId;
    }
    const ResellerUserId = + localStorage.getItem('ResellerUserId');
    if (ResellerUserId > 0) {
      this.dataModelAuthUserSignInBySms.resellerUserId = ResellerUserId;
    }
    /** read storage */
    this.coreAuthService
      .ServiceSigninUserBySMS(this.dataModelAuthUserSignInBySms)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.cmsToastrService.typeSuccessLogin();
            this.formInfo.buttonSubmittedEnabled = false;
            if (res.item.siteId > 0) {
              setTimeout(() => this.router.navigate(['/dashboard']), 1000);
            }
            else {
              setTimeout(() => this.router.navigate(['/core/site/selection']), 1000);
            }
          }
          else {
            this.onCaptchaOrder();
            this.cmsToastrService.typeErrorMessage(res.errorMessage);
          }
          this.formInfo.buttonSubmittedEnabled = true;
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.formInfo.buttonSubmittedEnabled = true;
          this.onCaptchaOrder();
          this.loading.Stop(pName);
        }
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
    this.dataModelAuthUserSignInBySms.captchaText = '';
    const pName = this.constructor.name + '.ServiceCaptcha';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_security_photo_content'));
    this.coreAuthService.ServiceCaptcha().subscribe({
      next: (ret) => {
        this.captchaModel = ret.item;
        this.onCaptchaOrderInProcess = false;
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.onCaptchaOrderInProcess = false;
        this.loading.Stop(pName);
      }
    }
    );
  }
  changeforgetState(model: string): void {
    this.forgetState = model;
  }
}