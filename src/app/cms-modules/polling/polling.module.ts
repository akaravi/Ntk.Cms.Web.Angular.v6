import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PollingComponent } from './polling.component';
import { PollingRouting } from './polling.routing';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  PollingCategoryService,
  PollingConfigurationService,
  PollingContentService,
  PollingOptionService,
  PollingVoteService
} from 'ntk-cms-api';
import { PollingCategoryDeleteComponent } from './category/delete/delete.component';
import { PollingCategoryEditComponent } from './category/edit/edit.component';

import { SharedModule } from 'src/app/shared.module';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { PollingCategoryAddComponent } from './category/add/add.component';
import { PollingCategorySelectorComponent } from './category/selector/selector.component';
import { PollingCategoryTreeComponent } from './category/tree/tree.component';
import { PollingContentAddComponent } from './content/add/add.component';
import { PollingContentDeleteComponent } from './content/delete/delete.component';
import { PollingContentEditComponent } from './content/edit/edit.component';
import { PollingContentListComponent } from './content/list/list.component';
import { PollingVoteEditComponent } from './vote/edit/edit.component';
import { PollingVoteListComponent } from './vote/list/list.component';


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
