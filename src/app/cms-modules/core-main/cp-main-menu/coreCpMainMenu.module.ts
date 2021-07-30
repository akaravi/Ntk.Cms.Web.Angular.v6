import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCpMainMenuRouting } from './coreCpMainMenu.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import {
   CoreEnumService,
   CoreSiteUserService,
    CoreCpMainMenuService ,
    CoreCpMainMenuCmsUserGroupService} from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CoreCpMainMenuComponent } from './coreCpMainMenu.component';
import { CoreCpMainMenuListComponent } from './list/list.component';
import { CoreCpMainMenuAddComponent } from './add/add.component';
import { CoreCpMainMenuEditComponent } from './edit/edit.component';
import { CoreCpMainMenuSelectorComponent } from './selector/selector.component';
import { CoreCpMainMenuTreeComponent } from './tree/tree.component';
import { CoreModuleModule } from '../module/coreModule.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { IconPickerModule } from 'ngx-icon-picker';
import { CoreUserGroupCmsModule } from '../user-group/coreUserGroup.module';
import { DragDropModule } from '@angular/cdk/drag-drop';



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
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CoreModuleModule,
    CoreUserGroupCmsModule,
    ColorPickerModule,
    IconPickerModule,
    DragDropModule
  ],
  providers: [
    CoreEnumService,
    CoreCpMainMenuService,
    CoreCpMainMenuCmsUserGroupService,
    CoreSiteUserService,
    CmsConfirmationDialogService
  ]
})
export class CoreCpMainMenu { }
