import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileManagerComponent } from './file-manager.component';
import { FileManagerRouting } from './file-manager.routing';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  FileCategoryService,
  FileContentService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { FileCategoryDeleteComponent } from './category/delete/delete.component';
import { FileCategoryEditComponent } from './category/edit/edit.component';
import { FileCategorySelectorComponent } from './category/selector/selector.component';
import { FileCategoryTreeComponent } from './category/tree/tree.component';
import { FileContentDeleteComponent } from './content/delete/delete.component';
import { FileContentEditComponent } from './content/edit/edit.component';
import { FileContentExplorerComponent } from './content/explorer/explorer.component';
import { FileContentListComponent } from './content/list/list.component';
import { FileContentSelectorComponent } from './content/selector/selector.component';


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
