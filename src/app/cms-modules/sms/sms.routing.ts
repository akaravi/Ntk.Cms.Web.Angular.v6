import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmsComponent } from './sms.component';

const routes: Routes = [
  {
    path: '',
    component: SmsComponent,
    children: [
      {
        path: 'main',
        loadChildren: () =>
          import('./main/sms-main.module').then(m => m.SmsMainModule)
      },
      {
        path: 'action',
        loadChildren: () =>
          import('./action/sms-action.module').then(m => m.SmsActionModule)
      },
      {
        path: 'log',
        loadChildren: () =>
          import('./log/sms-log.module').then(m => m.SmsLogModule)
      },
      {
        path: 'config',
        loadChildren: () =>
          import('./config/sms-config.module').then(m => m.SmsConfigModule)
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
