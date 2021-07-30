import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreLogComponent } from './coreLog.component';
import { CoreLogRoutes } from './coreLog.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { TagInputModule } from 'ngx-chips';
import {
  CoreLogCurrencyService,
  CoreLogErrorService,
  CoreLogSmsService,
} from 'ntk-cms-api';
import { CoreLogSmsListComponent } from './sms/list/list.component';
import { CoreLogErrorEditComponent } from './error/edit/edit.component';
import { CoreLogErrorListComponent } from './error/list/list.component';
import { CoreLogSmsEditComponent } from './sms/edit/edit.component';
import { CoreLogSmsViewComponent } from './sms/view/view.component';
import { CoreLogCurrencyListComponent } from './currency/list/list.component';
import { CoreLogCurrencyViewComponent } from './currency/view/view.component';



@NgModule({
  imports: [
    CoreLogRoutes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule
  ],
  declarations: [
    CoreLogComponent,
    /** */
    CoreLogSmsListComponent,
    CoreLogSmsEditComponent,
    CoreLogSmsViewComponent,
    /** */
    CoreLogErrorListComponent,
    CoreLogErrorEditComponent,
    /** */
    CoreLogCurrencyListComponent,
    CoreLogCurrencyViewComponent,
  ],
  exports: [
    CoreLogComponent,
    /** */
    CoreLogSmsListComponent,
    CoreLogSmsEditComponent,
    CoreLogSmsViewComponent,
    /** */
    CoreLogErrorListComponent,
    CoreLogErrorEditComponent,
    /** */
    CoreLogCurrencyListComponent,
    CoreLogCurrencyViewComponent,
  ],
  providers: [
    CoreLogErrorService,
    CoreLogSmsService,
    CoreLogCurrencyService,
  ]
})
export class CoreLogModule { }
