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
    DataProviderTransactionViewComponent

    /* */
 
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
