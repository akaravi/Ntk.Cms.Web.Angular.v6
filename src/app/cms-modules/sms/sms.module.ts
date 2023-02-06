import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SmsComponent } from './sms.component';
import { SmsRoutes } from './sms.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from 'src/app/shared.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import {
  CoreAuthService,
  CoreEnumService, CoreModuleService, CoreModuleTagService, SmsEnumService, SmsMainApiPathPriceServiceService
} from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { SmsSharedModule } from './sms.shared.module';

@NgModule({
  declarations: [
    SmsComponent,
  ],
  imports: [
    CommonModule,
    SmsRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

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
    /*Config*/
    CmsConfirmationDialogService,
    /*Config*/
    CmsConfirmationDialogService,
    SmsEnumService,
    CoreModuleTagService,
    SmsMainApiPathPriceServiceService,
  ]
})
export class SmsModule { }
