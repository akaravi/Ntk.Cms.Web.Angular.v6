import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartConfigCheckSiteComponent } from './check-site/check-site.component';
import { ChartConfigCheckUserComponent } from './check-user/check-user.component';
import { ChartConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ChartConfigSiteComponent } from './site/config-site.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: ChartConfigMainAdminComponent
      },
      {
        path: 'site',
        component: ChartConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: ChartConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: ChartConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: ChartConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: ChartConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: ChartConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartConfigRouting {
}
