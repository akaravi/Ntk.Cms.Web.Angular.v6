import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataProviderConfigCheckSiteComponent } from './check-site/check-site.component';
import { DataProviderConfigCheckUserComponent } from './check-user/check-user.component';
import { DataProviderConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { DataProviderConfigSiteComponent } from './site/config-site.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: DataProviderConfigMainAdminComponent
      },
      {
        path: 'site',
        component: DataProviderConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: DataProviderConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: DataProviderConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: DataProviderConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: DataProviderConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: DataProviderConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataProviderConfigRouting {
}
