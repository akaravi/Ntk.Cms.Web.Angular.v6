import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthUserSignInModel, AuthUserSignUpModel, CaptchaModel, CoreAuthService, EnumManageUserAccessTokenTypes, FormInfoModel } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { MatDialog } from '@angular/material/dialog';
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
  ) {
    this.loading.cdr = this.cdr;
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  Roulaccespt = false;
  isLoading$: Observable<boolean>;
  captchaModel: CaptchaModel = new CaptchaModel();
  expireDate: string;
  aoutoCaptchaOrder = 1;
  passwordIsValid = false;
  dataModel: AuthUserSignUpModel = new AuthUserSignUpModel();
  onCaptchaOrderInProcess = false;
  ngOnInit(): void {
    this.onCaptchaOrder();
  }
  ngOnDestroy(): void {
  }
  onActionSubmit(): void {

    if (!this.dataModel.Email || this.dataModel.Email.length === 0) {
      this.formInfo.FormError = 'آدرس ایمیل خود را وارد کنید';
      this.formInfo.FormErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.FormError);
      return;
    }
    if (!this.dataModel.Name || this.dataModel.Name.length === 0) {
      this.formInfo.FormError = 'نام خود را وارد کنید';
      this.formInfo.FormErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.FormError);
      return;
    }
    if (!this.dataModel.Family || this.dataModel.Family.length === 0) {
      this.formInfo.FormError = 'نام خانوادگی خود را وارد کنید';
      this.formInfo.FormErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.FormError);
      return;
    }
    if (!this.dataModel.Password || this.dataModel.Password.length === 0) {
      this.formInfo.FormError = 'کلمه عبور را وارد کنید';
      this.formInfo.FormErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.FormError);
      return;
    }
    if (!this.dataModel.RePassword || this.dataModel.RePassword.length === 0) {
      this.formInfo.FormError = 'تکرار کلمه عبور را وارد کنید';
      this.formInfo.FormErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.FormError);
      return;
    }
    if (!this.dataModel.CaptchaText || this.dataModel.CaptchaText.length === 0) {
      this.formInfo.FormError = 'محتوای عکس امنیتی را وارد کنید';
      this.formInfo.FormErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.FormError);
      return;
    }
    if (this.dataModel.Password !== this.dataModel.RePassword) {
      this.formInfo.FormError = 'محتوای کلمه عبور و تکرار کلمه عبور متفاوت است';
      this.dataModel.Password = '';
      this.dataModel.RePassword = '';
      this.formInfo.FormErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.FormError);
      return;
    }
    this.formInfo.FormErrorStatus = false;
    this.dataModel.CaptchaKey = this.captchaModel.Key;
    const pName = this.constructor.name + '.ServiceSignupUser';
    this.loading.Start(pName, 'در حال ساخت حساب کاربری جدید');
    const siteId = + localStorage.getItem('siteId');
    if (siteId > 0) {
      this.dataModel.SiteId = siteId;
    }
    this.coreAuthService.ServiceSignupUser(this.dataModel).subscribe((next) => {
      if (next.IsSuccess) {
        this.cmsToastrService.typeSuccessRegistery();
        this.formInfo.FormErrorStatus = false;
        // setTimeout(() => this.router.navigate(['/']), 1000);

        /** Login */
        const dataLoginModel = new AuthUserSignInModel();
        dataLoginModel.CaptchaKey = this.dataModel.CaptchaKey;
        dataLoginModel.CaptchaText = this.dataModel.CaptchaText;
        dataLoginModel.Email = this.dataModel.Email;
        dataLoginModel.Password = this.dataModel.Password;
        dataLoginModel.SiteId = this.dataModel.SiteId;
        dataLoginModel.Mobile = this.dataModel.Mobile;
        dataLoginModel.UserAccessTokenType = EnumManageUserAccessTokenTypes.ControlPanel;
        const pName2 = this.constructor.name + 'ServiceSigninUser';
        this.loading.Start(pName2, 'ورود به حساب کاربری');
        this.coreAuthService.ServiceSigninUser(dataLoginModel).subscribe(
          (res) => {
            if (res.IsSuccess) {
              this.cmsToastrService.typeSuccessLogin();
              if (res.Item.SiteId > 0) {
                setTimeout(() => this.router.navigate(['/dashboard']), 1000);
              }
              else {
                setTimeout(() => this.router.navigate(['/core/site/selection']), 1000);
              }
            } else {
              this.formInfo.ButtonSubmittedEnabled = true;
              this.cmsToastrService.typeErrorLogin(res.ErrorMessage);
              setTimeout(() => this.router.navigate(['/']), 1000);
            }
            this.loading.Stop(pName2);
          },
          (error) => {
            this.formInfo.ButtonSubmittedEnabled = true;
            this.cmsToastrService.typeError(error);
            this.loading.Stop(pName2);
          }
        );
        /** Login */
      } else {
        this.cmsToastrService.typeErrorRegistery(next.ErrorMessage);
        this.formInfo.FormErrorStatus = true;
        this.onCaptchaOrder();
      }
      this.loading.Stop(pName);
    }, (error) => {
      this.cmsToastrService.typeError(error);
      this.formInfo.FormErrorStatus = true;
      this.onCaptchaOrder();
      this.loading.Stop(pName);
    });
  }

  onRoulaccespt(): void {
    const dialogRef = this.dialog.open(SingupRuleComponent);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      this.Roulaccespt = result;
    });
  }
  passwordValid(event): void {
    this.passwordIsValid = event;
  }

  onCaptchaOrder(): void {
    if (this.onCaptchaOrderInProcess) {
      return;
    }
    this.dataModel.CaptchaText = '';
    const pName = this.constructor.name + '.ServiceCaptcha';
    this.loading.Start(pName, 'دریافت محتوای عکس امنیتی');
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
        this.onCaptchaOrderInProcess = false;
        this.loading.Stop(pName);
      }
      , (error) => {
        this.onCaptchaOrderInProcess = false;
        this.loading.Stop(pName);
      }
    );
  }
}
