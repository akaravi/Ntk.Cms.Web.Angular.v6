import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserSignInModel, CaptchaModel, CoreAuthService, FormInfoModel } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TranslationService } from 'src/app/core/i18n/translation.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

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
    private cdr: ChangeDetectorRef,
  ) {
    this.loading.cdr = this.cdr;
  }

  loading=new  ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModel: AuthUserSignInModel = new AuthUserSignInModel();
  captchaModel: CaptchaModel = new CaptchaModel();
  expireDate: string;
  aoutoCaptchaOrder = 1;

  // KeenThemes mock, change it to:
  hasError: boolean;
  returnUrl: string;
  loginType = 'email';
  ngOnInit(): void {
    this.onCaptchaOrder();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';

  }
  onActionSubmit(): void {
    this.formInfo.ButtonSubmittedEnabled = false;
    this.hasError = false;
    this.dataModel.CaptchaKey = this.captchaModel.Key;
    this.dataModel.lang = this.translationService.getSelectedLanguage();
    const processName = this.constructor.name + '.ServiceSigninUser';
    this.loading.Start(processName, 'ورود به حساب کاربری');
    this.coreAuthService.ServiceSigninUser(this.dataModel).subscribe(
      (res) => {
        if (res.IsSuccess) {
          this.cmsToastrService.typeSuccessLogin();
          this.router.navigate(['/core/site/selection']);
        } else {
          this.formInfo.ButtonSubmittedEnabled = true;
          this.cmsToastrService.typeErrorLogin(res.ErrorMessage);
          this.onCaptchaOrder();
        }
        this.loading.Stop(processName);
      },
      (error) => {
        this.formInfo.ButtonSubmittedEnabled = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop(processName);
      }
    );
  }
  onloginTypeChange(model: string): void {
    this.loginType = model;
  }
  onCaptchaOrderInProcess = false;
  onCaptchaOrder(): void {
    if (this.onCaptchaOrderInProcess) {
      return;
    }
    this.dataModel.CaptchaText = '';
    const processName = this.constructor.name + '.ServiceCaptcha';
    this.loading.Start(processName, 'دریافت محتوای عکس امنیتی');
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
        this.loading.Stop(processName);
      },
      (error) => {
        this.onCaptchaOrderInProcess = false;
        this.loading.Stop(processName);
      }
    );
  }

}
