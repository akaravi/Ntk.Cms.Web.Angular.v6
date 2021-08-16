import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CaptchaModel,
  CoreAuthService,
  AuthUserForgetPasswordModel,
  AuthUserForgetPasswordEntryPinCodeModel,
  FormInfoModel
} from 'ntk-cms-api';
import { Router } from '@angular/router';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TranslateService } from '@ngx-translate/core';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-auth-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class AuthForgotPasswordComponent implements OnInit {
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  dataModelforgetPasswordBySms: AuthUserForgetPasswordModel = new AuthUserForgetPasswordModel();
  dataModelforgetPasswordByEmail: AuthUserForgetPasswordModel = new AuthUserForgetPasswordModel();
  dataModelforgetPasswordEntryPinCode: AuthUserForgetPasswordEntryPinCodeModel = new AuthUserForgetPasswordEntryPinCodeModel();
  captchaModel: CaptchaModel = new CaptchaModel();
  // private fields
  forgetState = 'sms';
  constructor(
    private coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private translate: TranslateService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.loading.cdr = this.cdr;
    this.RePassword = '';
  }
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  passwordIsValid = false;
  RePassword: string;
  ngOnInit(): void {
    this.onCaptchaOrder();
  }



  onActionSubmitOrderCodeBySms(): void {
    this.formInfo.ButtonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelforgetPasswordBySms.CaptchaKey = this.captchaModel.Key;
    this.dataModelforgetPasswordEntryPinCode.Email = '';
    this.dataModelforgetPasswordEntryPinCode.Mobile = this.dataModelforgetPasswordBySms.Mobile;
    const processName = this.constructor.name +'.ServiceForgetPassword';
    this.loading.Start(processName, 'در خواست یاد آوری کلمه عبور ');

    this.coreAuthService
      .ServiceForgetPassword(this.dataModelforgetPasswordBySms)
      .subscribe((res) => {
        if (res.IsSuccess) {
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.The_activation_code_was_texted_with_you'));
          this.forgetState = 'entrycode';
        }
        else {
          this.cmsToastrService.typeErrorMessage(res.ErrorMessage);
        }
        this.formInfo.ButtonSubmittedEnabled = true;
        this.onCaptchaOrder();
        this.loading.Stop(processName);
      },
        (error) => {
          this.cmsToastrService.typeError(error);
          this.formInfo.ButtonSubmittedEnabled = true;
          this.onCaptchaOrder();
          this.loading.Stop(processName);
        });
  }
  onActionSubmitOrderCodeByEmail(): void {
    this.formInfo.ButtonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelforgetPasswordByEmail.CaptchaKey = this.captchaModel.Key;
    this.dataModelforgetPasswordEntryPinCode.Mobile = '';
    this.dataModelforgetPasswordEntryPinCode.Email = this.dataModelforgetPasswordByEmail.Email;

    const processName = this.constructor.name + '.ServiceForgetPassword';
    this.loading.Start(processName, 'در خواست یاد آوری کلمه عبور ');
    this.coreAuthService
      .ServiceForgetPassword(this.dataModelforgetPasswordByEmail)
      .subscribe((res) => {
        if (res.IsSuccess) {
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.The_activation_code_was_emailed_to_you'));

          this.forgetState = 'entrycode';
        }
        else {
          this.cmsToastrService.typeErrorMessage(res.ErrorMessage);
        }
        this.formInfo.ButtonSubmittedEnabled = true;
        this.onCaptchaOrder();
        this.loading.Stop(processName);
      },
        (error) => {
          this.cmsToastrService.typeError(error);
          this.formInfo.ButtonSubmittedEnabled = true;
          this.onCaptchaOrder();
          this.loading.Stop(processName);
        });
  }
  onActionSubmitEntryPinCode(): void {
    this.formInfo.ButtonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelforgetPasswordEntryPinCode.CaptchaKey = this.captchaModel.Key;

    const processName = this.constructor.name + '.ServiceForgetPasswordEntryPinCode';
    this.loading.Start(processName, 'بررسی کد در سرور');
    this.coreAuthService
      .ServiceForgetPasswordEntryPinCode(this.dataModelforgetPasswordEntryPinCode)
      .subscribe((res) => {
        if (res.IsSuccess) {
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Your_password_was_changed_successfully'));
          this.router.navigate(['/']);
        }
        else {
          this.cmsToastrService.typeErrorMessage(res.ErrorMessage);
        }
        this.formInfo.ButtonSubmittedEnabled = true;
        this.onCaptchaOrder();
        this.loading.Stop(processName);
      },
        (error) => {
          this.cmsToastrService.typeError(error);
          this.formInfo.ButtonSubmittedEnabled = true;
          this.onCaptchaOrder();
          this.loading.Stop(processName);
        }
      );
  }
  passwordValid(event): void {
    this.passwordIsValid = event;
  }
  onCaptchaOrderInProcess = false;

  onCaptchaOrder(): void {
    if (this.onCaptchaOrderInProcess) {
      return;
    }
    this.dataModelforgetPasswordBySms.CaptchaText = '';
    const processName = this.constructor.name + '.ServiceCaptcha';
    this.loading.Start(processName, 'دریافت محتوای عکس امنیتی');
    this.coreAuthService.ServiceCaptcha().subscribe(
      (next) => {
        this.captchaModel = next.Item;
        this.onCaptchaOrderInProcess = false;
        this.loading.Stop(processName);
      },
      (error) => {
        this.onCaptchaOrderInProcess = false;
        this.loading.Stop(processName);
      }
    );
  }
  changeforgetState(model: string): void {
    this.forgetState = model;
  }
}
