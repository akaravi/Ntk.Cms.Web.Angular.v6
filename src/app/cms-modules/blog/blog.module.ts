import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogRouting } from './blog.routing';
import { BlogComponent } from './blog.component';
import { TagInputModule } from 'ngx-chips';

import {
  CoreEnumService,
  CoreModuleTagService,
  BlogCategoryService,
  BlogCommentService,
  BlogConfigurationService,
  BlogContentAndParameterValueService,
  BlogContentOtherInfoService,
  BlogContentParameterService,
  BlogContentParameterTypeService,
  BlogContentService,
  BlogContentSimilarService,
  BlogContentTagService,
  BlogShareMainAdminSettingService,
  BlogShareReceiverCategoryService,
  BlogShareServerCategoryService,
  BlogContentCategoryService,
  CoreModuleService
} from 'ntk-cms-api';
import { BlogCategoryEditComponent } from './category/edit/edit.component';
import { BlogCategoryDeleteComponent } from './category/delete/delete.component';
import { BlogContentEditComponent } from './content/edit/edit.component';
import { BlogContentAddComponent } from './content/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';

import { CmsFileManagerModule } from 'src/filemanager-api';
import { BlogCategorySelectorComponent } from './category/selector/selector.component';
import { BlogContentListComponent } from './content/list/list.component';
import { BlogCategoryTreeComponent } from './category/tree/tree.component';
import { BlogCommentListComponent } from './comment/list/list.component';
import { BlogCommentEditComponent } from './comment/edit/edit.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BlogContentSelectorComponent } from './content/selector/selector.component';
import { BlogContentDeleteComponent } from './content/delete/delete.component';
import { BlogCategoryAddComponent } from './category/add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { BlogCategoryTreeSelectorComponent } from './category/tree-selector/tree-selector.component';
import { BlogContentHeaderComponent } from './content/header/header.component';

@NgModule({
  declarations: [
    BlogComponent,
    /** */
    BlogContentAddComponent,
    BlogContentEditComponent,
    BlogContentDeleteComponent,
    BlogContentListComponent,
    BlogContentHeaderComponent,
    BlogContentSelectorComponent,
    BlogCategoryTreeComponent,
    BlogCategorySelectorComponent,
    BlogCategoryAddComponent,
    BlogCategoryEditComponent,
    BlogCategoryDeleteComponent,
    BlogCategoryTreeSelectorComponent,
    BlogCommentListComponent,
    BlogCommentEditComponent,
  ],
  imports: [
    CommonModule,
    BlogRouting,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    /*Config*/
    BlogConfigurationService,
    /*Config*/
    CoreModuleTagService,
    CmsConfirmationDialogService,
    BlogCategoryService,
    BlogCommentService,
    BlogConfigurationService,
    BlogContentService,
    BlogContentCategoryService,
    BlogContentAndParameterValueService,
    BlogContentOtherInfoService,
    BlogContentParameterService,
    BlogContentParameterTypeService,
    BlogContentSimilarService,
    BlogContentTagService,
    BlogShareMainAdminSettingService,
    BlogShareReceiverCategoryService,
    BlogShareServerCategoryService,

  ]
})
export class BlogModule { }
