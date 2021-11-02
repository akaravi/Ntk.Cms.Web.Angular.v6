import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkManagementComponent } from './linkManagement.component';
import { LinkManagementRoutes } from './linkManagement.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import {
  CoreAuthService,
  CoreEnumService,
  LinkManagementConfigurationService,
  CoreModuleService,
  LinkManagementEnumService,
  LinkManagementTargetCategoryService,
  LinkManagementTargetService
} from 'ntk-cms-api';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { LinkManagementTargetCategoryAddComponent } from './target-category/add/add.component';
import { LinkManagementTargetCategoryDeleteComponent } from './target-category/delete/delete.component';
import { LinkManagementTargetCategoryEditComponent } from './target-category/edit/edit.component';
import { LinkManagementTargetCategorySelectorComponent } from './target-category/selector/selector.component';
import { LinkManagementTargetCategoryTreeSelectorComponent } from './target-category/tree-selector/tree-selector.component';
import { LinkManagementTargetCategoryTreeComponent } from './target-category/tree/tree.component';
import { LinkManagementTargetAddComponent } from './target/add/add.component';
import { LinkManagementTargetDeleteComponent } from './target/delete/delete.component';
import { LinkManagementTargetEditComponent } from './target/edit/edit.component';
import { LinkManagementTargetListComponent } from './target/list/list.component';

@NgModule({
  declarations: [
    LinkManagementComponent,
    /** */
    LinkManagementTargetCategoryTreeComponent,
    LinkManagementTargetCategorySelectorComponent,
    LinkManagementTargetCategoryAddComponent,
    LinkManagementTargetCategoryEditComponent,
    LinkManagementTargetCategoryDeleteComponent,
    LinkManagementTargetCategoryTreeSelectorComponent,
    /** */
    LinkManagementTargetAddComponent,
    LinkManagementTargetEditComponent,
    LinkManagementTargetDeleteComponent,
    LinkManagementTargetListComponent,
    /** */
  ],
  exports: [
    /** */
    LinkManagementTargetCategoryTreeComponent,
    LinkManagementTargetCategorySelectorComponent,
    LinkManagementTargetCategoryAddComponent,
    LinkManagementTargetCategoryEditComponent,
    LinkManagementTargetCategoryDeleteComponent,
    LinkManagementTargetCategoryTreeSelectorComponent,
    /** */
    LinkManagementTargetAddComponent,
    LinkManagementTargetEditComponent,
    LinkManagementTargetDeleteComponent,
    LinkManagementTargetListComponent,
    /** */
  ],
  imports: [
    CommonModule,
    LinkManagementRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,

    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    CoreAuthService,
    /*Config*/
    LinkManagementConfigurationService,
    /*Config*/
    CmsConfirmationDialogService,
    LinkManagementEnumService,
    LinkManagementTargetCategoryService,
    LinkManagementTargetService,
  ]
})
export class LinkManagementModule { }
