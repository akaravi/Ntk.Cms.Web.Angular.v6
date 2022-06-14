import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsActionComponent } from './sms-action.component';
import { SmsActionRoutes } from './sms-action.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { CmsFileManagerModule } from 'src/filemanager-api';
import {
  CoreAuthService,
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  SmsMainApiPathService
} from 'ntk-cms-api';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { SmsActionSendMessageComponent } from './send-message/send-message.component';
import { SmsSharedModule } from '../sms.shared.module';

@NgModule({
  declarations: [
    SmsActionComponent,
    SmsActionSendMessageComponent,
  ],
  imports: [
    CommonModule,
    SmsActionRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    
    SharedModule.forRoot(),
    AngularEditorModule,
    
    
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    SmsSharedModule,
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    CoreAuthService,
    CmsConfirmationDialogService ,
    CoreModuleTagService,
    SmsMainApiPathService,

  ]
})
export class SmsActionModule { }
