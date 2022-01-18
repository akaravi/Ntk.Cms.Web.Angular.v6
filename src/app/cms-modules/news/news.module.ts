import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsRouting } from './news.routing';
import { NewsComponent } from './news.component';
import { TagInputModule } from 'ngx-chips';
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
import { NewsCategoryEditComponent } from './category/edit/edit.component';
import { NewsCategoryDeleteComponent } from './category/delete/delete.component';
import { NewsContentEditComponent } from './content/edit/edit.component';
import { NewsContentAddComponent } from './content/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CmsFileManagerModule } from 'src/filemanager-api';
import { NewsCategorySelectorComponent } from './category/selector/selector.component';
import { NewsContentListComponent } from './content/list/list.component';
import { NewsCategoryTreeComponent } from './category/tree/tree.component';
import { NewsCommentListComponent } from './comment/list/list.component';
import { NewsCommentEditComponent } from './comment/edit/edit.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NewsContentSelectorComponent } from './content/selector/selector.component';
import { NewsContentDeleteComponent } from './content/delete/delete.component';
import { NewsCategoryAddComponent } from './category/add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { NewsCategoryTreeSelectorComponent } from './category/tree-selector/tree-selector.component';
import { NewsContentHeaderComponent } from './content/header/header.component';
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
    TagInputModule,
    CmsFileManagerModule
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
