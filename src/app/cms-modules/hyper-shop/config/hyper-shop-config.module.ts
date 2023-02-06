import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreModuleService,
  HyperShopConfigurationService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { HyperShopConfigCheckSiteComponent } from './check-site/check-site.component';
import { HyperShopConfigCheckUserComponent } from './check-user/check-user.component';
import { HyperShopConfigRouting } from './hyper-shop-config.routing';
import { HyperShopConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { HyperShopConfigSiteComponent } from './site/config-site.component';


@NgModule({
  declarations: [
    /*Config*/
    HyperShopConfigMainAdminComponent,
    HyperShopConfigSiteComponent,
    HyperShopConfigCheckUserComponent,
    HyperShopConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    HyperShopConfigMainAdminComponent,
    HyperShopConfigSiteComponent,
    HyperShopConfigCheckUserComponent,
    HyperShopConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    HyperShopConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    HyperShopConfigurationService,
  ]
})
export class HyperShopConfigModule {
}
