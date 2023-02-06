import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsConfigCheckSiteComponent } from './check-site/check-site.component';
import { NewsConfigCheckUserComponent } from './check-user/check-user.component';
import { NewsConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { NewsConfigSiteComponent } from './site/config-site.component';
const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: NewsConfigMainAdminComponent
      },
      {
        path: 'site',
        component: NewsConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: NewsConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: NewsConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: NewsConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: NewsConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: NewsConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsConfigRouting {
}