import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankPaymentComponent } from './bank-payment.component';
import { BankPaymentRoutes } from './bank-payment.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import {
  CoreAuthService,
  CoreEnumService,
  BankPaymentConfigurationService,
  BankPaymentPublicConfigService,
  BankPaymentPrivateSiteConfigService,
  BankPaymentTransactionService,
  BankPaymentTransactionLogService,
  BankPaymentEnumService,
  CoreCurrencyService
} from 'ntk-cms-api';

import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { BankPaymentConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { BankPaymentConfigSiteComponent } from './config/site/configSite.component';

import { BankPaymentPublicConfigAddComponent } from './public-config/add/add.component';
import { BankPaymentPublicConfigEditComponent } from './public-config/edit/edit.component';
import { BankPaymentPublicConfigSelectorComponent } from './public-config/selector/selector.component';
import { BankPaymentPublicConfigTreeComponent } from './public-config/tree/tree.component';
import { BankPaymentPublicConfigListComponent } from './public-config/list/list.component';

import { BankPaymentPrivateSiteConfigAddComponent } from './private-site-config/add/add.component';
import { BankPaymentPrivateSiteConfigEditComponent } from './private-site-config/edit/edit.component';
import { BankPaymentPrivateSiteConfigSelectorComponent } from './private-site-config/selector/selector.component';
import { BankPaymentPrivateSiteConfigTreeComponent } from './private-site-config/tree/tree.component';
import { BankPaymentPrivateSiteConfigListComponent } from './private-site-config/list/list.component';
import { BankPaymentTransactionListComponent } from './transaction/list/list.component';
import { BankPaymentTransactionViewComponent } from './transaction/view/view.component';
import { BankPaymentTransactionLogListComponent } from './transaction-log/list/list.component';
import { BankPaymentTransactionLogViewComponent } from './transaction-log/view/view.component';
import { BankPaymentTransactionEditComponent } from './transaction/edit/edit.component';
import { BankPaymentPrivateSiteConfigPaymentTestComponent } from './private-site-config/paymentTest/paymentTest.component';
import { DynamicFormBuilderModule } from 'src/app/core/dynamic-form-builder/dynamic-form-builder.module';
import { BankPaymentPublicConfigHeaderComponent } from './public-config/header/header.component';

@NgModule({
  declarations: [
    BankPaymentComponent,
    /*Config*/
    BankPaymentConfigMainAdminComponent,
    BankPaymentConfigSiteComponent,
    /*Config*/

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
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule,
    DynamicFormBuilderModule
  ],
  providers: [
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
