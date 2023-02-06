import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkManagementConfigCheckSiteComponent } from './check-site/check-site.component';
import { LinkManagementConfigCheckUserComponent } from './check-user/check-user.component';
import { LinkManagementConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { LinkManagementConfigSiteComponent } from './site/config-site.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: LinkManagementConfigMainAdminComponent
      },
      {
        path: 'site',
        component: LinkManagementConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: LinkManagementConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: LinkManagementConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: LinkManagementConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: LinkManagementConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: LinkManagementConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkManagementConfigRouting {
}
