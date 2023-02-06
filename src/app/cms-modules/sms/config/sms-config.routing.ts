import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmsConfigCheckSiteComponent } from './check-site/check-site.component';
import { SmsConfigCheckUserComponent } from './check-user/check-user.component';
import { SmsConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { SmsConfigSiteComponent } from './site/config-site.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: SmsConfigMainAdminComponent
      },
      {
        path: 'site',
        component: SmsConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: SmsConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: SmsConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: SmsConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: SmsConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: SmsConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsConfigRouting {
}
