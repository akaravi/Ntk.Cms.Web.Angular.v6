import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/_services/auth.service';
import { FakeAPIService } from './_fake/fake-api.service';
import { environment } from 'src/environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Highlight JS
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';
import { TeardownLogic } from 'rxjs';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { CmsStoreModule } from './core/reducers/cmsStore.module';
import { CoreAuthService, CoreEnumService } from 'ntk-cms-api';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise<TeardownLogic>((resolve) => {
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}
export function CreateTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SplashScreenModule,
    TranslateModule.forRoot(),
    SharedModule.forRoot(),
    ToastrModule.forRoot({
      // timeOut: 0,
      timeOut: 5000,
      enableHtml: true,
      positionClass: 'toast-bottom-right',
      // positionClass: "toast-bottom-full-width",
      preventDuplicates: true,
      closeButton: true,
      // extendedTimeOut: 0,
      extendedTimeOut: 1000,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (CreateTranslateLoader),
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    HighlightModule,
    ClipboardModule,
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    AppRouting,
    InlineSVGModule.forRoot(),
    CmsStoreModule.forRoot(),
    NgbModule,
  ],
  providers: [
    CoreAuthService,
    CoreEnumService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
          json: () => import('highlight.js/lib/languages/json')
        },
      },
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
