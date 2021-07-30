import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModuleComponent } from './coreModule.component';
import { CoreModuleRoutes } from './coreModule.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { TagInputModule } from 'ngx-chips';
import { CoreModuleTagEditComponent } from './tag/edit/edit.component';
import { CoreModuleTagListComponent } from './tag/list/list.component';
import { CoreModuleTagCategoryDeleteComponent } from './tagCategory/delete/delete.component';
import { CoreModuleTagCategoryEditComponent } from './tagCategory/edit/edit.component';
import { CoreModuleTagCategoryTreeComponent } from './tagCategory/tree/tree.component';
import { CoreModuleTagCategorySelectorComponent } from './tagCategory/selector/selector.component';
import { CoreModuleTagSelectorComponent } from './tag/selector/selector.component';
import { CoreModuleTagCategoryService, CoreModuleTagService } from 'ntk-cms-api';


@NgModule({
  imports: [
    CoreModuleRoutes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
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
  ],
  providers: [
    CoreModuleTagService,
    CoreModuleTagCategoryService,
  ]
})
export class CoreModuleModule { }
