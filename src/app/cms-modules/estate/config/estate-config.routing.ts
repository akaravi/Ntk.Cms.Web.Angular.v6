import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstateConfigCheckSiteComponent } from './check-site/check-site.component';
import { EstateConfigCheckUserComponent } from './check-user/check-user.component';
import { EstateConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { EstateConfigSiteComponent } from './site/config-site.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: EstateConfigMainAdminComponent
      },
      {
        path: 'site',
        component: EstateConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: EstateConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: EstateConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: EstateConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: EstateConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: EstateConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstateConfigRouting {
}
