import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { BankPaymentConfigCheckSiteComponent } from './check-site/check-site.component';
import { BankPaymentConfigCheckUserComponent } from './check-user/check-user.component';
import { BankPaymentConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { BankPaymentConfigSiteComponent } from './site/configSite.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: BankPaymentConfigMainAdminComponent
      },
      {
        path: 'site',
        component: BankPaymentConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: BankPaymentConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: BankPaymentConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: BankPaymentConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: BankPaymentConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: BankPaymentConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankPaymentConfigRouting {
}
