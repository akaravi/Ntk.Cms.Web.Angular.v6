import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleConfigCheckSiteComponent } from './check-site/check-site.component';
import { ArticleConfigCheckUserComponent } from './check-user/check-user.component';
import { ArticleConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ArticleConfigSiteComponent } from './site/config-site.component';
const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: ArticleConfigMainAdminComponent
      },
      {
        path: 'site',
        component: ArticleConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: ArticleConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: ArticleConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: ArticleConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: ArticleConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: ArticleConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleConfigRouting {
}