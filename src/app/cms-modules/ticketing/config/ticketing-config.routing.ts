import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketingConfigCheckSiteComponent } from './check-site/check-site.component';
import { TicketingConfigCheckUserComponent } from './check-user/check-user.component';
import { TicketingConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { TicketingConfigSiteComponent } from './site/config-site.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: TicketingConfigMainAdminComponent
      },
      {
        path: 'site',
        component: TicketingConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: TicketingConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: TicketingConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: TicketingConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: TicketingConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: TicketingConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketingConfigRouting {
}
