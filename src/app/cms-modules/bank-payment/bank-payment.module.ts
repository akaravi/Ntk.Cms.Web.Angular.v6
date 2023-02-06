import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from 'src/app/shared.module';
import { BankPaymentComponent } from './bank-payment.component';
import { BankPaymentRoutes } from './bank-payment.routing';

import {
  BankPaymentConfigurationService, BankPaymentEnumService, BankPaymentPrivateSiteConfigService, BankPaymentPublicConfigService, BankPaymentTransactionLogService, BankPaymentTransactionService, CoreAuthService, CoreCurrencyService, CoreEnumService, CoreModuleService
} from 'ntk-cms-api';
import { DynamicFormBuilderModule } from 'src/app/core/dynamic-form-builder/dynamic-form-builder.module';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { BankPaymentPrivateSiteConfigAddComponent } from './private-site-config/add/add.component';
import { BankPaymentPrivateSiteConfigEditComponent } from './private-site-config/edit/edit.component';
import { BankPaymentPrivateSiteConfigListComponent } from './private-site-config/list/list.component';
import { BankPaymentPrivateSiteConfigPaymentTestComponent } from './private-site-config/paymentTest/paymentTest.component';
import { BankPaymentPrivateSiteConfigSelectorComponent } from './private-site-config/selector/selector.component';
import { BankPaymentPrivateSiteConfigTreeComponent } from './private-site-config/tree/tree.component';
import { BankPaymentPublicConfigAddComponent } from './public-config/add/add.component';
import { BankPaymentPublicConfigEditComponent } from './public-config/edit/edit.component';
import { BankPaymentPublicConfigHeaderComponent } from './public-config/header/header.component';
import { BankPaymentPublicConfigListComponent } from './public-config/list/list.component';
import { BankPaymentPublicConfigSelectorComponent } from './public-config/selector/selector.component';
import { BankPaymentPublicConfigTreeComponent } from './public-config/tree/tree.component';
import { BankPaymentTransactionLogListComponent } from './transaction-log/list/list.component';
import { BankPaymentTransactionLogViewComponent } from './transaction-log/view/view.component';
import { BankPaymentTransactionEditComponent } from './transaction/edit/edit.component';
import { BankPaymentTransactionListComponent } from './transaction/list/list.component';
import { BankPaymentTransactionViewComponent } from './transaction/view/view.component';
@NgModule({
  declarations: [
    BankPaymentComponent,
    BankPaymentPublicConfigAddComponent,
    BankPaymentPublicConfigEditComponent,
    BankPaymentPublicConfigListComponent,
    BankPaymentPublicConfigSelectorComponent,
    BankPaymentPublicConfigTreeComponent,
    BankPaymentPublicConfigHeaderComponent,
    /* */
    BankPaymentPrivateSiteConfigAddComponent,
    BankPaymentPrivateSiteConfigEditComponent,
    BankPaymentPrivateSiteConfigListComponent,
    BankPaymentPrivateSiteConfigSelectorComponent,
    BankPaymentPrivateSiteConfigTreeComponent,
    BankPaymentPrivateSiteConfigPaymentTestComponent,
    /* */
    BankPaymentTransactionListComponent,
    BankPaymentTransactionViewComponent,
    BankPaymentTransactionEditComponent,
    /* */
    BankPaymentTransactionLogListComponent,
    BankPaymentTransactionLogViewComponent,
  ],
  imports: [
    CommonModule,
    BankPaymentRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,

    DynamicFormBuilderModule
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    CoreAuthService,
    CoreCurrencyService,
    /*Config*/
    BankPaymentConfigurationService,
    /*Config*/
    BankPaymentEnumService,
    CmsConfirmationDialogService,
    BankPaymentPublicConfigService,
    BankPaymentPrivateSiteConfigService,
    BankPaymentTransactionService,
    BankPaymentTransactionLogService,
  ]
})
export class BankPaymentModule { }