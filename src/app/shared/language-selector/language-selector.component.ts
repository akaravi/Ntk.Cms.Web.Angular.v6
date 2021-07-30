import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthRenewTokenModel, CoreAuthService, NtkCmsApiStoreService, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
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
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  language: LanguageFlag;
  languages: LanguageFlag[] = [
    {
      lang: 'fa',
      name: 'فارسی',
      flag: './assets/media/svg/flags/iran.svg',
    },
    {
      lang: 'en',
      name: 'English',
      flag: './assets/media/svg/flags/226-united-states.svg',
    },
    {
      lang: 'ch',
      name: 'Mandarin',
      flag: './assets/media/svg/flags/015-china.svg',
    },
    {
      lang: 'es',
      name: 'Spanish',
      flag: './assets/media/svg/flags/128-spain.svg',
    },
    {
      lang: 'jp',
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
    private cmsApiStore: NtkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    private router: Router
  ) {
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;

    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((value) => {
      this.tokenInfo = value;
      this.setLanguage(value.Language);
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
  setLanguageWithRefresh(lang): void {
    this.setLanguage(lang);
    /** */
    if (this.tokenInfo && this.tokenInfo.UserId > 0) {
      const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
      authModel.UserAccessAdminAllowToProfessionalData = this.tokenInfo.UserAccessAdminAllowToProfessionalData;
      authModel.UserAccessAdminAllowToAllData = this.tokenInfo.UserAccessAdminAllowToAllData;
      authModel.UserId = this.tokenInfo.UserId;
      authModel.SiteId = this.tokenInfo.SiteId;
      authModel.Lang = lang;

      const title = 'اطلاعات ';
      const message = 'درخواست تغییر زبان به سرور ارسال شد';
      this.cmsToastrService.toastr.info(message, title);
      // this.loadingStatus = true;
      this.coreAuthService.ServiceRenewToken(authModel).subscribe(
        (next) => {
          // this.loadingStatus = false;
          if (next.IsSuccess) {
            if (next.Item.Language === lang) {
              this.cmsToastrService.toastr.success('دسترسی به زبان جدید تایید شد', title);
              window.location.reload();
            } else {
              this.cmsToastrService.toastr.warning('دسترسی به زبان جدید تایید نشد', title);
            }
          } else {
            this.cmsToastrService.typeErrorAccessChange(next.ErrorMessage);
          }

        },
        (error) => {
          this.cmsToastrService.typeErrorAccessChange(error);
        }
      );
    }
    /** */
  }

  setLanguage(lang): void {
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
