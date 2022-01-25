import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollingRouting } from './polling.routing';
import { PollingComponent } from './polling.component';
import { TagInputModule } from 'ngx-chips';

import {
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  PollingCategoryService,
  PollingConfigurationService,
  PollingContentService,
  PollingOptionService,
  PollingVoteService,

} from 'ntk-cms-api';
import { PollingCategoryEditComponent } from './category/edit/edit.component';
import { PollingCategoryDeleteComponent } from './category/delete/delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';

import { CmsFileManagerModule } from 'src/filemanager-api';
import { PollingCategorySelectorComponent } from './category/selector/selector.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PollingContentListComponent } from './content/list/list.component';
import { PollingContentAddComponent } from './content/add/add.component';
import { PollingContentEditComponent } from './content/edit/edit.component';
import { PollingCategoryTreeComponent } from './category/tree/tree.component';
import { PollingContentDeleteComponent } from './content/delete/delete.component';
import { PollingVoteEditComponent } from './vote/edit/edit.component';
import { PollingVoteListComponent } from './vote/list/list.component';
import { PollingCategoryAddComponent } from './category/add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { PollingConfigMainAdminComponent } from './config/main-admin/config-main-admin.component';
import { PollingConfigSiteComponent } from './config/site/config-site.component';


@NgModule({
  declarations: [
    PollingComponent,
    PollingCategorySelectorComponent,
    PollingCategoryAddComponent,
    PollingCategoryEditComponent,
    PollingCategoryDeleteComponent,
    PollingCategoryTreeComponent,
    PollingContentListComponent,
    PollingContentAddComponent,
    PollingContentEditComponent,
    PollingContentDeleteComponent,
    PollingVoteEditComponent,
    PollingVoteListComponent,
  ],
  imports: [
    CommonModule,
    PollingRouting,
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
    PollingConfigurationService,
    /*Config*/
    CoreModuleTagService,
    CmsConfirmationDialogService,
    PollingCategoryService,
    PollingContentService,
    PollingOptionService,
    PollingVoteService,
  ]
})
export class PollingModule { }
