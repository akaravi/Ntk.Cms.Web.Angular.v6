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
     /* Config */
     {
      path: 'config',
      loadChildren: () =>
        import('./config/hyper-shop-config.module').then((m) => m.HyperShopConfigModule),
    },
    /* Config */
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
