import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PollingConfigCheckSiteComponent } from './check-site/check-site.component';
import { PollingConfigCheckUserComponent } from './check-user/check-user.component';
import { PollingConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { PollingConfigSiteComponent } from './site/config-site.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: PollingConfigMainAdminComponent
      },
      {
        path: 'site',
        component: PollingConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: PollingConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: PollingConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: PollingConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: PollingConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: PollingConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PollingConfigRouting {
}
