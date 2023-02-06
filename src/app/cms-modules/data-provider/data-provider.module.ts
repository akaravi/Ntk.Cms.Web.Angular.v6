import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataProviderComponent } from './data-provider.component';
import { DataProviderRoutes } from './data-provider.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from 'src/app/shared.module';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { IconPickerModule } from 'ngx-icon-picker';
import {
  CoreAuthService,
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  DataProviderClientService,
  DataProviderConfigurationService,
  DataProviderEnumService,

  DataProviderLogClientService,

  DataProviderLogPlanService,

  DataProviderLogSourceService,

  DataProviderPlanCategoryService,

  DataProviderPlanClientService,

  DataProviderPlanPriceService,

  DataProviderPlanService,

  DataProviderPlanSourceService,

  DataProviderSourceService,

  DataProviderTransactionService
} from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { DataProviderClientAddComponent } from './client/add/add.component';
import { DataProviderClientChargePaymentComponent } from './client/charge-payment/charge-payment.component';
import { DataProviderClientChargeComponent } from './client/charge/charge.component';
import { DataProviderClientDeleteComponent } from './client/delete/delete.component';
import { DataProviderClientEditComponent } from './client/edit/edit.component';
import { DataProviderClientHeaderComponent } from './client/header/header.component';
import { DataProviderClientListComponent } from './client/list/list.component';
import { DataProviderClientSelectorComponent } from './client/selector/selector.component';
import { DataProviderClientTreeComponent } from './client/tree/tree.component';
import { DataProviderLogClientListComponent } from './log-client/list/list.component';
import { DataProviderLogClientViewComponent } from './log-client/view/view.component';
import { DataProviderLogPlanListComponent } from './log-plan/list/list.component';
import { DataProviderLogPlanViewComponent } from './log-plan/view/view.component';
import { DataProviderLogSourceListComponent } from './log-source/list/list.component';
import { DataProviderLogSourceViewComponent } from './log-source/view/view.component';
import { DataProviderPlanCategoryAddComponent } from './plan-category/add/add.component';
import { DataProviderPlanCategoryDeleteComponent } from './plan-category/delete/delete.component';
import { DataProviderPlanCategoryEditComponent } from './plan-category/edit/edit.component';
import { DataProviderPlanCategorySelectorComponent } from './plan-category/selector/selector.component';
import { DataProviderPlanCategoryTreeComponent } from './plan-category/tree/tree.component';
import { DataProviderPlanClientAddComponent } from './plan-client/add/add.component';
import { DataProviderPlanClientDeleteComponent } from './plan-client/delete/delete.component';
import { DataProviderPlanClientEditComponent } from './plan-client/edit/edit.component';
import { DataProviderPlanClientHeaderComponent } from './plan-client/header/header.component';
import { DataProviderPlanClientListComponent } from './plan-client/list/list.component';
import { DataProviderPlanClientSelectorComponent } from './plan-client/selector/selector.component';
import { DataProviderPlanClientTreeComponent } from './plan-client/tree/tree.component';
import { DataProviderPlanPriceAddComponent } from './plan-price/add/add.component';
import { DataProviderPlanPriceChargePaymentComponent } from './plan-price/charge-payment/charge-payment.component';
import { DataProviderPlanPriceChargeComponent } from './plan-price/charge/charge.component';
import { DataProviderPlanPriceDeleteComponent } from './plan-price/delete/delete.component';
import { DataProviderPlanPriceEditComponent } from './plan-price/edit/edit.component';
import { DataProviderPlanPriceHeaderComponent } from './plan-price/header/header.component';
import { DataProviderPlanPriceListComponent } from './plan-price/list/list.component';
import { DataProviderPlanPriceSelectorComponent } from './plan-price/selector/selector.component';
import { DataProviderPlanPriceTreeComponent } from './plan-price/tree/tree.component';
import { DataProviderPlanSourceAddComponent } from './plan-source/add/add.component';
import { DataProviderPlanSourceDeleteComponent } from './plan-source/delete/delete.component';
import { DataProviderPlanSourceEditComponent } from './plan-source/edit/edit.component';
import { DataProviderPlanSourceHeaderComponent } from './plan-source/header/header.component';
import { DataProviderPlanSourceListComponent } from './plan-source/list/list.component';
import { DataProviderPlanSourceSelectorComponent } from './plan-source/selector/selector.component';
import { DataProviderPlanSourceTreeComponent } from './plan-source/tree/tree.component';
import { DataProviderPlanAddComponent } from './plan/add/add.component';
import { DataProviderPlanDeleteComponent } from './plan/delete/delete.component';
import { DataProviderPlanEditComponent } from './plan/edit/edit.component';
import { DataProviderPlanHeaderComponent } from './plan/header/header.component';
import { DataProviderPlanListComponent } from './plan/list/list.component';
import { DataProviderPlanSelectionlistComponent } from './plan/selectionlist/selectionlist.component';
import { DataProviderPlanSelectorComponent } from './plan/selector/selector.component';
import { DataProviderPlanTreeComponent } from './plan/tree/tree.component';
import { DataProviderSourceAddComponent } from './source/add/add.component';
import { DataProviderSourceDeleteComponent } from './source/delete/delete.component';
import { DataProviderSourceEditComponent } from './source/edit/edit.component';
import { DataProviderSourceHeaderComponent } from './source/header/header.component';
import { DataProviderSourceListComponent } from './source/list/list.component';
import { DataProviderSourceSelectorComponent } from './source/selector/selector.component';
import { DataProviderSourceTreeComponent } from './source/tree/tree.component';
import { DataProviderTransactionListComponent } from './transaction/list/list.component';
import { DataProviderTransactionViewComponent } from './transaction/view/view.component';
@NgModule({
  declarations: [
    DataProviderComponent,
    /* */
    DataProviderLogClientListComponent,
    DataProviderLogClientViewComponent,
    /* */
    DataProviderLogPlanListComponent,
    DataProviderLogPlanViewComponent,
    /* */
    DataProviderLogSourceListComponent,
    DataProviderLogSourceViewComponent,
    /* */
    DataProviderTransactionListComponent,
    DataProviderTransactionViewComponent,
    /* */
    DataProviderPlanCategoryAddComponent,
    DataProviderPlanCategoryDeleteComponent,
    DataProviderPlanCategoryEditComponent,
    DataProviderPlanCategorySelectorComponent,
    DataProviderPlanCategoryTreeComponent,
    /* */
    DataProviderPlanAddComponent,
    DataProviderPlanDeleteComponent,
    DataProviderPlanEditComponent,
    DataProviderPlanListComponent,
    DataProviderPlanSelectorComponent,
    DataProviderPlanSelectionlistComponent,
    DataProviderPlanTreeComponent,
    DataProviderPlanHeaderComponent,
    /* */
    DataProviderPlanSourceAddComponent,
    DataProviderPlanSourceDeleteComponent,
    DataProviderPlanSourceEditComponent,
    DataProviderPlanSourceHeaderComponent,
    DataProviderPlanSourceListComponent,
    DataProviderPlanSourceSelectorComponent,
    DataProviderPlanSourceTreeComponent,
    /* */
    DataProviderClientAddComponent,
    DataProviderClientDeleteComponent,
    DataProviderClientEditComponent,
    DataProviderClientListComponent,
    DataProviderClientSelectorComponent,
    DataProviderClientTreeComponent,
    DataProviderClientChargeComponent,
    DataProviderClientChargePaymentComponent,
    DataProviderClientHeaderComponent,
    /* */
    DataProviderSourceAddComponent,
    DataProviderSourceDeleteComponent,
    DataProviderSourceEditComponent,
    DataProviderSourceHeaderComponent,
    DataProviderSourceListComponent,
    DataProviderSourceSelectorComponent,
    DataProviderSourceTreeComponent,
    /* */
    DataProviderPlanClientAddComponent,
    DataProviderPlanClientDeleteComponent,
    DataProviderPlanClientEditComponent,
    DataProviderPlanClientHeaderComponent,
    DataProviderPlanClientListComponent,
    DataProviderPlanClientSelectorComponent,
    DataProviderPlanClientTreeComponent,
    /* */
    DataProviderPlanPriceAddComponent,
    DataProviderPlanPriceDeleteComponent,
    DataProviderPlanPriceEditComponent,
    DataProviderPlanPriceHeaderComponent,
    DataProviderPlanPriceListComponent,
    DataProviderPlanPriceSelectorComponent,
    DataProviderPlanPriceTreeComponent,
    DataProviderPlanPriceChargeComponent,
    DataProviderPlanPriceChargePaymentComponent,
    /* */

  ],
  imports: [
    CommonModule,
    DataProviderRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule.forRoot(),
    AngularEditorModule,


    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    IconPickerModule,
    DragDropModule,
    InlineSVGModule,
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    CoreAuthService,
    /*Config*/
    DataProviderConfigurationService,
    /*Config*/
    /** */
    DataProviderEnumService,
    DataProviderLogSourceService,
    DataProviderLogPlanService,
    DataProviderLogClientService,
    DataProviderPlanService,
    DataProviderSourceService,
    DataProviderTransactionService,
    DataProviderClientService,
    DataProviderPlanCategoryService,
    DataProviderPlanClientService,
    DataProviderPlanPriceService,
    DataProviderPlanSourceService,
    /** */
    CmsConfirmationDialogService,
    CoreModuleTagService,

  ]
})
export class DataProviderModule { }
