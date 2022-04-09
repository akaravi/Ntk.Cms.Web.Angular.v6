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
  DataProviderLogViewService,
  DataProviderSponsorService,
  DataProviderTargetCategoryService,
  DataProviderTargetPeriodService,
  DataProviderTargetPeriodSponsorService,
  DataProviderTargetService,
  DataProviderTransactionService
} from 'ntk-cms-api';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { IconPickerModule } from 'ngx-icon-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DataProviderTargetCategoryAddComponent } from './target-category/add/add.component';
import { DataProviderTargetCategoryEditComponent } from './target-category/edit/edit.component';
import { DataProviderTargetCategorySelectorComponent } from './target-category/selector/selector.component';
import { DataProviderTargetAddComponent } from './target/add/add.component';
import { DataProviderTargetEditComponent } from './target/edit/edit.component';
import { DataProviderTargetCategoryDeleteComponent } from './target-category/delete/delete.component';
import { DataProviderTargetDeleteComponent } from './target/delete/delete.component';
import { DataProviderTargetTreeComponent } from './target/tree/tree.component';
import { DataProviderTargetSelectorComponent } from './target/selector/selector.component';
import { DataProviderTargetListComponent } from './target/list/list.component';
import { DataProviderTargetCategoryTreeComponent } from './target-category/tree/tree.component';
import { DataProviderLogViewListComponent } from './log-view/list/list.component';
import { DataProviderSponserListComponent } from './sponser/list/list.component';
import { DataProviderTargetPeriodListComponent } from './target-period/list/list.component';
import { DataProviderSponserAddComponent } from './sponser/add/add.component';
import { DataProviderSponserDeleteComponent } from './sponser/delete/delete.component';
import { DataProviderSponserEditComponent } from './sponser/edit/edit.component';
import { DataProviderSponserSelectorComponent } from './sponser/selector/selector.component';
import { DataProviderSponserTreeComponent } from './sponser/tree/tree.component';
import { DataProviderSponserHeaderComponent } from './sponser/header/header.component';
import { DataProviderTargetPeriodAddComponent } from './target-period/add/add.component';
import { DataProviderTargetPeriodEditComponent } from './target-period/edit/edit.component';
import { DataProviderTargetPeriodDeleteComponent } from './target-period/delete/delete.component';
import { DataProviderTargetPeriodHeaderComponent } from './target-period/header/header.component';
import { DataProviderTargetPeriodSelectorComponent } from './target-period/selector/selector.component';
import { DataProviderTargetPeriodTreeComponent } from './target-period/tree/tree.component';
import { DataProviderTargetPeriodSponserListComponent } from './target-period-sponsor/list/list.component';
import { DataProviderTargetPeriodSponserAddComponent } from './target-period-sponsor/add/add.component';
import { DataProviderTargetPeriodSponserDeleteComponent } from './target-period-sponsor/delete/delete.component';
import { DataProviderTargetPeriodSponserEditComponent } from './target-period-sponsor/edit/edit.component';
import { DataProviderTargetPeriodSponserHeaderComponent } from './target-period-sponsor/header/header.component';
import { DataProviderTargetPeriodSponserSelectorComponent } from './target-period-sponsor/selector/selector.component';
import { DataProviderTargetPeriodSponserTreeComponent } from './target-period-sponsor/tree/tree.component';
import { DataProviderLogViewComponent } from './log-view/view/view.component';

@NgModule({
  declarations: [
    DataProviderComponent,
    /* */
    DataProviderTargetCategoryAddComponent,
    DataProviderTargetCategoryEditComponent,
    DataProviderTargetCategoryDeleteComponent,
    DataProviderTargetCategorySelectorComponent,
    DataProviderTargetCategoryTreeComponent,
    /* */
    DataProviderTargetAddComponent,
    DataProviderTargetEditComponent,
    DataProviderTargetDeleteComponent,
    DataProviderTargetSelectorComponent,
    DataProviderTargetTreeComponent,
    DataProviderTargetListComponent,
    /* */
    DataProviderSponserListComponent,
    DataProviderSponserAddComponent,
    DataProviderSponserDeleteComponent,
    DataProviderSponserEditComponent,
    DataProviderSponserSelectorComponent,
    DataProviderSponserTreeComponent,
    DataProviderSponserHeaderComponent,
    /* */
    DataProviderTargetPeriodListComponent,
    DataProviderTargetPeriodAddComponent,
    DataProviderTargetPeriodEditComponent,
    DataProviderTargetPeriodDeleteComponent,
    DataProviderTargetPeriodHeaderComponent,
    DataProviderTargetPeriodSelectorComponent,
    DataProviderTargetPeriodTreeComponent,
    /* */
    DataProviderTargetPeriodSponserListComponent,
    DataProviderTargetPeriodSponserAddComponent,
    DataProviderTargetPeriodSponserDeleteComponent,
    DataProviderTargetPeriodSponserEditComponent,
    DataProviderTargetPeriodSponserHeaderComponent,
    DataProviderTargetPeriodSponserSelectorComponent,
    DataProviderTargetPeriodSponserTreeComponent,
    /* */
    DataProviderLogViewListComponent,
    DataProviderLogViewComponent,


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
    DataProviderLogViewService,
    DataProviderSponsorService,
    DataProviderTargetService,
    DataProviderTargetCategoryService,
    DataProviderTargetPeriodService,
    DataProviderTargetPeriodSponsorService,
    DataProviderTransactionService,
    /** */
    CmsConfirmationDialogService,
    CoreModuleTagService,

  ]
})
export class DataProviderModule { }
