import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HyperShopConfigCheckSiteComponent } from './check-site/check-site.component';
import { HyperShopConfigCheckUserComponent } from './check-user/check-user.component';
import { HyperShopConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { HyperShopConfigSiteComponent } from './site/config-site.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: HyperShopConfigMainAdminComponent
      },
      {
        path: 'site',
        component: HyperShopConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: HyperShopConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: HyperShopConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: HyperShopConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: HyperShopConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: HyperShopConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HyperShopConfigRouting {
}
