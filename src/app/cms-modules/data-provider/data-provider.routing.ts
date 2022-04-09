import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataProviderComponent } from './data-provider.component';
import { DataProviderLogViewListComponent } from './log-view/list/list.component';
import { DataProviderSponserListComponent } from './sponser/list/list.component';
import { DataProviderTargetPeriodSponserListComponent } from './target-period-sponsor/list/list.component';
// import { DataProviderTargetPeriodSponsorListComponent } from './target-period-sponsor/list/list.component';
import { DataProviderTargetPeriodListComponent } from './target-period/list/list.component';
import { DataProviderTargetAddComponent } from './target/add/add.component';
import { DataProviderTargetDeleteComponent } from './target/delete/delete.component';
import { DataProviderTargetEditComponent } from './target/edit/edit.component';
import { DataProviderTargetListComponent } from './target/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: DataProviderComponent,
    children: [
      /* Config */
      {
        path: 'config',
        loadChildren: () =>
          import('./config/data-provider-config.module').then((m) => m.DataProviderConfigModule),
      },
      /* Config */
      {
        path: 'target',
        component: DataProviderTargetListComponent
      },
      {
        path: 'target/add/:CategoryId',
        component: DataProviderTargetAddComponent
      },
      {
        path: 'target/edit/:Id',
        component: DataProviderTargetEditComponent
      },
      {
        path: 'target/Delete/:Id',
        component: DataProviderTargetDeleteComponent
      },
      {
        path: 'log-view',
        component: DataProviderLogViewListComponent
      },
      {
        path: 'log-view/:Id',
        component: DataProviderLogViewListComponent
      },
      {
        path: 'sponser',
        component: DataProviderSponserListComponent
      },
      {
        path: 'target-period',
        component: DataProviderTargetPeriodListComponent
      },
      {
        path: 'target-period-sponser',
        component: DataProviderTargetPeriodSponserListComponent
      },
      
      // {
      //   path: 'property/LinkPropertyTypeLanduseId/:LinkPropertyTypeLanduseId',
      //   component: DataProviderPropertyListComponent
      // },
      // /**/
      // {
      //   path: 'property-type',
      //   component: DataProviderPropertyTypeListComponent
      // },
      // /**/
      // {
      //   path: 'account-agency',
      //   component: DataProviderAccountAgencyListComponent
      // },
      // /**/    {
      //   path: 'account-user',
      //   component: DataProviderAccountUserListComponent
      // },
      // /**/
      // {
      //   path: 'contract-type',
      //   component: DataProviderContractTypeListComponent
      // },
      // /**/
      // {
      //   path: 'property-detail-group',
      //   component: DataProviderPropertyDetailGroupListComponent
      // },
      // /**/
      // {
      //   path: 'property-detail',
      //   component: DataProviderPropertyDetailListComponent
      // },
      // {
      //   path: 'property-detail/LinkPropertyTypeLanduseId/:LinkPropertyTypeLanduseId',
      //   component: DataProviderPropertyDetailListComponent
      // },
      // /** */

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataProviderRoutes {
}
