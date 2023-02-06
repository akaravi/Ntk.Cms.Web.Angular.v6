import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreModuleService,
  DataProviderConfigurationService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { DataProviderConfigCheckSiteComponent } from './check-site/check-site.component';
import { DataProviderConfigCheckUserComponent } from './check-user/check-user.component';
import { DataProviderConfigRouting } from './data-provider-config.routing';
import { DataProviderConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { DataProviderConfigSiteComponent } from './site/config-site.component';


@NgModule({
  declarations: [
    /*Config*/
    DataProviderConfigMainAdminComponent,
    DataProviderConfigSiteComponent,
    DataProviderConfigCheckUserComponent,
    DataProviderConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    DataProviderConfigMainAdminComponent,
    DataProviderConfigSiteComponent,
    DataProviderConfigCheckUserComponent,
    DataProviderConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataProviderConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    DataProviderConfigurationService,
  ]
})
export class DataProviderConfigModule {
}
