import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreModuleService,
  SmsConfigurationService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { SmsConfigCheckSiteComponent } from './check-site/check-site.component';
import { SmsConfigCheckUserComponent } from './check-user/check-user.component';
import { SmsConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { SmsConfigSiteComponent } from './site/config-site.component';
import { SmsConfigRouting } from './sms-config.routing';


@NgModule({
  declarations: [
    /*Config*/
    SmsConfigMainAdminComponent,
    SmsConfigSiteComponent,
    SmsConfigCheckUserComponent,
    SmsConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    SmsConfigMainAdminComponent,
    SmsConfigSiteComponent,
    SmsConfigCheckUserComponent,
    SmsConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    SmsConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    SmsConfigurationService,
  ]
})
export class SmsConfigModule {
}
