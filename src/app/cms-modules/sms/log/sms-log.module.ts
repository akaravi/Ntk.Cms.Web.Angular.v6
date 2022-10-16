import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsLogComponent } from './sms-log.component';
import { SmsLogRoutes } from './sms-log.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import {

  CoreAuthService,
  CoreEnumService,
  ApplicationEnumService,
  CoreModuleTagService,
  CoreModuleService,
  SmsMainApiPathCompanyService,
  SmsMainApiPathPublicConfigService,
  SmsMainApiPathService,
  SmsLogInBoxService,
  SmsLogOutBoxService,
  SmsLogOutBoxDetailService,
  SmsLogOutBoxQueueService
} from 'ntk-cms-api';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';

import { DynamicFormBuilderModule } from 'src/app/core/dynamic-form-builder/dynamic-form-builder.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SmsSharedModule } from '../sms.shared.module';
import { SmsLogInBoxEditComponent } from './inbox/edit/edit.component';
import { SmsLogInBoxListComponent } from './inbox/list/list.component';
import { SmsLogInBoxViewComponent } from './inbox/view/view.component';
import { SmsLogOutBoxListComponent } from './outbox/list/list.component';
import { SmsLogOutBoxEditComponent } from './outbox/edit/edit.component';
import { SmsLogOutBoxHeaderComponent } from './outbox/header/header.component';
import { SmsLogOutBoxViewComponent } from './outbox/view/view.component';
import { SmsLogOutBoxDetailListComponent } from './outbox-detail/list/list.component';
import { SmsLogOutBoxQueueListComponent } from './outbox-queue/list/list.component';
import { SmsLogOutBoxQueueEditComponent } from './outbox-queue/edit/edit.component';
import { SmsLogOutBoxQueueViewComponent } from './outbox-queue/view/view.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SmsLogApiPathListComponent } from './api-path/list.component';


@NgModule({
  declarations: [
    SmsLogComponent,
    SmsLogInBoxListComponent,
    SmsLogInBoxEditComponent,
    SmsLogInBoxViewComponent,
    SmsLogOutBoxListComponent,
    SmsLogOutBoxEditComponent,
    SmsLogOutBoxHeaderComponent,
    SmsLogOutBoxViewComponent,
    SmsLogOutBoxQueueListComponent,
    SmsLogOutBoxQueueEditComponent,
    SmsLogOutBoxQueueViewComponent,
    SmsLogOutBoxDetailListComponent,
    SmsLogApiPathListComponent,
  ],
  imports: [
    CommonModule,
    SmsLogRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    
    SharedModule.forRoot(),
    AngularEditorModule,
    
    
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    DynamicFormBuilderModule,
    NgxMaterialTimepickerModule,
    SmsSharedModule,
    InlineSVGModule,
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    CoreAuthService,
    CmsConfirmationDialogService ,
    ApplicationEnumService,
    CoreModuleTagService,
    SmsLogInBoxService,
    SmsLogOutBoxService,
    SmsLogOutBoxDetailService,
    SmsLogOutBoxQueueService,
    SmsMainApiPathCompanyService,//بررسی شود آیا نیاز است
    SmsMainApiPathPublicConfigService,//بررسی شود آیا نیاز است
    SmsMainApiPathService,//بررسی شود آیا نیاز است
  ]
})
export class SmsLogModule { }
