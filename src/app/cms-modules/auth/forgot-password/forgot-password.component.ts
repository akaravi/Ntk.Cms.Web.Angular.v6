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
  constructor(
    private coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private translate: TranslateService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.loading.cdr = this.cdr;
    this.RePasswordModel = '';
  }
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  dataModelforgetPasswordBySms: AuthUserForgetPasswordModel = new AuthUserForgetPasswordModel();
  dataModelforgetPasswordByEmail: AuthUserForgetPasswordModel = new AuthUserForgetPasswordModel();
  dataModelforgetPasswordEntryPinCode: AuthUserForgetPasswordEntryPinCodeModel = new AuthUserForgetPasswordEntryPinCodeModel();
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
    this.dataModelforgetPasswordBySms.CaptchaKey = this.captchaModel.Key;
    this.dataModelforgetPasswordEntryPinCode.Email = '';
    this.dataModelforgetPasswordEntryPinCode.Mobile = this.dataModelforgetPasswordBySms.Mobile;
    const pName = this.constructor.name + '.ServiceForgetPassword';
    this.loading.Start(pName, 'در خواست یاد آوری کلمه عبور ');

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
        this.loading.Stop(pName);
      },
        (error) => {
          this.cmsToastrService.typeError(error);
          this.formInfo.ButtonSubmittedEnabled = true;
          this.onCaptchaOrder();
          this.loading.Stop(pName);
        });
  }
  onActionSubmitOrderCodeByEmail(): void {
    this.formInfo.ButtonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelforgetPasswordByEmail.CaptchaKey = this.captchaModel.Key;
    this.dataModelforgetPasswordEntryPinCode.Mobile = '';
    this.dataModelforgetPasswordEntryPinCode.Email = this.dataModelforgetPasswordByEmail.Email;

    const pName = this.constructor.name + '.ServiceForgetPassword';
    this.loading.Start(pName, 'در خواست یاد آوری کلمه عبور ');
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
    this.dataModelforgetPasswordEntryPinCode.CaptchaKey = this.captchaModel.Key;

    const pName = this.constructor.name + '.ServiceForgetPasswordEntryPinCode';
    this.loading.Start(pName, 'بررسی کد در سرور');
    this.coreAuthService
      .ServiceForgetPasswordEntryPinCode(this.dataModelforgetPasswordEntryPinCode)
      .subscribe((res) => {
        if (res.IsSuccess) {
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Your_password_was_changed_successfully'));
          setTimeout(() => this.router.navigate(['/']), 1000);
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
    this.dataModelforgetPasswordBySms.CaptchaText = '';
    const pName = this.constructor.name + '.ServiceCaptcha';
    this.loading.Start(pName, 'دریافت محتوای عکس امنیتی');
    this.coreAuthService.ServiceCaptcha().subscribe(
      (next) => {
        this.captchaModel = next.Item;
        this.onCaptchaOrderInProcess = false;
        this.loading.Stop(pName);
      },
      (error) => {
        this.onCaptchaOrderInProcess = false;
        this.loading.Stop(pName);
      }
    );
  }
  changeforgetState(model: string): void {
    this.forgetState = model;
  }
}
