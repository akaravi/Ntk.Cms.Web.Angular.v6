import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataProviderComponent } from './data-provider.component';
import { DataProviderRoutes } from './data-provider.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import {
  CoreAuthService,
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  DataProviderConfigurationService,
  DataProviderEnumService,
 
  DataProviderLogClientService,
 
  DataProviderLogPlanService,
 
  DataProviderLogSourceService,
 
  DataProviderTransactionService
} from 'ntk-cms-api';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { IconPickerModule } from 'ngx-icon-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DataProviderLogClientListComponent } from './log-client/list/list.component';
import { DataProviderLogPlanListComponent } from './log-plan/list/list.component';
import { DataProviderLogSourceListComponent } from './log-source/list/list.component';
import { DataProviderLogClientViewComponent } from './log-client/view/view.component';
import { DataProviderLogPlanViewComponent } from './log-plan/view/view.component';
import { DataProviderLogSourceViewComponent } from './log-source/view/view.component';
import { DataProviderTransactionListComponent } from './transaction/list/list.component';
import { DataProviderTransactionViewComponent } from './transaction/view/view.component';
import { DataProviderPlanCategoryAddComponent } from './plan-category/add/add.component';
import { DataProviderPlanCategoryDeleteComponent } from './plan-category/delete/delete.component';
import { DataProviderPlanCategoryEditComponent } from './plan-category/edit/edit.component';
import { DataProviderPlanCategorySelectorComponent } from './plan-category/selector/selector.component';
import { DataProviderPlanCategoryTreeComponent } from './plan-category/tree/tree.component';
import { DataProviderPlanAddComponent } from './plan/add/add.component';
import { DataProviderPlanDeleteComponent } from './plan/delete/delete.component';
import { DataProviderPlanEditComponent } from './plan/edit/edit.component';
import { DataProviderPlanListComponent } from './plan/list/list.component';
import { DataProviderPlanSelectorComponent } from './plan/selector/selector.component';
import { DataProviderPlanTreeComponent } from './plan/tree/tree.component';
import { DataProviderPlanSourceAddComponent } from './plan-source/add/add.component';
import { DataProviderPlanSourceDeleteComponent } from './plan-source/delete/delete.component';
import { DataProviderPlanSourceEditComponent } from './plan-source/edit/edit.component';
import { DataProviderPlanSourceHeaderComponent } from './plan-source/header/header.component';
import { DataProviderPlanSourceListComponent } from './plan-source/list/list.component';
import { DataProviderPlanSourceSelectorComponent } from './plan-source/selector/selector.component';
import { DataProviderPlanSourceTreeComponent } from './plan-source/tree/tree.component';
import { DataProviderClientAddComponent } from './client/add/add.component';
import { DataProviderClientDeleteComponent } from './client/delete/delete.component';
import { DataProviderClientEditComponent } from './client/edit/edit.component';
import { DataProviderClientListComponent } from './client/list/list.component';
import { DataProviderClientTreeComponent } from './client/tree/tree.component';
import { DataProviderClientSelectorComponent } from './client/selector/selector.component';
import { DataProviderSourceAddComponent } from './source/add/add.component';
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
    DataProviderPlanTreeComponent,
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
    /* */
    DataProviderSourceAddComponent,



    /* */

  ],
  imports: [
    CommonModule,
    DataProviderRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    IconPickerModule,
    DragDropModule,
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
    
    DataProviderTransactionService,
    /** */
    CmsConfirmationDialogService,
    CoreModuleTagService,

  ]
})
export class DataProviderModule { }
