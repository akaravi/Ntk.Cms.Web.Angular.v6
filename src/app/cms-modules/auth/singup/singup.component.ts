
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthUserSignInModel, AuthUserSignUpModel, CaptchaModel, CoreAuthService, FormInfoModel } from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { SingupRuleComponent } from '../singupRule/singupRule.Component';
@Component({
  selector: 'app-auth-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss'],
})
export class AuthSingUpComponent implements OnInit, OnDestroy {
  constructor(
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private coreAuthService: CoreAuthService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  Roulaccespt = '';
  isLoading$: Observable<boolean>;
  captchaModel: CaptchaModel = new CaptchaModel();
  expireDate: string;
  aoutoCaptchaOrder = 1;
  passwordIsValid = false;
  dataModel: AuthUserSignUpModel = new AuthUserSignUpModel();
  onCaptchaOrderInProcess = false;
  RePasswordModel = '';
  PasswordView = false;
  loginAuto = false;
  ngOnInit(): void {
    this.onCaptchaOrder();
  }
  ngOnDestroy(): void {
  }
  onActionSubmit(): void {
    if (!this.dataModel.email || this.dataModel.email.length === 0) {
      this.formInfo.formError = this.translate.instant('ERRORMESSAGE.MESSAGE.enter_your_email_address');
      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    if (!this.dataModel.name || this.dataModel.name.length === 0) {
      this.formInfo.formError = this.translate.instant('ERRORMESSAGE.MESSAGE.enter_your_name');
      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    if (!this.dataModel.family || this.dataModel.family.length === 0) {
      this.formInfo.formError = this.translate.instant('ERRORMESSAGE.MESSAGE.enter_your_last_name');
      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    if (!this.dataModel.password || this.dataModel.password.length === 0) {
      this.formInfo.formError = this.translate.instant('ERRORMESSAGE.MESSAGE.enter_the_password');
      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    if (!this.RePasswordModel || this.RePasswordModel.length === 0) {
      this.formInfo.formError = this.translate.instant('ERRORMESSAGE.MESSAGE.re_enter_the_password');
      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    if (!this.dataModel.captchaText || this.dataModel.captchaText.length === 0) {
      this.formInfo.formError = this.translate.instant('MESSAGE.Receiving_information');
      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    if (this.dataModel.password !== this.RePasswordModel) {
      this.formInfo.formError = this.translate.instant('ERRORMESSAGE.MESSAGE.password_and_re_password_are_different');
      this.dataModel.password = '';
      this.RePasswordModel = '';
      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    this.formInfo.formErrorStatus = false;
    this.dataModel.captchaKey = this.captchaModel.key;
    const pName = this.constructor.name + '.ServiceSignupUser';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Creating_new_account'));
    /** read storage */
    const siteId = + localStorage.getItem('siteId');
    if (siteId > 0) {
      this.dataModel.siteId = siteId;
    }
    const ResellerSiteId = + localStorage.getItem('ResellerSiteId');
    if (ResellerSiteId > 0) {
      this.dataModel.resellerSiteId = ResellerSiteId;
    }
    const ResellerUserId = + localStorage.getItem('ResellerUserId');
    if (ResellerUserId > 0) {
      this.dataModel.resellerUserId = ResellerUserId;
    }
    /** read storage */
    this.coreAuthService.ServiceSignupUser(this.dataModel).subscribe((next) => {
      if (next.isSuccess) {
        this.cmsToastrService.typeSuccessRegistery();
        this.formInfo.formErrorStatus = false;
        if (!this.loginAuto) {
          setTimeout(() => this.router.navigate(['/']), 1000);
        }
        /** Login */
        if (this.loginAuto) {
          const dataLoginModel = new AuthUserSignInModel();
          dataLoginModel.captchaKey = this.dataModel.captchaKey;
          dataLoginModel.captchaText = this.dataModel.captchaText;
          dataLoginModel.email = this.dataModel.email;
          dataLoginModel.password = this.dataModel.password;
          dataLoginModel.siteId = this.dataModel.siteId;
          dataLoginModel.mobile = this.dataModel.mobile;
          const pName2 = this.constructor.name + 'ServiceSigninUser';
          this.loading.Start(pName2, this.translate.instant('MESSAGE.login_to_user_account'));
          this.coreAuthService.ServiceSigninUser(dataLoginModel).subscribe(
            (res) => {
              if (res.isSuccess) {
                this.cmsToastrService.typeSuccessLogin();
                if (res.item.siteId > 0) {
                  setTimeout(() => this.router.navigate(['/dashboard']), 1000);
                }
                else {
                  setTimeout(() => this.router.navigate(['/core/site/selection']), 1000);
                }
              } else {
                this.formInfo.buttonSubmittedEnabled = true;
                this.cmsToastrService.typeErrorLogin(res.errorMessage);
                setTimeout(() => this.router.navigate(['/']), 1000);
              }
              this.loading.Stop(pName2);
            },
            (error) => {
              this.formInfo.buttonSubmittedEnabled = true;
              this.cmsToastrService.typeError(error);
              this.loading.Stop(pName2);
            }
          );
        }
        /** Login */
      } else {
        this.cmsToastrService.typeErrorRegistery(next.errorMessage);
        this.formInfo.buttonSubmittedEnabled = true;
        this.formInfo.formErrorStatus = true;
        this.onCaptchaOrder();
      }
      this.loading.Stop(pName);
    }, (error) => {
      this.cmsToastrService.typeError(error);
      this.formInfo.formErrorStatus = true;
      this.formInfo.buttonSubmittedEnabled = true;
      this.onCaptchaOrder();
      this.loading.Stop(pName);
    });
  }
  onRoulaccespt(): void {
    const dialogRef = this.dialog.open(SingupRuleComponent, {
      height: "90%",
      width: "90%",
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      this.Roulaccespt = result;
      //console.log(result);
    });
  }
  passwordValid(event): void {
    this.passwordIsValid = event;
  }
  onCaptchaOrder(): void {
    if (this.onCaptchaOrderInProcess) {
      return;
    }
    this.dataModel.captchaText = '';
    const pName = this.constructor.name + '.ServiceCaptcha';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_security_photo_content'));
    this.coreAuthService.ServiceCaptcha().subscribe(
      (next) => {
        if (next.isSuccess) {
          this.captchaModel = next.item;
          this.expireDate = next.item.expire.split('+')[1];
          const startDate = new Date();
          const endDate = new Date(next.item.expire);
          const seconds = (endDate.getTime() - startDate.getTime());
          if (this.aoutoCaptchaOrder < 10) {
            this.aoutoCaptchaOrder = this.aoutoCaptchaOrder + 1;
            setTimeout(() => { this.onCaptchaOrder(); }, seconds);
          }
        } else {
          this.cmsToastrService.typeErrorGetCpatcha(next.errorMessage);
        }
        this.onCaptchaOrderInProcess = false;
        this.loading.Stop(pName);
      }
      , (error) => {
        this.onCaptchaOrderInProcess = false;
        this.loading.Stop(pName);
      }
    );
  }
  ActionPasswordGenerator(): void {
    // const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    const passwordLength = 10;
    let password = '';
    for (let i = 0; i <= passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    this.dataModel.password = password;
    this.RePasswordModel = password;
    this.PasswordView = true;
  }
}