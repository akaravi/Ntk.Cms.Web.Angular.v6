import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CaptchaModel,
  CoreAuthService,
  FormInfoModel,
  AuthUserSignInBySmsDtoModel
} from 'ntk-cms-api';
import { Router } from '@angular/router';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'src/app/core/i18n/translation.service';

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
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  dataModelAuthUserSignInBySms: AuthUserSignInBySmsDtoModel = new AuthUserSignInBySmsDtoModel();
  captchaModel: CaptchaModel = new CaptchaModel();
  // private fields
  forgetState = 'sms';
  constructor(
    private coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private translate: TranslateService,
    private router: Router,
    private translationService: TranslationService,
  ) {
    this.RePassword = '';
  }
  formInfo: FormInfoModel = new FormInfoModel();
  passwordIsValid = false;
  RePassword: string;
  ngOnInit(): void {
    this.onCaptchaOrder();
  }



  onActionSubmitOrderCodeBySms(): void {
    this.formInfo.ButtonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelAuthUserSignInBySms.CaptchaKey = this.captchaModel.Key;
    this.dataModelAuthUserSignInBySms.lang=this.translationService.getSelectedLanguage();

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
      },
        (error) => {
          this.cmsToastrService.typeError(error);
          this.formInfo.ButtonSubmittedEnabled = true;
          this.onCaptchaOrder();
        });
  }

  onActionSubmitEntryPinCode(): void {
    this.formInfo.ButtonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelAuthUserSignInBySms.CaptchaKey = this.captchaModel.Key;
    this.dataModelAuthUserSignInBySms.lang=this.translationService.getSelectedLanguage();

    this.coreAuthService
      .ServiceSigninUserBySMS(this.dataModelAuthUserSignInBySms)
      .subscribe((res) => {
        if (res.IsSuccess) {
          this.cmsToastrService.typeSuccessLogin();
          this.router.navigate(['/']);
        }
        else {
          this.cmsToastrService.typeErrorMessage(res.ErrorMessage);
        }
        this.formInfo.ButtonSubmittedEnabled = true;
        this.onCaptchaOrder();
      },
        (error) => {
          this.cmsToastrService.typeError(error);
          this.formInfo.ButtonSubmittedEnabled = true;
          this.onCaptchaOrder();
        }
      );
  }
  passwordValid(event): void {
    this.passwordIsValid = event;
  }
  onCaptchaOrder(): void {
    this.dataModelAuthUserSignInBySms.CaptchaText = '';
    this.coreAuthService.ServiceCaptcha().subscribe(
      (next) => {
        this.captchaModel = next.Item;
      }
    );
  }
  changeforgetState(model: string): void {
    this.forgetState = model;
  }
}
