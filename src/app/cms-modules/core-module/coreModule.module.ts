import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModuleComponent } from './coreModule.component';
import { CoreModuleRoutes } from './coreModule.routing';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { SharedModule } from 'src/app/shared.module';

import { CoreModuleService, CoreModuleSiteCreditService, CoreModuleSiteUserCreditService, CoreModuleTagCategoryService, CoreModuleTagService } from 'ntk-cms-api';
import { CoreModuleSiteCreditChargePaymentComponent } from './site-credit/charge-payment/charge-payment.component';
import { CoreModuleSiteCreditChargeComponent } from './site-credit/charge/charge.component';
import { CoreModuleSiteCreditEditComponent } from './site-credit/edit/edit.component';
import { CoreModuleSiteCreditListComponent } from './site-credit/list/list.component';
import { CoreModuleSiteUserCreditChargePaymentComponent } from './site-user-credit/charge-payment/charge-payment.component';
import { CoreModuleSiteUserCreditChargeComponent } from './site-user-credit/charge/charge.component';
import { CoreModuleSiteUserCreditEditComponent } from './site-user-credit/edit/edit.component';
import { CoreModuleSiteUserCreditListComponent } from './site-user-credit/list/list.component';
import { CoreModuleTagAddBulkComponent } from './tag/add-bulk/add-bulk.component';
import { CoreModuleTagEditComponent } from './tag/edit/edit.component';
import { CoreModuleTagListComponent } from './tag/list/list.component';
import { CoreModuleTagSelectorComponent } from './tag/selector/selector.component';
import { CoreModuleTagCategoryDeleteComponent } from './tagCategory/delete/delete.component';
import { CoreModuleTagCategoryEditComponent } from './tagCategory/edit/edit.component';
import { CoreModuleTagCategorySelectorComponent } from './tagCategory/selector/selector.component';
import { CoreModuleTagCategoryTreeComponent } from './tagCategory/tree/tree.component';



@NgModule({
  imports: [
    CoreModuleRoutes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule.forRoot(),
    AngularEditorModule,

    CmsFileManagerModule
  ],
  declarations: [
    CoreModuleComponent,
    CoreModuleTagEditComponent,
    CoreModuleTagListComponent,
    CoreModuleTagCategoryEditComponent,
    CoreModuleTagCategoryDeleteComponent,
    CoreModuleTagCategoryTreeComponent,
    CoreModuleTagCategorySelectorComponent,
    CoreModuleTagSelectorComponent,
    CoreModuleTagAddBulkComponent,
    CoreModuleSiteCreditEditComponent,
    CoreModuleSiteCreditListComponent,
    CoreModuleSiteUserCreditEditComponent,
    CoreModuleSiteUserCreditListComponent,
    CoreModuleSiteUserCreditChargeComponent,
    CoreModuleSiteCreditChargeComponent,
    CoreModuleSiteCreditChargePaymentComponent,
    CoreModuleSiteUserCreditChargePaymentComponent
  ],
  exports: [
    CoreModuleComponent,
    CoreModuleTagEditComponent,
    CoreModuleTagListComponent,
    CoreModuleTagCategoryEditComponent,
    CoreModuleTagCategoryDeleteComponent,
    CoreModuleTagCategoryTreeComponent,
    CoreModuleTagCategorySelectorComponent,
    CoreModuleTagSelectorComponent,
    CoreModuleTagAddBulkComponent,
    CoreModuleSiteCreditEditComponent,
    CoreModuleSiteCreditListComponent,
    CoreModuleSiteUserCreditEditComponent,
    CoreModuleSiteUserCreditListComponent,
    CoreModuleSiteUserCreditChargeComponent,
    CoreModuleSiteCreditChargeComponent,
    CoreModuleSiteCreditChargePaymentComponent,
    CoreModuleSiteUserCreditChargePaymentComponent,
  ],
  providers: [
    CoreModuleService,
    CoreModuleTagService,
    CoreModuleTagCategoryService,
    CoreModuleSiteCreditService,
    CoreModuleSiteUserCreditService,

  ]
})
export class CoreModuleModule { }
