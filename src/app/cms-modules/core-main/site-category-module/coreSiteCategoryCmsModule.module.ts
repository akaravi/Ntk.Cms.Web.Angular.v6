import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreModuleService,
  CoreSiteCategoryCmsModuleService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { CoreSiteCategoryCmsModuleListComponent } from './list/list.component';
import { CoreSiteCategoryCmsModuleSelectorComponent } from './selector/selector.component';
import { CoreSiteCategoryCmsModuleTreeComponent } from './tree/tree.component';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CoreModuleModule } from '../module/coreModule.module';
import { CoreSiteCategoryCmsModule } from '../site-category/coreSiteCategory.module';
import { CoreSiteCategoryCmsModuleAddComponent } from './add/add.component';
import { CoreSiteCategoryCmsModuleComponent } from './coreSiteCategoryCmsModule.component';
import { CoreSiteCategoryCmsModuleRouting } from './coreSiteCategoryCmsModule.routing';
import { CoreSiteCategoryCmsModuleEditComponent } from './edit/edit.component';
import { CoreSiteCategoryCmsModuleListViewComponent } from './listview/listview.component';


@NgModule({
  declarations: [
    CoreSiteCategoryCmsModuleComponent,
    CoreSiteCategoryCmsModuleListComponent,
    CoreSiteCategoryCmsModuleListViewComponent,
    CoreSiteCategoryCmsModuleAddComponent,
    CoreSiteCategoryCmsModuleEditComponent,

    CoreSiteCategoryCmsModuleSelectorComponent,
    CoreSiteCategoryCmsModuleTreeComponent,
  ],
  exports: [
    CoreSiteCategoryCmsModuleComponent,
    CoreSiteCategoryCmsModuleListComponent,
    CoreSiteCategoryCmsModuleListViewComponent,
    CoreSiteCategoryCmsModuleAddComponent,
    CoreSiteCategoryCmsModuleEditComponent,

    CoreSiteCategoryCmsModuleSelectorComponent,
    CoreSiteCategoryCmsModuleTreeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreSiteCategoryCmsModuleRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,

    CoreModuleModule,
    CoreSiteCategoryCmsModule,
  ],
  providers: [
    CoreSiteCategoryCmsModuleService,
    CmsConfirmationDialogService,
    CoreModuleService,
  ]
})
export class CoreSiteCategoryCmsModuleModule {
}
