import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsRouting } from './news.routing';
import { NewsComponent } from './news.component';
import { TagInputModule } from 'ngx-chips';

import {
  CoreEnumService,
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
  NewsShareReciverCategoryService,
  NewsShareServerCategoryService
} from 'ntk-cms-api';
import { NewsCategoryEditComponent } from './category/edit/edit.component';
import { NewsCategoryDeleteComponent } from './category/delete/delete.component';
import { NewsContentEditComponent } from './content/edit/edit.component';
import { NewsContentAddComponent } from './content/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';

import { CmsFileManagerModule } from 'ntk-cms-filemanager';
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
import { NewsConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { NewsConfigSiteComponent } from './config/site/configSite.component';
import { NewsCategoryTreeSelectorComponent } from './category/tree-selector/tree-selector.component';


@NgModule({
  declarations: [
    NewsComponent,
    /*Config*/
    NewsConfigMainAdminComponent,
    NewsConfigSiteComponent,
    /*Config*/
    NewsContentAddComponent,
    NewsContentEditComponent,
    NewsContentDeleteComponent,
    NewsContentListComponent,
    NewsContentSelectorComponent,
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
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule
  ],
  providers: [
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
    NewsShareReciverCategoryService,
    NewsShareServerCategoryService,
    NewsContentCategoryService,
  ]
})
export class NewsModule { }
