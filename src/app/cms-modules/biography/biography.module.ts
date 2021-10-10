import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiographyRouting } from './biography.routing';
import { BiographyComponent } from './biography.component';
import { TagInputModule } from 'ngx-chips';

import {
  CoreEnumService,
  CoreModuleTagService,
  BiographyCategoryService,
  BiographyCommentService,
  BiographyConfigurationService,
  BiographyContentAndParameterValueService,
  BiographyContentOtherInfoService,
  BiographyContentParameterService,
  BiographyContentParameterTypeService,
  BiographyContentService,
  BiographyContentSimilarService,
  BiographyContentTagService,
  BiographyShareMainAdminSettingService,
  BiographyShareReciverCategoryService,
  BiographyShareServerCategoryService,
  BiographyContentCategoryService
} from 'ntk-cms-api';
import { BiographyCategoryEditComponent } from './category/edit/edit.component';
import { BiographyCategoryDeleteComponent } from './category/delete/delete.component';
import { BiographyContentEditComponent } from './content/edit/edit.component';
import { BiographyContentAddComponent } from './content/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';

import { CmsFileManagerModule } from 'src/filemanager-api';
import { BiographyCategorySelectorComponent } from './category/selector/selector.component';
import { BiographyContentListComponent } from './content/list/list.component';
import { BiographyCategoryTreeComponent } from './category/tree/tree.component';
import { BiographyCommentListComponent } from './comment/list/list.component';
import { BiographyCommentEditComponent } from './comment/edit/edit.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BiographyContentSelectorComponent } from './content/selector/selector.component';
import { BiographyContentDeleteComponent } from './content/delete/delete.component';
import { BiographyCategoryAddComponent } from './category/add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { BiographyConfigSiteComponent } from './config/site/configSite.component';
import { BiographyConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { BiographyCategoryTreeSelectorComponent } from './category/tree-selector/tree-selector.component';

@NgModule({
  declarations: [
    /*Config*/
    BiographyConfigMainAdminComponent,
    BiographyConfigSiteComponent,
    /*Config*/
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
    TagInputModule,
    CmsFileManagerModule
  ],
  providers: [
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
    BiographyShareReciverCategoryService,
    BiographyShareServerCategoryService,

  ]
})
export class BiographyModule { }
