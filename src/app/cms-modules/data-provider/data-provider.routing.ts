import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataProviderComponent } from './data-provider.component';
import { DataProviderLogClientListComponent } from './log-client/list/list.component';
import { DataProviderLogPlanListComponent } from './log-plan/list/list.component';
import { DataProviderLogSourceListComponent } from './log-source/list/list.component';
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
        path: 'transaction',
        component: DataProviderTransactionListComponent
      }
      ,
      {
        path: 'transaction/LinkCmsUserId/:LinkCmsUserId',
        component: DataProviderTransactionListComponent
      }
      , {
        path: 'transaction/LinkSponsorId/:LinkSponsorId',
        component: DataProviderTransactionListComponent
      }
      ,
      {
        path: 'transaction/LinkTargetPeriodId/:LinkTargetPeriodId',
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
