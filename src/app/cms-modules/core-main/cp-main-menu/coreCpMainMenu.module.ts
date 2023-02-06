import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCpMainMenuRouting } from './coreCpMainMenu.routing';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from 'src/app/shared.module';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColorPickerModule } from 'ngx-color-picker';
import { IconPickerModule } from 'ngx-icon-picker';
import {
  CoreCpMainMenuCmsUserGroupService, CoreCpMainMenuService, CoreEnumService, CoreModuleService, CoreSiteUserService
} from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CoreModuleModule } from '../module/coreModule.module';
import { CoreUserGroupCmsModule } from '../user-group/coreUserGroup.module';
import { CoreCpMainMenuAddComponent } from './add/add.component';
import { CoreCpMainMenuComponent } from './coreCpMainMenu.component';
import { CoreCpMainMenuEditComponent } from './edit/edit.component';
import { CoreCpMainMenuListComponent } from './list/list.component';
import { CoreCpMainMenuSelectorComponent } from './selector/selector.component';
import { CoreCpMainMenuTreeComponent } from './tree/tree.component';



@NgModule({
  declarations: [
    CoreCpMainMenuComponent,
    CoreCpMainMenuListComponent,
    CoreCpMainMenuAddComponent,
    CoreCpMainMenuEditComponent,
    CoreCpMainMenuTreeComponent,
    CoreCpMainMenuSelectorComponent,
  ],
  exports: [
    CoreCpMainMenuComponent,
    CoreCpMainMenuListComponent,
    CoreCpMainMenuAddComponent,
    CoreCpMainMenuEditComponent,
    CoreCpMainMenuTreeComponent,
    CoreCpMainMenuSelectorComponent,
  ],
  imports: [
    CommonModule,
    CoreCpMainMenuRouting,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,

    CoreModuleModule,
    CoreUserGroupCmsModule,
    ColorPickerModule,
    IconPickerModule,
    DragDropModule
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    CoreCpMainMenuService,
    CoreCpMainMenuCmsUserGroupService,
    CoreSiteUserService,
    CmsConfirmationDialogService
  ]
})
export class CoreCpMainMenu { }
