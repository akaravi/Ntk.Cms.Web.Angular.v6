import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsComponent } from './sms.component';

const routes: Routes = [
  {
    path: '',
    component: SmsComponent,
    children: [
      {
        path: 'action',
        loadChildren: () =>
          import('./action/smsAction.module').then(m => m.SmsActionModule)
      },
      {
        path: 'log',
        loadChildren: () =>
          import('./log/smsLog.module').then(m => m.SmsLogModule)
      },
      {
        path: 'config',
        loadChildren: () =>
          import('./config/smsConfig.module').then(m => m.SmsConfigModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsRoutes {
}
