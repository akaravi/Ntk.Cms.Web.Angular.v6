import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthRenewTokenModel, CoreAuthService, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TranslationService } from '../../core/i18n/translation.service';

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  static nextId = 0;
  id = ++LanguageSelectorComponent.nextId;
  language: LanguageFlag;
  languages: LanguageFlag[] = [
    {
      lang: 'fa',
      name: 'فارسی',
      flag: './assets/media/svg/flags/136-iran.svg',
    },
    {
      lang: 'ar',
      name: 'عربی',
      flag: './assets/media/svg/flags/008-saudi-arabia.svg',
    },
    {
      lang: 'en',
      name: 'English',
      flag: './assets/media/svg/flags/226-united-states.svg',
    },
    {
      lang: 'tr',
      name: 'Turkish',
      flag: './assets/media/svg/flags/006-turkey.svg',
    },
    {
      lang: 'zh',
      name: 'China',
      flag: './assets/media/svg/flags/015-china.svg',
    },
    {
      lang: 'es',
      name: 'Spanish',
      flag: './assets/media/svg/flags/128-spain.svg',
    },
    {
      lang: 'ja',
      name: 'Japanese',
      flag: './assets/media/svg/flags/063-japan.svg',
    },
    {
      lang: 'de',
      name: 'German',
      flag: './assets/media/svg/flags/162-germany.svg',
    },
    {
      lang: 'fr',
      name: 'French',
      flag: './assets/media/svg/flags/195-france.svg',
    },
  ];
  constructor(
    private translationService: TranslationService,
    public coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });


    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;
      this.setLanguage(value.language);
    });
  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo: TokenInfoModel = new TokenInfoModel();


  ngOnInit(): void {
    this.setSelectedLanguage();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        this.setSelectedLanguage();
      });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  setLanguageWithRefresh(lang: string): void {
    this.setLanguage(lang);
    /** */
    if (this.tokenInfo && this.tokenInfo.userId > 0) {
      const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
      authModel.userAccessAdminAllowToProfessionalData = this.tokenInfo.userAccessAdminAllowToProfessionalData;
      authModel.userAccessAdminAllowToAllData = this.tokenInfo.userAccessAdminAllowToAllData;
      authModel.userId = this.tokenInfo.userId;
      authModel.siteId = this.tokenInfo.siteId;
      authModel.lang = lang;

      const title = this.translate.instant('TITLE.Information');
      const message = this.translate.instant('MESSAGE.Request_to_change_language_was_sent_to_the_server');
      this.cmsToastrService.toastr.info(message, title);
      // this.loadingStatus = true;
      this.coreAuthService.ServiceRenewToken(authModel).subscribe(
        {
          next: (ret) => {
            // this.loadingStatus = false;
            if (ret.isSuccess) {
              this.cdr.detectChanges();
              if (ret.item.language === lang) {
                this.cmsToastrService.toastr.success(this.translate.instant('MESSAGE.New_language_acess_confirmed'), title);
                // if (lang == 'fa' || lang == 'ar') {
                //   this.document.getElementById('cssdir').setAttribute('href', './assets/sass/style.angular.rtl.css');
                // }
                // else {
                //   this.document.getElementById('cssdir').setAttribute('href', './assets/sass/style.angular.css');
                // }
                // window.location.reload();
              } else {
                this.cmsToastrService.toastr.warning(this.translate.instant('ERRORMESSAGE.MESSAGE.New_language_acess_denied'), title);
              }
            } else {
              this.cmsToastrService.typeErrorAccessChange(ret.errorMessage);
            }

          },
          error: (err) => {
            this.cmsToastrService.typeErrorAccessChange(err);
          }
        }
      );
    }
    /** */
  }

  setLanguage(lang: string): void {
    this.languages.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });

    this.translationService.setLanguage(lang);
  }

  setSelectedLanguage(): any {
    this.setLanguage(this.translationService.getSelectedLanguage());
  }
}
