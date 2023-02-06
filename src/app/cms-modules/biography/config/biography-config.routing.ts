import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiographyConfigCheckSiteComponent } from './check-site/check-site.component';
import { BiographyConfigCheckUserComponent } from './check-user/check-user.component';
import { BiographyConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { BiographyConfigSiteComponent } from './site/config-site.component';
const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: BiographyConfigMainAdminComponent
      },
      {
        path: 'site',
        component: BiographyConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: BiographyConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: BiographyConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: BiographyConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: BiographyConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: BiographyConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiographyConfigRouting {
}