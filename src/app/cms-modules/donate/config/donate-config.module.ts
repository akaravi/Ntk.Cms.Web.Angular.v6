import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreModuleService,
  DonateConfigurationService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { DonateConfigCheckSiteComponent } from './check-site/check-site.component';
import { DonateConfigCheckUserComponent } from './check-user/check-user.component';
import { DonateConfigRouting } from './donate-config.routing';
import { DonateConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { DonateConfigSiteComponent } from './site/config-site.component';


@NgModule({
  declarations: [
    /*Config*/
    DonateConfigMainAdminComponent,
    DonateConfigSiteComponent,
    DonateConfigCheckUserComponent,
    DonateConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    DonateConfigMainAdminComponent,
    DonateConfigSiteComponent,
    DonateConfigCheckUserComponent,
    DonateConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    DonateConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    DonateConfigurationService,
  ]
})
export class DonateConfigModule {
}
