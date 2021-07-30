import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LinkManagementConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { LinkManagementConfigSiteComponent } from './config/site/configSite.component';
import { LinkManagementComponent } from './linkManagement.component';

const routes: Routes = [
  {
    path: '',
    component: LinkManagementComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: LinkManagementConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: LinkManagementConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: LinkManagementConfigSiteComponent
      },
      /*Config*/

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkManagementRoutes {
}
