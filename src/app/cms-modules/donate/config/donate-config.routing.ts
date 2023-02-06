import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonateConfigCheckSiteComponent } from './check-site/check-site.component';
import { DonateConfigCheckUserComponent } from './check-user/check-user.component';
import { DonateConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { DonateConfigSiteComponent } from './site/config-site.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: DonateConfigMainAdminComponent
      },
      {
        path: 'site',
        component: DonateConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: DonateConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: DonateConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: DonateConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: DonateConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: DonateConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonateConfigRouting {
}
