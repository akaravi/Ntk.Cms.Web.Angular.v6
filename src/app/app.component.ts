import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  HostListener,
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// language list
// import { locale as enLang } from './modules/i18n/vocabs/en';
// import { locale as chLang } from './modules/i18n/vocabs/ch';
// import { locale as esLang } from './modules/i18n/vocabs/es';
// import { locale as jpLang } from './modules/i18n/vocabs/jp';
// import { locale as deLang } from './modules/i18n/vocabs/de';
// import { locale as frLang } from './modules/i18n/vocabs/fr';
import { SplashScreenService } from './shared/splash-screen/splash-screen.service';
// import { TableExtendedService } from './_metronic/shared/crud-table';
import { CoreAuthService } from 'ntk-cms-api';
import { environment } from 'src/environments/environment';
import { TokenHelper } from './core/helpers/tokenHelper';
import { TranslationService } from './core/i18n/translation.service';
import { PublicHelper } from './core/helpers/publicHelper';
import { HttpParams } from '@angular/common/http';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private coreAuthService: CoreAuthService,
    private translationService: TranslationService,
    private splashScreenService: SplashScreenService,
    private router: Router,
    // private tableService: TableExtendedService,
    private publicHelper: PublicHelper,
    private tokenHelper: TokenHelper,
  ) {
    if (environment.cmsServerConfig.configApiServerPath && environment.cmsServerConfig.configApiServerPath.length > 0) {
      this.coreAuthService.setConfig(environment.cmsServerConfig.configApiServerPath);
    }
    // register translations
    this.translationService.loadTranslations(
      //   enLang,
      //   chLang,
      //   esLang,
      //   jpLang,
      //   deLang,
      //   frLang
    );
  }
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event?.key === "F9") {
      if (localStorage.getItem('KeyboardEventF9'))
        localStorage.removeItem('KeyboardEventF9')
      else
        localStorage.setItem('KeyboardEventF9', "F9");
    }
  }
  ngOnInit() {
    const url = window.location.href;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      const site = httpParams.get('site');
      const siteId = +site ;
      if (siteId > 0) {
        localStorage.setItem('siteId', site);
      }
      const siteType = httpParams.get('sitetype');
      const siteTypeId = +siteType ;
      if (siteTypeId > 0) {
        localStorage.setItem('siteTypeId', siteType);
      }
      const ResellerSite = httpParams.get('rsite');
      const ResellerSiteId = +ResellerSite ;
      if (ResellerSiteId > 0) {
        localStorage.setItem('ResellerSiteId', ResellerSite);
      }
      const ResellerUser = httpParams.get('ruser');
      const ResellerUserId = +ResellerUser ;
      if (ResellerUserId > 0) {
        localStorage.setItem('ResellerUserId', ResellerUser);
      }
      
    }


    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // clear filtration paginations and others
        // this.tableService.setDefaults();
        // hide splash screen
        this.splashScreenService.hide();

        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 1000);
      }
    });
    this.unsubscribe.push(routerSubscription);

    this.tokenHelper.getDeviceToken();
    this.publicHelper.getEnumRecordStatus();
  }



  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
