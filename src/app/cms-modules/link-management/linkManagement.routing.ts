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
      /* Config */
      {
        path: 'config',
        loadChildren: () =>
          import('./config/link-management-config.module').then((m) => m.LinkManagementConfigModule),
      },
      /* Config */


    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkManagementRoutes {
}
