import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlogComponent } from './blog.component';
import { BlogRouting } from './blog.routing';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BlogCategoryService,
  BlogCommentService,
  BlogConfigurationService,
  BlogContentAndParameterValueService, BlogContentCategoryService, BlogContentOtherInfoService,
  BlogContentParameterService,
  BlogContentParameterTypeService,
  BlogContentService,
  BlogContentSimilarService,
  BlogContentTagService,
  BlogShareMainAdminSettingService,
  BlogShareReceiverCategoryService,
  BlogShareServerCategoryService, CoreEnumService, CoreModuleService, CoreModuleTagService
} from 'ntk-cms-api';
import { BlogCategoryDeleteComponent } from './category/delete/delete.component';
import { BlogCategoryEditComponent } from './category/edit/edit.component';
import { BlogContentAddComponent } from './content/add/add.component';
import { BlogContentEditComponent } from './content/edit/edit.component';

import { SharedModule } from 'src/app/shared.module';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { BlogCategoryAddComponent } from './category/add/add.component';
import { BlogCategorySelectorComponent } from './category/selector/selector.component';
import { BlogCategoryTreeSelectorComponent } from './category/tree-selector/tree-selector.component';
import { BlogCategoryTreeComponent } from './category/tree/tree.component';
import { BlogCommentEditComponent } from './comment/edit/edit.component';
import { BlogCommentListComponent } from './comment/list/list.component';
import { BlogContentDeleteComponent } from './content/delete/delete.component';
import { BlogContentHeaderComponent } from './content/header/header.component';
import { BlogContentListComponent } from './content/list/list.component';
import { BlogContentSelectorComponent } from './content/selector/selector.component';

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

    CmsFileManagerModule,
    InlineSVGModule,
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
