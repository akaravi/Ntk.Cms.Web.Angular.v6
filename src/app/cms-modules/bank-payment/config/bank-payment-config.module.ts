import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  BankPaymentConfigurationService,
  CoreModuleService,
  CoreUserGroupService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

// import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { BankPaymentConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { BankPaymentConfigSiteComponent } from './site/configSite.component';
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
    BankPaymentConfigurationService,
  ]
})
export class BankPaymentConfigModule {
}
