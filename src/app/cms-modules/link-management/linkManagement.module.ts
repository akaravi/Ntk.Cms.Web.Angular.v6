import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkManagementComponent } from './linkManagement.component';
import { LinkManagementRoutes } from './linkManagement.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import {
  CoreAuthService,
  CoreEnumService,
  ApplicationEnumService,
  CoreModuleTagService,
  LinkManagementConfigurationService
} from 'ntk-cms-api';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { LinkManagementConfigSiteComponent } from './config/site/configSite.component';
import { LinkManagementConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';

@NgModule({
  declarations: [
    LinkManagementComponent,
    /*Config*/
    LinkManagementConfigMainAdminComponent,
    LinkManagementConfigSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    LinkManagementRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule,
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
  ],
  providers: [
    CoreEnumService,
    CoreAuthService,
    /*Config*/
    LinkManagementConfigurationService,
    /*Config*/
    CmsConfirmationDialogService,
    ApplicationEnumService,
    CoreModuleTagService,
  ]
})
export class LinkManagementModule { }
