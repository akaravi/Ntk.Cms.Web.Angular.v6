import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  BankPaymentConfigurationService, CoreModuleService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { BankPaymentConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { BankPaymentConfigSiteComponent } from './site/config-site.component';
import { BankPaymentConfigCheckUserComponent } from './check-user/check-user.component';
import { BankPaymentConfigCheckSiteComponent } from './check-site/check-site.component';
import { BankPaymentConfigRouting } from './bank-payment-config.routing';


@NgModule({
  declarations: [
    /*Config*/
    BankPaymentConfigMainAdminComponent,
    BankPaymentConfigSiteComponent,
    BankPaymentConfigCheckUserComponent,
    BankPaymentConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    BankPaymentConfigMainAdminComponent,
    BankPaymentConfigSiteComponent,
    BankPaymentConfigCheckUserComponent,
    BankPaymentConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    BankPaymentConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    BankPaymentConfigurationService,
  ]
})
export class BankPaymentConfigModule {
}
