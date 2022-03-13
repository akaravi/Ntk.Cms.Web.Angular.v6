import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonateConfigMainAdminComponent } from './config/main-admin/config-main-admin.component';
import { DonateConfigSiteComponent } from './config/site/config-site.component';
import { DonateComponent } from './donate.component';
import { DonateLogViewListComponent } from './log-view/list/list.component';
import { DonateSponserListComponent } from './sponser/list/list.component';
import { DonateTargetPeriodSponserListComponent } from './target-period-sponsor/list/list.component';
// import { DonateTargetPeriodSponsorListComponent } from './target-period-sponsor/list/list.component';
import { DonateTargetPeriodListComponent } from './target-period/list/list.component';
import { DonateTargetAddComponent } from './target/add/add.component';
import { DonateTargetDeleteComponent } from './target/delete/delete.component';
import { DonateTargetEditComponent } from './target/edit/edit.component';
import { DonateTargetListComponent } from './target/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: DonateComponent,
    children: [
      /* Config */
      {
        path: 'config',
        loadChildren: () =>
          import('./config/donate-config.module').then((m) => m.DonateConfigModule),
      },
      /* Config */
      {
        path: 'target',
        component: DonateTargetListComponent
      },
      {
        path: 'target/add/:CategoryId',
        component: DonateTargetAddComponent
      },
      {
        path: 'target/edit/:Id',
        component: DonateTargetEditComponent
      },
      {
        path: 'target/Delete/:Id',
        component: DonateTargetDeleteComponent
      },
      {
        path: 'log-view',
        component: DonateLogViewListComponent
      },
      {
        path: 'sponser',
        component: DonateSponserListComponent
      },
      {
        path: 'target-period',
        component: DonateTargetPeriodListComponent
      },
      {
        path: 'target-period-sponser',
        component: DonateTargetPeriodSponserListComponent
      },
      
      // {
      //   path: 'property/LinkPropertyTypeLanduseId/:LinkPropertyTypeLanduseId',
      //   component: DonatePropertyListComponent
      // },
      // /**/
      // {
      //   path: 'property-type',
      //   component: DonatePropertyTypeListComponent
      // },
      // /**/
      // {
      //   path: 'account-agency',
      //   component: DonateAccountAgencyListComponent
      // },
      // /**/    {
      //   path: 'account-user',
      //   component: DonateAccountUserListComponent
      // },
      // /**/
      // {
      //   path: 'contract-type',
      //   component: DonateContractTypeListComponent
      // },
      // /**/
      // {
      //   path: 'property-detail-group',
      //   component: DonatePropertyDetailGroupListComponent
      // },
      // /**/
      // {
      //   path: 'property-detail',
      //   component: DonatePropertyDetailListComponent
      // },
      // {
      //   path: 'property-detail/LinkPropertyTypeLanduseId/:LinkPropertyTypeLanduseId',
      //   component: DonatePropertyDetailListComponent
      // },
      // /** */

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonateRoutes {
}
