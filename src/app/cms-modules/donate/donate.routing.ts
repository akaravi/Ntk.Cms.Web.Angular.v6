import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonateComponent } from './donate.component';
import { DonateLogViewListComponent } from './log-view/list/list.component';
import { DonateSponserListComponent } from './sponser/list/list.component';
import { DonateTargetPeriodSponserListComponent } from './target-period-sponsor/list/list.component';
import { DonateTargetPeriodChargeComponent } from './target-period/charge/charge.component';
// import { DonateTargetPeriodSponsorListComponent } from './target-period-sponsor/list/list.component';
import { DonateTargetPeriodListComponent } from './target-period/list/list.component';
import { DonateTargetAddComponent } from './target/add/add.component';
import { DonateTargetDeleteComponent } from './target/delete/delete.component';
import { DonateTargetEditComponent } from './target/edit/edit.component';
import { DonateTargetListComponent } from './target/list/list.component';
import { DonateTransactionListComponent } from './transaction/list/list.component';

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
        path: 'log-view/:Id',
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
        path: 'target-period/LinkTargeId/:LinkTargeId',
        component: DonateTargetPeriodListComponent
      },
      {
        path: 'target-period-charge/:LinkTargetPeriodId',
        component: DonateTargetPeriodChargeComponent
      },
      {
        path: 'target-period-sponser',
        component: DonateTargetPeriodSponserListComponent
      },
      {
        path: 'target-period-sponser/LinkTargetPeriodId/:LinkTargetPeriodId',
        component: DonateTargetPeriodSponserListComponent
      },
      {
        path: 'target-period-sponser/LinkSponserId/:LinkSponserId',
        component: DonateTargetPeriodSponserListComponent
      },
      /** */
      {
        path: 'transaction',
        component: DonateTransactionListComponent
      }
      ,
      {
        path: 'transaction/LinkCmsUserId/:LinkCmsUserId',
        component: DonateTransactionListComponent
      }
      , {
        path: 'transaction/LinkSponsorId/:LinkSponsorId',
        component: DonateTransactionListComponent
      }
      ,
      {
        path: 'transaction/LinkTargetPeriodId/:LinkTargetPeriodId',
        component: DonateTransactionListComponent
      }
      /** */
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonateRoutes {
}
