import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkManagementComponent } from './linkManagement.component';
import { LinkManagementRoutes } from './linkManagement.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CmsFileManagerModule } from 'src/filemanager-api';
import {
  CoreAuthService,
  CoreEnumService,
  ApplicationEnumService,
  CoreModuleTagService,
  LinkManagementConfigurationService,
  CoreModuleService
} from 'ntk-cms-api';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { LinkManagementConfigSiteComponent } from './config/site/config-site.component';
import { LinkManagementConfigMainAdminComponent } from './config/main-admin/config-main-admin.component';

@NgModule({
  declarations: [
    LinkManagementComponent,

  ],
  imports: [
    CommonModule,
    LinkManagementRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
  ],
  providers: [
    CoreModuleService,
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
