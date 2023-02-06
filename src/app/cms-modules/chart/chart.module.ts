import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartComponent } from './chart.component';
import { ChartRouting } from './chart.routing';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
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
  ChartShareReceiverCategoryService,
  ChartShareServerCategoryService, CoreEnumService, CoreModuleService, CoreModuleTagService
} from 'ntk-cms-api';
import { ChartCategoryDeleteComponent } from './category/delete/delete.component';
import { ChartCategoryEditComponent } from './category/edit/edit.component';
import { ChartContentAddComponent } from './content/add/add.component';
import { ChartContentEditComponent } from './content/edit/edit.component';

import { SharedModule } from 'src/app/shared.module';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { ChartCategoryAddComponent } from './category/add/add.component';
import { ChartCategorySelectorComponent } from './category/selector/selector.component';
import { ChartCategoryTreeSelectorComponent } from './category/tree-selector/tree-selector.component';
import { ChartCategoryTreeComponent } from './category/tree/tree.component';
import { ChartCommentEditComponent } from './comment/edit/edit.component';
import { ChartCommentListComponent } from './comment/list/list.component';
import { ChartContentDeleteComponent } from './content/delete/delete.component';
import { ChartContentListComponent } from './content/list/list.component';
import { ChartContentSelectorComponent } from './content/selector/selector.component';


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
    ChartShareReceiverCategoryService,
    ChartShareServerCategoryService,
    ChartContentCategoryService,
  ]
})
export class ChartModule { }
