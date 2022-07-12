import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsActionComponent } from './sms-action.component';
import { SmsActionRoutes } from './sms-action.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

import {
  ContactCategoryService,
  ContactContentService,
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
import { SmsActionSendMessageApiComponent } from './send-message-api/send-message-api.component';
import { SmsMainModule } from '../main/sms-main.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialCronJobsModule } from 'ngx-ntk-cron-editor';

@NgModule({
  declarations: [
    SmsActionComponent,
    SmsActionSendMessageComponent,
    SmsActionSendMessageApiComponent,
  ],
  imports: [
    CommonModule,
    SmsMainModule,
    SmsActionRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    
    SharedModule.forRoot(),
    AngularEditorModule,
    
    NgxMaterialTimepickerModule,
    MaterialCronJobsModule,//cron
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
    ContactCategoryService, 
    ContactContentService, 
  ]
})
export class SmsActionModule { }
