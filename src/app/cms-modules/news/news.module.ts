import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NewsComponent } from './news.component';
import { NewsRouting } from './news.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { InlineSVGModule } from 'ng-inline-svg-2';
import {
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  NewsCategoryService,
  NewsCommentService,
  NewsConfigurationService,
  NewsContentAndParameterValueService,
  NewsContentCategoryService,
  NewsContentOtherInfoService,
  NewsContentParameterService,
  NewsContentParameterTypeService,
  NewsContentService,
  NewsContentSimilarService,
  NewsContentTagService,
  NewsShareMainAdminSettingService,
  NewsShareReceiverCategoryService,
  NewsShareServerCategoryService
} from 'ntk-cms-api';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { SharedModule } from 'src/app/shared.module';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { NewsCategoryAddComponent } from './category/add/add.component';
import { NewsCategoryDeleteComponent } from './category/delete/delete.component';
import { NewsCategoryEditComponent } from './category/edit/edit.component';
import { NewsCategorySelectorComponent } from './category/selector/selector.component';
import { NewsCategoryTreeSelectorComponent } from './category/tree-selector/tree-selector.component';
import { NewsCategoryTreeComponent } from './category/tree/tree.component';
import { NewsCommentEditComponent } from './comment/edit/edit.component';
import { NewsCommentListComponent } from './comment/list/list.component';
import { NewsContentAddComponent } from './content/add/add.component';
import { NewsContentDeleteComponent } from './content/delete/delete.component';
import { NewsContentEditComponent } from './content/edit/edit.component';
import { NewsContentHeaderComponent } from './content/header/header.component';
import { NewsContentListComponent } from './content/list/list.component';
import { NewsContentSelectorComponent } from './content/selector/selector.component';
@NgModule({
  declarations: [
    NewsComponent,
    NewsContentAddComponent,
    NewsContentEditComponent,
    NewsContentDeleteComponent,
    NewsContentListComponent,
    NewsContentSelectorComponent,
    NewsContentHeaderComponent,
    NewsCategoryTreeComponent,
    NewsCategoryTreeSelectorComponent,
    NewsCategorySelectorComponent,
    NewsCategoryAddComponent,
    NewsCategoryEditComponent,
    NewsCategoryDeleteComponent,
    NewsCommentListComponent,
    NewsCommentEditComponent,
  ],
  imports: [
    CommonModule,
    NewsRouting,
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
    CoreModuleTagService,
    CmsConfirmationDialogService,
    /*Config*/
    NewsConfigurationService,
    /*Config*/
    NewsCategoryService,
    NewsCommentService,
    NewsContentService,
    NewsContentAndParameterValueService,
    NewsContentOtherInfoService,
    NewsContentParameterService,
    NewsContentParameterTypeService,
    NewsContentSimilarService,
    NewsContentTagService,
    NewsShareMainAdminSettingService,
    NewsShareReceiverCategoryService,
    NewsShareServerCategoryService,
    NewsContentCategoryService,
  ]
})
export class NewsModule { }
