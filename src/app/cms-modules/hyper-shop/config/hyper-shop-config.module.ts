import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CoreModuleService,
  HyperShopConfigurationService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { HyperShopConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { HyperShopConfigSiteComponent } from './site/configSite.component';
import { HyperShopConfigCheckUserComponent } from './check-user/check-user.component';
import { HyperShopConfigCheckSiteComponent } from './check-site/check-site.component';
import { HyperShopConfigRouting } from './hyper-shop-config.routing';


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
