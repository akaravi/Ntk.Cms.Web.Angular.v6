import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankPaymentComponent } from './bank-payment.component';
import { BankPaymentConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { BankPaymentConfigSiteComponent } from './config/site/configSite.component';
import { BankPaymentPrivateSiteConfigListComponent } from './private-site-config/list/list.component';
import { BankPaymentPublicConfigListComponent } from './public-config/list/list.component';
import { BankPaymentTransactionLogListComponent } from './transaction-log/list/list.component';
import { BankPaymentTransactionListComponent } from './transaction/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: BankPaymentComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: BankPaymentConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: BankPaymentConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: BankPaymentConfigSiteComponent
      },
      /*Config*/
      {
        path: 'publicconfig',
        component: BankPaymentPublicConfigListComponent
      },
      {
        path: 'privatesiteconfig',
        component: BankPaymentPrivateSiteConfigListComponent
      },
      {
        path: 'privatesiteconfig/LinkPublicConfigId/:LinkPublicConfigId',
        component: BankPaymentPrivateSiteConfigListComponent
      },
      {
        path: 'privatesiteconfig/LinkSiteId/:LinkSiteId',
        component: BankPaymentPrivateSiteConfigListComponent
      },
      {
        path: 'transaction',
        component: BankPaymentTransactionListComponent
      },
      {
        path: 'transaction/LinkPrivateSiteConfigId/:LinkPrivateSiteConfigId',
        component: BankPaymentTransactionListComponent
      },
      {
        path: 'transaction/LinkUserId/:LinkUserId',
        component: BankPaymentTransactionListComponent
      },
      {
        path: 'transactionlog',
        component: BankPaymentTransactionLogListComponent
      },
      {
        path: 'transactionlog/LinkTransactionId/:LinkTransactionId',
        component: BankPaymentTransactionLogListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankPaymentRoutes {
}
