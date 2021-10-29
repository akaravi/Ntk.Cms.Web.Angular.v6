import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartRouting } from './chart.routing';
import { ChartComponent } from './chart.component';
import { TagInputModule } from 'ngx-chips';

import {
  CoreEnumService,
  CoreModuleTagService,
  ChartCategoryService,
  ChartCommentService,
  ChartConfigurationService,
  ChartContentAndParameterValueService,
  ChartContentCategoryService,
  ChartContentOtherInfoService,
  ChartContentParameterService,
  ChartContentParameterTypeService,
  ChartContentService,
  ChartContentSimilarService,
  ChartContentTagService,
  ChartShareMainAdminSettingService,
  ChartShareReciverCategoryService,
  ChartShareServerCategoryService,
  CoreModuleService
} from 'ntk-cms-api';
import { ChartCategoryEditComponent } from './category/edit/edit.component';
import { ChartCategoryDeleteComponent } from './category/delete/delete.component';
import { ChartContentEditComponent } from './content/edit/edit.component';
import { ChartContentAddComponent } from './content/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';

import { CmsFileManagerModule } from 'src/filemanager-api';
import { ChartCategorySelectorComponent } from './category/selector/selector.component';
import { ChartContentListComponent } from './content/list/list.component';
import { ChartCategoryTreeComponent } from './category/tree/tree.component';
import { ChartCommentListComponent } from './comment/list/list.component';
import { ChartCommentEditComponent } from './comment/edit/edit.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ChartContentSelectorComponent } from './content/selector/selector.component';
import { ChartContentDeleteComponent } from './content/delete/delete.component';
import { ChartCategoryAddComponent } from './category/add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { ChartConfigMainAdminComponent } from './config/main-admin/config-main-admin.component';
import { ChartConfigSiteComponent } from './config/site/config-site.component';
import { ChartCategoryTreeSelectorComponent } from './category/tree-selector/tree-selector.component';


@NgModule({
  declarations: [
    ChartComponent,
    ChartContentAddComponent,
    ChartContentEditComponent,
    ChartContentDeleteComponent,
    ChartContentListComponent,
    ChartContentSelectorComponent,
    ChartCategoryTreeComponent,
    ChartCategoryTreeSelectorComponent,
    ChartCategorySelectorComponent,
    ChartCategoryAddComponent,
    ChartCategoryEditComponent,
    ChartCategoryDeleteComponent,
    ChartCommentListComponent,
    ChartCommentEditComponent,
  ],
  imports: [
    CommonModule,
    ChartRouting,
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
    ChartConfigurationService,
    /*Config*/
    ChartCategoryService,
    ChartCommentService,
    ChartContentService,
    ChartContentAndParameterValueService,
    ChartContentOtherInfoService,
    ChartContentParameterService,
    ChartContentParameterTypeService,
    ChartContentSimilarService,
    ChartContentTagService,
    ChartShareMainAdminSettingService,
    ChartShareReciverCategoryService,
    ChartShareServerCategoryService,
    ChartContentCategoryService,
  ]
})
export class ChartModule { }
