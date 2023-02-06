import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BiographyComponent } from './biography.component';
import { BiographyRouting } from './biography.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  BiographyCategoryService,
  BiographyCommentService,
  BiographyConfigurationService,
  BiographyContentAndParameterValueService, BiographyContentCategoryService, BiographyContentOtherInfoService,
  BiographyContentParameterService,
  BiographyContentParameterTypeService,
  BiographyContentService,
  BiographyContentSimilarService,
  BiographyContentTagService,
  BiographyShareMainAdminSettingService,
  BiographyShareReceiverCategoryService,
  BiographyShareServerCategoryService, CoreEnumService, CoreModuleService, CoreModuleTagService
} from 'ntk-cms-api';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { SharedModule } from 'src/app/shared.module';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { BiographyCategoryAddComponent } from './category/add/add.component';
import { BiographyCategoryDeleteComponent } from './category/delete/delete.component';
import { BiographyCategoryEditComponent } from './category/edit/edit.component';
import { BiographyCategorySelectorComponent } from './category/selector/selector.component';
import { BiographyCategoryTreeSelectorComponent } from './category/tree-selector/tree-selector.component';
import { BiographyCategoryTreeComponent } from './category/tree/tree.component';
import { BiographyCommentEditComponent } from './comment/edit/edit.component';
import { BiographyCommentListComponent } from './comment/list/list.component';
import { BiographyContentAddComponent } from './content/add/add.component';
import { BiographyContentDeleteComponent } from './content/delete/delete.component';
import { BiographyContentEditComponent } from './content/edit/edit.component';
import { BiographyContentListComponent } from './content/list/list.component';
import { BiographyContentSelectorComponent } from './content/selector/selector.component';
@NgModule({
  declarations: [
    BiographyComponent,
    BiographyContentAddComponent,
    BiographyContentEditComponent,
    BiographyContentDeleteComponent,
    BiographyContentListComponent,
    BiographyContentSelectorComponent,
    BiographyCategoryTreeComponent,
    BiographyCategorySelectorComponent,
    BiographyCategoryAddComponent,
    BiographyCategoryEditComponent,
    BiographyCategoryDeleteComponent,
    BiographyCommentListComponent,
    BiographyCommentEditComponent,
    BiographyCategoryTreeSelectorComponent,
  ],
  imports: [
    CommonModule,
    BiographyRouting,
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
    /*Config*/
    BiographyConfigurationService,
    /*Config*/
    CmsConfirmationDialogService,
    BiographyCategoryService,
    BiographyCommentService,
    BiographyConfigurationService,
    BiographyContentService,
    BiographyContentCategoryService,
    BiographyContentAndParameterValueService,
    BiographyContentOtherInfoService,
    BiographyContentParameterService,
    BiographyContentParameterTypeService,
    BiographyContentSimilarService,
    BiographyContentTagService,
    BiographyShareMainAdminSettingService,
    BiographyShareReceiverCategoryService,
    BiographyShareServerCategoryService,
  ]
})
export class BiographyModule { }