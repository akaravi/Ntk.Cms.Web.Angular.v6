import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiTelegramConfigCheckSiteComponent } from './check-site/check-site.component';
import { ApiTelegramConfigCheckUserComponent } from './check-user/check-user.component';
import { ApiTelegramConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ApiTelegramConfigSiteComponent } from './site/config-site.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: ApiTelegramConfigMainAdminComponent
      },
      {
        path: 'site',
        component: ApiTelegramConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: ApiTelegramConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: ApiTelegramConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: ApiTelegramConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: ApiTelegramConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: ApiTelegramConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiTelegramConfigRouting {
}
