import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonateComponent } from './donate.component';
import { DonateRoutes } from './donate.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import {
  CoreAuthService,
  CoreEnumService,
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
import { DonateConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { DonateConfigSiteComponent } from './config/site/configSite.component';
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

@NgModule({
  declarations: [
    DonateComponent,
    /*Config*/
    DonateConfigMainAdminComponent,
    DonateConfigSiteComponent,
    /*Config*/
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
  ],
  imports: [
    CommonModule,
    DonateRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule,
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    IconPickerModule,
    DragDropModule,
  ],
  providers: [
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
