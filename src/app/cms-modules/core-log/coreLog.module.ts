import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreLogComponent } from './coreLog.component';
import { CoreLogRoutes } from './coreLog.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';

import {
  CoreLogCurrencyService,
  CoreLogErrorService,
  CoreLogSmsService,
  CoreLogMemberService,
  CoreModuleService,
  CoreLogAvoidDuplicateDataEntryService,
  CoreLogReportDataService,
} from 'ntk-cms-api';
import { CoreLogSmsListComponent } from './sms/list/list.component';
import { CoreLogSmsEditComponent } from './sms/edit/edit.component';
import { CoreLogSmsViewComponent } from './sms/view/view.component';
import { CoreLogMemberListComponent } from './member/list/list.component';
import { CoreLogMemberEditComponent } from './member/edit/edit.component';
import { CoreLogMemberViewComponent } from './member/view/view.component';
import { CoreLogErrorEditComponent } from './error/edit/edit.component';
import { CoreLogErrorListComponent } from './error/list/list.component';
import { CoreLogCurrencyListComponent } from './currency/list/list.component';
import { CoreLogCurrencyViewComponent } from './currency/view/view.component';
import { CoreLogAvoidDuplicateDataEntryListComponent } from './avoid-duplicate/list/list.component';
import { CoreLogAvoidDuplicateDataEntryEditComponent } from './avoid-duplicate/edit/edit.component';
import { CoreLogReportDataListComponent } from './report-data/list/list.component';
import { CoreLogReportDataEditComponent } from './report-data/edit/edit.component';
import { CoreLogReportDataViewComponent } from './report-data/view/view.component';



@NgModule({
  imports: [
    CoreLogRoutes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule.forRoot(),
    AngularEditorModule,

    CmsFileManagerModule
  ],
  declarations: [
    CoreLogComponent,
    /** */
    CoreLogSmsListComponent,
    CoreLogSmsEditComponent,
    CoreLogSmsViewComponent,
    /** */
    CoreLogMemberListComponent,
    CoreLogMemberEditComponent,
    CoreLogMemberViewComponent,
    /** */
    CoreLogErrorListComponent,
    CoreLogErrorEditComponent,
    /** */
    CoreLogAvoidDuplicateDataEntryListComponent,
    CoreLogAvoidDuplicateDataEntryEditComponent,
    /** */
    CoreLogCurrencyListComponent,
    CoreLogCurrencyViewComponent,
    /** */
    CoreLogReportDataListComponent,
    CoreLogReportDataEditComponent,
    CoreLogReportDataViewComponent,
  ],
  exports: [
    CoreLogComponent,
    /** */
    CoreLogSmsListComponent,
    CoreLogSmsEditComponent,
    CoreLogSmsViewComponent,
    /** */
    CoreLogMemberListComponent,
    CoreLogMemberEditComponent,
    CoreLogMemberViewComponent,
    /** */
    CoreLogErrorListComponent,
    CoreLogErrorEditComponent,
    /** */
    CoreLogAvoidDuplicateDataEntryListComponent,
    CoreLogAvoidDuplicateDataEntryEditComponent,
    /** */
    CoreLogCurrencyListComponent,
    CoreLogCurrencyViewComponent,
    /** */
    CoreLogReportDataListComponent,
    CoreLogReportDataEditComponent,
    CoreLogReportDataViewComponent,
  ],
  providers: [
    CoreModuleService,
    CoreLogErrorService,
    CoreLogSmsService,
    CoreLogMemberService,
    CoreLogCurrencyService,
    CoreLogAvoidDuplicateDataEntryService,
    CoreLogReportDataService,
  ]
})
export class CoreLogModule { }
