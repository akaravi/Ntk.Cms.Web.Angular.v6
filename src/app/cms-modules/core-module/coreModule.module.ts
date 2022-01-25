import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModuleComponent } from './coreModule.component';
import { CoreModuleRoutes } from './coreModule.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CmsFileManagerModule } from 'src/filemanager-api';
import { TagInputModule } from 'ngx-chips';
import { CoreModuleTagListComponent } from './tag/list/list.component';
import { CoreModuleTagCategoryDeleteComponent } from './tagCategory/delete/delete.component';
import { CoreModuleTagCategoryEditComponent } from './tagCategory/edit/edit.component';
import { CoreModuleTagCategoryTreeComponent } from './tagCategory/tree/tree.component';
import { CoreModuleTagCategorySelectorComponent } from './tagCategory/selector/selector.component';
import { CoreModuleTagSelectorComponent } from './tag/selector/selector.component';
import { CoreModuleService, CoreModuleTagCategoryService, CoreModuleTagService } from 'ntk-cms-api';
import { CoreModuleTagEditComponent } from './tag/edit/edit.component';
import { CoreModuleTagAddBulkComponent } from './tag/add-bulk/add-bulk.component';



@NgModule({
  imports: [
    CoreModuleRoutes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule
  ],
  declarations: [
    CoreModuleComponent,
    CoreModuleTagEditComponent,
    CoreModuleTagListComponent,
    CoreModuleTagCategoryEditComponent,
    CoreModuleTagCategoryDeleteComponent,
    CoreModuleTagCategoryTreeComponent,
    CoreModuleTagCategorySelectorComponent,
    CoreModuleTagSelectorComponent,
    CoreModuleTagAddBulkComponent,
  ],
  exports: [
    CoreModuleComponent,
    CoreModuleTagEditComponent,
    CoreModuleTagListComponent,
    CoreModuleTagCategoryEditComponent,
    CoreModuleTagCategoryDeleteComponent,
    CoreModuleTagCategoryTreeComponent,
    CoreModuleTagCategorySelectorComponent,
    CoreModuleTagSelectorComponent,
    CoreModuleTagAddBulkComponent
  ],
  providers: [
    CoreModuleService,
    CoreModuleTagService,
    CoreModuleTagCategoryService,
  ]
})
export class CoreModuleModule { }
