import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogConfigCheckSiteComponent } from './check-site/check-site.component';
import { BlogConfigCheckUserComponent } from './check-user/check-user.component';
import { BlogConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { BlogConfigSiteComponent } from './site/config-site.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: BlogConfigMainAdminComponent
      },
      {
        path: 'site',
        component: BlogConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: BlogConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: BlogConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: BlogConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: BlogConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: BlogConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogConfigRouting {
}
