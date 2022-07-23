import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsLogComponent } from './sms-log.component';
import { SmsLogRoutes } from './sms-log.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { CmsFileManagerModule } from 'src/filemanager-api';
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
  SmsLogOutBoxService
} from 'ntk-cms-api';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { SmsMainApiLogInBoxListComponent } from './inbox/list/list.component';
import { SmsMainApiLogInBoxEditComponent } from './inbox/edit/edit.component';
import { DynamicFormBuilderModule } from 'src/app/core/dynamic-form-builder/dynamic-form-builder.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SmsMainApiLogOutBoxListComponent } from './outbox/list/list.component';
import { SmsMainApiLogOutBoxEditComponent } from './outbox/edit/edit.component';
import { SmsSharedModule } from '../sms.shared.module';
import { SmsMainApiLogInBoxViewComponent } from './inbox/view/view.component';
import { SmsMainApiLogOutBoxViewComponent } from './outbox/view/view.component';

@NgModule({
  declarations: [
    SmsLogComponent,
    SmsMainApiLogInBoxListComponent,
    SmsMainApiLogInBoxEditComponent,
    SmsMainApiLogOutBoxListComponent,
    SmsMainApiLogOutBoxEditComponent,
    SmsMainApiLogInBoxViewComponent,
    SmsMainApiLogOutBoxViewComponent
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
    SmsMainApiPathCompanyService,//بررسی شود آیا نیاز است
    SmsMainApiPathPublicConfigService,//بررسی شود آیا نیاز است
    SmsMainApiPathService,//بررسی شود آیا نیاز است
  ]
})
export class SmsLogModule { }
