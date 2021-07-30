import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreUserRouting } from './coreUser.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { CoreEnumService, CoreSiteUserService, CoreUserGroupService, CoreUserService } from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CoreUserComponent } from './coreUser.component';
import { CoreUserListComponent } from './list/list.component';
import { CoreUserAddComponent } from './add/add.component';
import { CoreUserEditComponent } from './edit/edit.component';
import { CoreUserSelectorComponent } from './selector/selector.component';
import { CoreUserChangePasswordComponent } from './changePassword/changePassword.component';
import { CoreUserViewComponent } from './view/view.component';



@NgModule({
  declarations: [
    CoreUserComponent,
    CoreUserListComponent,
    CoreUserAddComponent,
    CoreUserEditComponent,
    CoreUserChangePasswordComponent,
    CoreUserSelectorComponent,
    CoreUserViewComponent,
  ],
  exports: [
    CoreUserComponent,
    CoreUserListComponent,
    CoreUserAddComponent,
    CoreUserEditComponent,
    CoreUserChangePasswordComponent,
    CoreUserSelectorComponent,
    CoreUserViewComponent
  ],
  imports: [
    CommonModule,
    CoreUserRouting,
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
    CoreUserService,
    CoreUserGroupService,
    CoreSiteUserService,
    CmsConfirmationDialogService
  ]
})
export class CoreUserModule { }
