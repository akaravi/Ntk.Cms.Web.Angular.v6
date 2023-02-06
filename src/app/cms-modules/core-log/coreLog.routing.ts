import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreLogAvoidDuplicateDataEntryListComponent } from './avoid-duplicate/list/list.component';
import { CoreLogComponent } from './coreLog.component';
import { CoreLogCurrencyListComponent } from './currency/list/list.component';
import { CoreLogErrorListComponent } from './error/list/list.component';
import { CoreLogMemberListComponent } from './member/list/list.component';
import { CoreLogReportDataListComponent } from './report-data/list/list.component';
import { CoreLogSmsListComponent } from './sms/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: CoreLogComponent,
    children: [
      {
        path: 'error',
        component: CoreLogErrorListComponent
      },
      {
        path: 'avoid-duplicate',
        component: CoreLogAvoidDuplicateDataEntryListComponent
      },
      {
        path: 'avoid-duplicate/:LinkUserId',
        component: CoreLogAvoidDuplicateDataEntryListComponent
      },
      {
        path: 'sms',
        component: CoreLogSmsListComponent
      },
      {
        path: 'report-data',
        component: CoreLogReportDataListComponent
      },
      {
        path: 'report-data/LinkSiteId/:LinkSiteId',
        component: CoreLogReportDataListComponent
      },
      {
        path: 'report-data/LinkUserId/:LinkUserId',
        component: CoreLogReportDataListComponent
      },
      {
        path: 'report-data/LinkModuleEntityId/:LinkModuleEntityId',
        component: CoreLogReportDataListComponent
      },
      {
        path: 'report-data/LinkModuleEntityReportFileId/:LinkModuleEntityReportFileId',
        component: CoreLogReportDataListComponent
      },
      {
        path: 'member',
        component: CoreLogMemberListComponent
      },
      {
        path: 'currency',
        component: CoreLogCurrencyListComponent
      },
      {
        path: 'currency/:LinkCurrencyId',
        component: CoreLogCurrencyListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreLogRoutes {
}
