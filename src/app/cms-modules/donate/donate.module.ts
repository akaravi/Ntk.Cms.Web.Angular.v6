import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonateComponent } from './donate.component';
import { DonateRoutes } from './donate.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import {
  CoreAuthService,
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  DonateConfigurationService,
  DonateEnumService,
  DonateLogViewService,
  DonateSponsorService,
  DonateTargetCategoryService,
  DonateTargetPeriodService,
  DonateTargetPeriodSponsorService,
  DonateTargetService,
  DonateTransactionService
} from 'ntk-cms-api';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { IconPickerModule } from 'ngx-icon-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DonateTargetCategoryAddComponent } from './target-category/add/add.component';
import { DonateTargetCategoryEditComponent } from './target-category/edit/edit.component';
import { DonateTargetCategorySelectorComponent } from './target-category/selector/selector.component';
import { DonateTargetAddComponent } from './target/add/add.component';
import { DonateTargetEditComponent } from './target/edit/edit.component';
import { DonateTargetCategoryDeleteComponent } from './target-category/delete/delete.component';
import { DonateTargetDeleteComponent } from './target/delete/delete.component';
import { DonateTargetTreeComponent } from './target/tree/tree.component';
import { DonateTargetSelectorComponent } from './target/selector/selector.component';
import { DonateTargetListComponent } from './target/list/list.component';
import { DonateTargetCategoryTreeComponent } from './target-category/tree/tree.component';
import { DonateLogViewListComponent } from './log-view/list/list.component';
import { DonateSponserListComponent } from './sponser/list/list.component';
import { DonateTargetPeriodListComponent } from './target-period/list/list.component';
import { DonateSponserAddComponent } from './sponser/add/add.component';
import { DonateSponserDeleteComponent } from './sponser/delete/delete.component';
import { DonateSponserEditComponent } from './sponser/edit/edit.component';
import { DonateSponserSelectorComponent } from './sponser/selector/selector.component';
import { DonateSponserTreeComponent } from './sponser/tree/tree.component';
import { DonateSponserHeaderComponent } from './sponser/header/header.component';
import { DonateTargetPeriodAddComponent } from './target-period/add/add.component';
import { DonateTargetPeriodEditComponent } from './target-period/edit/edit.component';
import { DonateTargetPeriodDeleteComponent } from './target-period/delete/delete.component';
import { DonateTargetPeriodHeaderComponent } from './target-period/header/header.component';
import { DonateTargetPeriodSelectorComponent } from './target-period/selector/selector.component';
import { DonateTargetPeriodTreeComponent } from './target-period/tree/tree.component';
import { DonateTargetPeriodSponserListComponent } from './target-period-sponsor/list/list.component';
import { DonateTargetPeriodSponserAddComponent } from './target-period-sponsor/add/add.component';
import { DonateTargetPeriodSponserDeleteComponent } from './target-period-sponsor/delete/delete.component';
import { DonateTargetPeriodSponserEditComponent } from './target-period-sponsor/edit/edit.component';
import { DonateTargetPeriodSponserHeaderComponent } from './target-period-sponsor/header/header.component';
import { DonateTargetPeriodSponserSelectorComponent } from './target-period-sponsor/selector/selector.component';
import { DonateTargetPeriodSponserTreeComponent } from './target-period-sponsor/tree/tree.component';

@NgModule({
  declarations: [
    DonateComponent,
    /* */
    DonateTargetCategoryAddComponent,
    DonateTargetCategoryEditComponent,
    DonateTargetCategoryDeleteComponent,
    DonateTargetCategorySelectorComponent,
    DonateTargetCategoryTreeComponent,
    /* */
    DonateTargetAddComponent,
    DonateTargetEditComponent,
    DonateTargetDeleteComponent,
    DonateTargetSelectorComponent,
    DonateTargetTreeComponent,
    DonateTargetListComponent,
    /* */
    DonateSponserListComponent,
    DonateSponserAddComponent,
    DonateSponserDeleteComponent,
    DonateSponserEditComponent,
    DonateSponserSelectorComponent,
    DonateSponserTreeComponent,
    DonateSponserHeaderComponent,
    /* */
    DonateTargetPeriodListComponent,
    DonateTargetPeriodAddComponent,
    DonateTargetPeriodEditComponent,
    DonateTargetPeriodDeleteComponent,
    DonateTargetPeriodHeaderComponent,
    DonateTargetPeriodSelectorComponent,
    DonateTargetPeriodTreeComponent,
    /* */
    DonateTargetPeriodSponserListComponent,
    DonateTargetPeriodSponserAddComponent,
    DonateTargetPeriodSponserDeleteComponent,
    DonateTargetPeriodSponserEditComponent,
    DonateTargetPeriodSponserHeaderComponent,
    DonateTargetPeriodSponserSelectorComponent,
    DonateTargetPeriodSponserTreeComponent,
    /* */
    DonateLogViewListComponent,


  ],
  imports: [
    CommonModule,
    DonateRoutes,
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
    DonateConfigurationService,
    /*Config*/
    /** */
    DonateEnumService,
    DonateLogViewService,
    DonateSponsorService,
    DonateTargetService,
    DonateTargetCategoryService,
    DonateTargetPeriodService,
    DonateTargetPeriodSponsorService,
    DonateTransactionService,
    /** */
    CmsConfirmationDialogService,
    CoreModuleTagService,

  ]
})
export class DonateModule { }
