import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  BankPaymentConfigurationService, CoreModuleService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { BankPaymentConfigRouting } from './bank-payment-config.routing';
import { BankPaymentConfigCheckSiteComponent } from './check-site/check-site.component';
import { BankPaymentConfigCheckUserComponent } from './check-user/check-user.component';
import { BankPaymentConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { BankPaymentConfigSiteComponent } from './site/config-site.component';
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