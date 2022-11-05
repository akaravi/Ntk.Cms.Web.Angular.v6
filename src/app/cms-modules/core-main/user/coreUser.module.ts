import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreUserRouting } from './coreUser.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { CoreEnumService, CoreModuleService, CoreSiteUserService, CoreUserGroupService, CoreUserService } from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CoreUserComponent } from './coreUser.component';
import { CoreUserListComponent } from './list/list.component';
import { CoreUserAddComponent } from './add/add.component';
import { CoreUserEditComponent } from './edit/edit.component';
import { CoreUserSelectorComponent } from './selector/selector.component';
import { CoreUserChangePasswordComponent } from './changePassword/changePassword.component';
import { CoreUserViewComponent } from './view/view.component';
import { CoreUserResellerChartComponent } from './reseller-chart/reseller-chart.component';
import { CoreUserEmailConfirmComponent } from './emailConfirm/emailConfirm.component';



@NgModule({
  declarations: [
    CoreUserComponent,
    CoreUserListComponent,
    CoreUserAddComponent,
    CoreUserEditComponent,
    CoreUserChangePasswordComponent,
    CoreUserSelectorComponent,
    CoreUserViewComponent,
    CoreUserResellerChartComponent,
    CoreUserEmailConfirmComponent,
  ],
  exports: [
    CoreUserComponent,
    CoreUserListComponent,
    CoreUserAddComponent,
    CoreUserEditComponent,
    CoreUserChangePasswordComponent,
    CoreUserSelectorComponent,
    CoreUserViewComponent,
    CoreUserResellerChartComponent,
    CoreUserEmailConfirmComponent,
  ],
  imports: [
    CommonModule,
    CoreUserRouting,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    
    SharedModule.forRoot(),
    AngularEditorModule,
    
    CmsFileManagerModule
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    CoreUserService,
    CoreUserGroupService,
    CoreSiteUserService,
    CmsConfirmationDialogService
  ]
})
export class CoreUserModule { }
