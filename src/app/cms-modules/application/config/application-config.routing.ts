import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationConfigCheckSiteComponent } from './check-site/check-site.component';
import { ApplicationConfigCheckUserComponent } from './check-user/check-user.component';
import { ApplicationConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ApplicationConfigSiteComponent } from './site/config-site.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: ApplicationConfigMainAdminComponent
      },
      {
        path: 'site',
        component: ApplicationConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: ApplicationConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: ApplicationConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: ApplicationConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: ApplicationConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: ApplicationConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationConfigRouting {
}
