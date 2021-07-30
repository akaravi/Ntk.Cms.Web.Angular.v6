import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreLogComponent } from './coreLog.component';
import { CoreLogCurrencyListComponent } from './currency/list/list.component';
import { CoreLogErrorListComponent } from './error/list/list.component';
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
        path: 'sms',
        component: CoreLogSmsListComponent
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
