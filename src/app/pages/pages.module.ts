import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages.routing';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { LayoutComponent } from './layout/layout.component';
import { ScriptsInitComponent } from './layout/init/scipts-init/scripts-init.component';
import { HeaderMobileComponent } from './layout/components/header-mobile/header-mobile.component';
import { FooterComponent } from './layout/components/footer/footer.component';
import { HeaderComponent } from './layout/components/header/header.component';
import { TopbarComponent } from './layout/components/topbar/topbar.component';


import { AsideDynamicComponent } from './layout/components/aside-dynamic/aside-dynamic.component';
import { HeaderMenuDynamicComponent } from './layout/components/header/header-menu-dynamic/header-menu-dynamic.component';
import { CoreSiteModule } from '../cms-modules/core-main/site/coreSite.module';
import { SharedModule } from '../shared.module';
import { CoreAuthService, CoreConfigurationService, CoreCpMainMenuService, CoreModuleService } from 'ntk-cms-api';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TestComponent } from './test/test.component';
import { ExtrasModule } from './extras/extras.module';
import { DynamicHeaderMenuService } from '../core/services/dynamic-header-menu.service';
import { DynamicAsideMenuService } from '../core/services/dynamic-aside-menu.service';

@NgModule({
  declarations: [
    LayoutComponent,
    ScriptsInitComponent,
    HeaderMobileComponent,
    FooterComponent,
    HeaderComponent,
    TopbarComponent,
    AsideDynamicComponent,
    HeaderMenuDynamicComponent,
    TestComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    InlineSVGModule,
    ExtrasModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    // CoreModule,
    //SubheaderModule,
    CoreSiteModule,
    SharedModule.forRoot(),
  ],
  providers: [
    CoreModuleService,
    CoreCpMainMenuService,
    CoreConfigurationService,
    CoreAuthService,
    DynamicHeaderMenuService,
    DynamicAsideMenuService,

  ]
})
export class PagesModule { }
