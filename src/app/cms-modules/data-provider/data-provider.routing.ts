import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataProviderClientChargeComponent } from './client/charge/charge.component';
import { DataProviderClientListComponent } from './client/list/list.component';
import { DataProviderComponent } from './data-provider.component';
import { DataProviderLogClientListComponent } from './log-client/list/list.component';
import { DataProviderLogPlanListComponent } from './log-plan/list/list.component';
import { DataProviderLogSourceListComponent } from './log-source/list/list.component';
import { DataProviderPlanClientListComponent } from './plan-client/list/list.component';
import { DataProviderPlanPriceListComponent } from './plan-price/list/list.component';
import { DataProviderPlanSourceListComponent } from './plan-source/list/list.component';
import { DataProviderPlanListComponent } from './plan/list/list.component';
import { DataProviderSourceListComponent } from './source/list/list.component';
import { DataProviderTransactionListComponent } from './transaction/list/list.component';


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
        path: 'log-client',
        component: DataProviderLogClientListComponent
      },
      {
        path: 'log-client/LinkClientId/:LinkClientId',
        component: DataProviderLogClientListComponent
      },
      {
        path: 'log-client/LinkPlanId/:LinkPlanId',
        component: DataProviderLogClientListComponent
      },
      /** */
      {
        path: 'log-plan',
        component: DataProviderLogPlanListComponent
      },
      {
        path: 'log-plan/LinkSourceId/:LinkSourceId',
        component: DataProviderLogPlanListComponent
      },
      {
        path: 'log-plan/LinkPlanId/:LinkPlanId',
        component: DataProviderLogPlanListComponent
      },
      /** */
      {
        path: 'log-source',
        component: DataProviderLogSourceListComponent
      },
      {
        path: 'log-source/LinkSourceId/:LinkSourceId',
        component: DataProviderLogSourceListComponent
      },
      /** */
      {
        path: 'client',
        component: DataProviderClientListComponent
      },
      {
        path: 'client-charge/:LinkClientId',
        component: DataProviderClientChargeComponent
      },
      {
        path: 'source',
        component: DataProviderSourceListComponent
      },
      {
        path: 'plan-client',
        component: DataProviderPlanClientListComponent
      },
      {
        path: 'plan-client/LinkPlanId/:LinkPlanId',
        component: DataProviderPlanClientListComponent
      },
      {
        path: 'plan-client/LinkClientId/:LinkClientId',
        component: DataProviderPlanClientListComponent
      },
      {
        path: 'plan',
        component: DataProviderPlanListComponent
      },
      {
        path: 'plan/LinkPlanCategory/:LinkPlanCategory',
        component: DataProviderPlanListComponent
      },
      {
        path: 'plan-source',
        component: DataProviderPlanSourceListComponent
      },
      {
        path: 'plan-source/LinkPlanId/:LinkPlanId',
        component: DataProviderPlanSourceListComponent
      },
      {
        path: 'plan-source/LinkSourceId/:LinkSourceId',
        component: DataProviderPlanSourceListComponent
      },
      {
        path: 'plan-price',
        component: DataProviderPlanPriceListComponent
      },
      {
        path: 'plan-price/LinkPlanId/:LinkPlanId',
        component: DataProviderPlanPriceListComponent
      },
      {
        path: 'transaction',
        component: DataProviderTransactionListComponent
      }
      , {
        path: 'transaction/LinkPlanId/:LinkPlanId',
        component: DataProviderTransactionListComponent
      }
      ,
      {
        path: 'transaction/LinkCmsUserId/:LinkCmsUserId',
        component: DataProviderTransactionListComponent
      },
      {
        path: 'transaction/LinkClientId/:LinkClientId',
        component: DataProviderTransactionListComponent
      },
      {
        path: 'transaction/LinkSponsorId/:LinkSponsorId',
        component: DataProviderTransactionListComponent
      }
      ,
      {
        path: 'transaction/LinkPlanPriceId/:LinkPlanPriceId',
        component: DataProviderTransactionListComponent
      }
      /** */


    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataProviderRoutes {
}
