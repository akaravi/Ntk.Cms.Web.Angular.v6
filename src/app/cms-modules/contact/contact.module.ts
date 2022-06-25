import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactRouting } from './contact.routing';
import { ContactComponent } from './contact.component';


import {
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  ContactCategoryService,
  ContactConfigurationService,
  ContactContentService,

} from 'ntk-cms-api';
import { ContactCategoryEditComponent } from './category/edit/edit.component';
import { ContactCategoryDeleteComponent } from './category/delete/delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';

import { CmsFileManagerModule } from 'src/filemanager-api';
import { ContactCategorySelectorComponent } from './category/selector/selector.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ContactContentListComponent } from './content/list/list.component';
import { ContactContentAddComponent } from './content/add/add.component';
import { ContactContentEditComponent } from './content/edit/edit.component';
import { ContactCategoryTreeComponent } from './category/tree/tree.component';
import { ContactCategoryAddComponent } from './category/add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { ContactContentSelectorComponent } from './content/selector/selector.component';


@NgModule({
  declarations: [
    ContactComponent,
    ContactCategorySelectorComponent,
    ContactCategoryAddComponent,
    ContactCategoryEditComponent,
    ContactCategoryDeleteComponent,
    ContactCategoryTreeComponent,
    ContactContentSelectorComponent,
    ContactContentListComponent,
    ContactContentAddComponent,
    ContactContentEditComponent,
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
