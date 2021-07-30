import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonateConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { DonateConfigSiteComponent } from './config/site/configSite.component';
import { DonateComponent } from './donate.component';
import { DonateTargetListComponent } from './target/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: DonateComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: DonateConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: DonateConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: DonateConfigSiteComponent
      },
      /*Config*/
      {
        path: 'target',
        component: DonateTargetListComponent
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
