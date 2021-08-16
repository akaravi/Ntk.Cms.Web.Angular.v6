import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
// language list
// import { locale as enLang } from './modules/i18n/vocabs/en';
// import { locale as chLang } from './modules/i18n/vocabs/ch';
// import { locale as esLang } from './modules/i18n/vocabs/es';
// import { locale as jpLang } from './modules/i18n/vocabs/jp';
// import { locale as deLang } from './modules/i18n/vocabs/de';
// import { locale as frLang } from './modules/i18n/vocabs/fr';
import { SplashScreenService } from './_metronic/partials/layout/splash-screen/splash-screen.service';
import { TableExtendedService } from './_metronic/shared/crud-table';
import { CoreAuthService } from 'ntk-cms-api';
import { environment } from 'src/environments/environment';
import { TokenHelper } from './core/helpers/tokenHelper';
import { TranslationService } from './core/i18n/translation.service';
import { PublicHelper } from './core/helpers/publicHelper';

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

    this.tokenHelper.getDeviceToken();
    this.publicHelper.getEnumRecordStatus();
  }



  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
