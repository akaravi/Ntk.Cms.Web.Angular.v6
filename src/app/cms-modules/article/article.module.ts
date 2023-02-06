import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArticleComponent } from './article.component';
import { ArticleRouting } from './article.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { InlineSVGModule } from 'ng-inline-svg-2';
import {
  ArticleCategoryService,
  ArticleCommentService,
  ArticleConfigurationService,
  ArticleContentAndParameterValueService, ArticleContentCategoryService, ArticleContentOtherInfoService,
  ArticleContentParameterService,
  ArticleContentParameterTypeService,
  ArticleContentService,
  ArticleContentSimilarService,
  ArticleContentTagService,
  ArticleShareMainAdminSettingService,
  ArticleShareReceiverCategoryService,
  ArticleShareServerCategoryService, CoreEnumService, CoreModuleService, CoreModuleTagService
} from 'ntk-cms-api';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { SharedModule } from 'src/app/shared.module';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { ArticleCategoryAddComponent } from './category/add/add.component';
import { ArticleCategoryDeleteComponent } from './category/delete/delete.component';
import { ArticleCategoryEditComponent } from './category/edit/edit.component';
import { ArticleCategorySelectorComponent } from './category/selector/selector.component';
import { ArticleCategoryTreeSelectorComponent } from './category/tree-selector/tree-selector.component';
import { ArticleCategoryTreeComponent } from './category/tree/tree.component';
import { ArticleCommentEditComponent } from './comment/edit/edit.component';
import { ArticleCommentListComponent } from './comment/list/list.component';
import { ArticleContentAddComponent } from './content/add/add.component';
import { ArticleContentDeleteComponent } from './content/delete/delete.component';
import { ArticleContentEditComponent } from './content/edit/edit.component';
import { ArticletHeaderComponent } from './content/header/header.component';
import { ArticleContentListComponent } from './content/list/list.component';
import { ArticleContentSelectorComponent } from './content/selector/selector.component';
@NgModule({
  declarations: [
    ArticleComponent,
    ArticleContentAddComponent,
    ArticleContentEditComponent,
    ArticleContentDeleteComponent,
    ArticleContentListComponent,
    ArticleContentSelectorComponent,
    ArticleCategoryTreeComponent,
    ArticletHeaderComponent,
    ArticleCategorySelectorComponent,
    ArticleCategoryAddComponent,
    ArticleCategoryEditComponent,
    ArticleCategoryDeleteComponent,
    ArticleCommentListComponent,
    ArticleCommentEditComponent,
    ArticleCategoryTreeSelectorComponent,
  ],
  imports: [
    ArticleRouting,
    CommonModule,
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
    ArticleConfigurationService,
    /*Config*/
    CoreModuleTagService,
    CmsConfirmationDialogService,
    ArticleCategoryService,
    ArticleCommentService,
    ArticleConfigurationService,
    ArticleContentService,
    ArticleContentCategoryService,
    ArticleContentAndParameterValueService,
    ArticleContentOtherInfoService,
    ArticleContentParameterService,
    ArticleContentParameterTypeService,
    ArticleContentSimilarService,
    ArticleContentTagService,
    ArticleShareMainAdminSettingService,
    ArticleShareReceiverCategoryService,
    ArticleShareServerCategoryService,
  ]
})
export class ArticleModule { }