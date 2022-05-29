//**msh */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserSignInModel, CaptchaModel, CoreAuthService, FormInfoModel } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TranslationService } from 'src/app/core/i18n/translation.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-auth-singin',
  templateUrl: './singin.component.html',
  styleUrls: ['./singin.component.scss'],
})
export class AuthSingInComponent implements OnInit {
  constructor(
    private cmsToastrService: CmsToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private coreAuthService: CoreAuthService,
    private translationService: TranslationService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.firstRun = true;
  }
  firstRun = true;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModel: AuthUserSignInModel = new AuthUserSignInModel();
  captchaModel: CaptchaModel = new CaptchaModel();
  expireDate: string;
  aoutoCaptchaOrder = 1;
  // KeenThemes mock, change it to:
  hasError: boolean;
  returnUrl: string;
  loginType = 'email';
  onCaptchaOrderInProcess = false;
  ngOnInit(): void {
    this.onCaptchaOrder();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    if (this.firstRun) {
      this.dataModel.CaptchaText = '0000';
    }
  }
  onActionSubmit(): void {
    this.formInfo.ButtonSubmittedEnabled = false;
    this.hasError = false;
    this.dataModel.CaptchaKey = this.captchaModel.Key;
    this.dataModel.lang = this.translationService.getSelectedLanguage();
    const pName = this.constructor.name + '.ServiceSigninUser';
    this.loading.Start(pName, this.translate.instant('MESSAGE.login_to_user_account'));
    const siteId = + localStorage.getItem('siteId');
    if (siteId > 0) {
      this.dataModel.SiteId = siteId;
    }
    this.coreAuthService.ServiceSigninUser(this.dataModel).subscribe({
      next: (res) => {
        if (res.IsSuccess) {
          this.cmsToastrService.typeSuccessLogin();
          if (res.Item.SiteId > 0) {
            setTimeout(() => this.router.navigate(['/dashboard']), 1000);
          }
          else {
            setTimeout(() => this.router.navigate(['/core/site/selection']), 1000);
          }
        } else {
          this.firstRun = false;
          this.formInfo.ButtonSubmittedEnabled = true;
          this.cmsToastrService.typeErrorLogin(res.ErrorMessage);
          this.onCaptchaOrder();
        }
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.firstRun = false;
        this.formInfo.ButtonSubmittedEnabled = true;
        this.cmsToastrService.typeError(er);
        this.onCaptchaOrder();
        this.loading.Stop(pName);
      }
    }
    );
  }
  onloginTypeChange(model: string): void {
    this.loginType = model;
  }
  onCaptchaOrder(): void {
    if (this.onCaptchaOrderInProcess) {
      return;
    }
    this.dataModel.CaptchaText = '';
    const pName = this.constructor.name + '.ServiceCaptcha';
    this.loading.Start(pName, 'دریافت محتوای عکس امنیتی');
    this.coreAuthService.ServiceCaptcha().subscribe({
      next: (ret) => {
        this.captchaModel = ret.Item;
        this.expireDate = ret.Item.Expire.split('+')[1];
        const startDate = new Date();
        const endDate = new Date(ret.Item.Expire);
        const seconds = (endDate.getTime() - startDate.getTime());
        if (this.aoutoCaptchaOrder < 10) {
          this.aoutoCaptchaOrder = this.aoutoCaptchaOrder + 1;
          setTimeout(() => {
            if (!this.firstRun)
              this.onCaptchaOrder();
          }, seconds);
        }
        if (!ret.IsSuccess) {
          this.cmsToastrService.typeErrorGetCpatcha(ret.ErrorMessage);
        }
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
}