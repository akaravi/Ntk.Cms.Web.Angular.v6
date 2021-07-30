import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreTokenComponent } from './coreToken.component';
import { CoreTokenRoutes } from './coreToken.routing';
import { CoreTokenUserListComponent } from './user/list/list.component';
import { CoreTokenUserEditComponent } from './user/edit/edit.component';
import {
  CoreEnumService,
  CoreTokenActivationService,
  CoreTokenMicroServiceLogService,
  CoreTokenMicroServiceService,
  CoreTokenUserBadLoginService,
  CoreTokenUserLogService,
  CoreTokenUserService,
  CoreUserService
} from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreTokenUserLogListComponent } from './userLog/list/list.component';
import { CoreTokenUserLogEditComponent } from './userLog/edit/edit.component';
import { CoreTokenUserBadLoginListComponent } from './userBadLogin/list/list.component';
import { CoreTokenUserBadLoginEditComponent } from './userBadLogin/edit/edit.component';
import { CoreTokenUserViewComponent } from './user/view/view.component';
import { CoreTokenUserBadLoginViewComponent } from './userBadLogin/view/view.component';
import { CoreTokenUserLogViewComponent } from './userLog/view/view.component';
import { CoreTokenActivationListComponent } from './activation/list/list.component';
import { CoreTokenActivationEditComponent } from './activation/edit/edit.component';
import { CoreTokenActivationViewComponent } from './activation/view/view.component';
import { CoreTokenMicroServiceListComponent } from './micro-service/list/list.component';
import { CoreTokenMicroServiceEditComponent } from './micro-service/edit/edit.component';
import { CoreTokenMicroServiceViewComponent } from './micro-service/view/view.component';
import { CoreTokenMicroServiceLogListComponent } from './micro-service-log/list/list.component';
import { CoreTokenMicroServiceLogEditComponent } from './micro-service-log/edit/edit.component';
import { CoreTokenMicroServiceLogViewComponent } from './micro-service-log/view/view.component';

@NgModule({
  imports: [
    CoreTokenRoutes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
  ],
  declarations: [
    CoreTokenComponent,
    /** */
    CoreTokenUserListComponent,
    CoreTokenUserEditComponent,
    CoreTokenUserViewComponent,
    /** */
    CoreTokenUserLogListComponent,
    CoreTokenUserLogEditComponent,
    CoreTokenUserLogViewComponent,
    /** */
    CoreTokenUserBadLoginListComponent,
    CoreTokenUserBadLoginEditComponent,
    CoreTokenUserBadLoginViewComponent,
    /** */
    /** */
    CoreTokenActivationListComponent,
    CoreTokenActivationEditComponent,
    CoreTokenActivationViewComponent,
    /** */
    /** */
    CoreTokenMicroServiceListComponent,
    CoreTokenMicroServiceEditComponent,
    CoreTokenMicroServiceViewComponent,
    /** */
    /** */
    CoreTokenMicroServiceLogListComponent,
    CoreTokenMicroServiceLogEditComponent,
    CoreTokenMicroServiceLogViewComponent,
    /** */



  ],
  providers: [
    CoreEnumService,
    CoreTokenUserService,
    CoreTokenUserLogService,
    CoreTokenUserBadLoginService,
    CoreTokenActivationService,
    CoreTokenMicroServiceService,
    CoreTokenMicroServiceLogService,
    CoreUserService,
    CmsConfirmationDialogService
  ]
})
export class CoreTokenModule { }
