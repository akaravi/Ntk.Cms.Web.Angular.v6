import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HyperShopContentModel } from 'ntk-cms-api';
import { HyperShopCategoryListComponent } from './category/list/list.component';
import { HyperShopConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { HyperShopConfigSiteComponent } from './config/site/configSite.component';
import { HyperShopContentListComponent } from './content/list/list.component';
import { HyperShopComponent } from './hyperShop.component';

const routes: Routes = [
  {
    path: '',
    component: HyperShopComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: HyperShopConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: HyperShopConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: HyperShopConfigSiteComponent
      },
      /*Config*/
      {
        path: 'category',
        component: HyperShopCategoryListComponent
      },
      /**/
      {
        path: 'content',
        component: HyperShopContentListComponent
      },
      {
        path: 'content/PareintId/:PareintId',
        component: HyperShopContentListComponent
      },
      /**/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HyperShopRoutes {
}
