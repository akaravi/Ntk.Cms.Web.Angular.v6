import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerRouting } from './fileManager.routing';
import { FileManagerComponent } from './fileManager.component';
import { TagInputModule } from 'ngx-chips';

import {
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  FileCategoryService,
  FileContentService,
} from 'ntk-cms-api';
import { FileCategoryEditComponent } from './category/edit/edit.component';
import { FileCategoryDeleteComponent } from './category/delete/delete.component';
import { FileContentEditComponent } from './content/edit/edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';


import { CmsFileManagerModule } from 'src/filemanager-api';
import { FileCategorySelectorComponent } from './category/selector/selector.component';
import { FileContentListComponent } from './content/list/list.component';
import { FileCategoryTreeComponent } from './category/tree/tree.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FileContentSelectorComponent } from './content/selector/selector.component';
import { FileContentDeleteComponent } from './content/delete/delete.component';
import { FileContentExplorerComponent } from './content/explorer/explorer.component';


@NgModule({
  declarations: [
    FileManagerComponent,
    FileContentEditComponent,
    FileContentDeleteComponent,
    FileContentListComponent,
    FileContentSelectorComponent,
    FileCategoryTreeComponent,
    FileCategorySelectorComponent,
    FileCategoryEditComponent,
    FileCategoryDeleteComponent,
    FileContentExplorerComponent
  ],
  imports: [
    FileManagerRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    
    
  ],
  providers: [
    CoreModuleService,
    FileCategoryService,
    FileContentService,
    CoreEnumService,
    CoreModuleTagService
  ]
})
export class FileManagerModule { }
