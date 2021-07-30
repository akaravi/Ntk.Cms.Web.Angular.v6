import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslationService } from './modules/i18n/translation.service';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { SplashScreenService } from './_metronic/partials/layout/splash-screen/splash-screen.service';
import { TableExtendedService } from './_metronic/shared/crud-table';
import { CoreAuthService, CoreEnumService, EnumDeviceType, EnumOperatingSystemType, TokenDeviceClientInfoDtoModel } from 'ntk-cms-api';
import { CmsStoreService } from './core/reducers/cmsStore.service';
import { environment } from 'src/environments/environment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private coreAuthService: CoreAuthService,
    private translationService: TranslationService,
    private splashScreenService: SplashScreenService,
    private router: Router,
    private tableService: TableExtendedService,
    private coreEnumService: CoreEnumService,
    private cmsStoreService: CmsStoreService
  ) {
    if (environment.cmsServerConfig.configApiServerPath && environment.cmsServerConfig.configApiServerPath.length > 0) {
      this.coreAuthService.setConfig(environment.cmsServerConfig.configApiServerPath);
    }
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }

  ngOnInit() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // clear filtration paginations and others
        this.tableService.setDefaults();
        // hide splash screen
        this.splashScreenService.hide();

        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 500);
      }
    });
    this.unsubscribe.push(routerSubscription);

    this.getDeviceToken();
    this.getEnumRecordStatus();
  }
  getDeviceToken(): void {
    const DeviceToken = this.coreAuthService.getDeviceToken();
    if (!DeviceToken || DeviceToken.length === 0) {
      const model: TokenDeviceClientInfoDtoModel = {
        SecurityKey: environment.cmsTokenConfig.SecurityKey,
        ClientMACAddress: '',
        OSType: EnumOperatingSystemType.none,
        DeviceType: EnumDeviceType.WebSite,
        PackageName: '',
        AppBuildVer: 0,
        AppSourceVer: '',
        Country: '',
        DeviceBrand: '',
        Language: this.translationService.getSelectedLanguage(),
        LocationLat: '',
        LocationLong: '',
        SimCard: '',
        NotificationId: ''

      };
      this.translationService.setLanguage(this.translationService.getSelectedLanguage());
      this.coreAuthService.ServiceGetTokenDevice(model).toPromise();
    }
  }
  getEnumRecordStatus(): void {
    this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
      this.cmsStoreService.setState({ EnumRecordStatus: res });
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
