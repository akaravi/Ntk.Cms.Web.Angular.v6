import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContactComponent } from './contact.component';
import { ContactRouting } from './contact.routing';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ContactCategoryService,
  ContactConfigurationService,
  ContactContentService, CoreEnumService,
  CoreModuleService,
  CoreModuleTagService
} from 'ntk-cms-api';
import { ContactCategoryDeleteComponent } from './category/delete/delete.component';
import { ContactCategoryEditComponent } from './category/edit/edit.component';

import { SharedModule } from 'src/app/shared.module';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { ContactCategoryAddComponent } from './category/add/add.component';
import { ContactCategorySelectorComponent } from './category/selector/selector.component';
import { ContactCategoryTreeSelectorComponent } from './category/tree-selector/tree-selector.component';
import { ContactCategoryTreeComponent } from './category/tree/tree.component';
import { ContactContentAddComponent } from './content/add/add.component';
import { ContactContentEditComponent } from './content/edit/edit.component';
import { ContactContentListComponent } from './content/list/list.component';
import { ContactContentSelectionlistComponent } from './content/selection-list/selectionlist.component';
import { ContactContentSelectorComponent } from './content/selector/selector.component';


@NgModule({
  declarations: [
    ContactComponent,
    ContactCategorySelectorComponent,
    ContactCategoryAddComponent,
    ContactCategoryEditComponent,
    ContactCategoryDeleteComponent,
    ContactCategoryTreeComponent,
    ContactCategoryTreeSelectorComponent,
    ContactContentSelectorComponent,
    ContactContentListComponent,
    ContactContentAddComponent,
    ContactContentEditComponent,
    ContactContentSelectionlistComponent,
  ],
  imports: [
    CommonModule,
    ContactRouting,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule.forRoot(),
    AngularEditorModule,

    CmsFileManagerModule
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    /*Config*/
    ContactConfigurationService,
    /*Config*/
    CoreModuleTagService,
    CmsConfirmationDialogService,
    ContactCategoryService,
    ContactContentService,

  ]
})
export class ContactModule { }
