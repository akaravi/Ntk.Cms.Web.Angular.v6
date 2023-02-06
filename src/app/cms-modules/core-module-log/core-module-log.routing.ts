import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModuleLogComponent } from './core-module-log.component';
import { CoreModuleLogFavoriteListComponent } from './favorite/list/list.component';
import { CoreModuleLogLikeListComponent } from './like/list/list.component';
import { CoreModuleLogMemoListComponent } from './memo/list/list.component';
import { CoreModuleLogReportAbuseListComponent } from './report-abuse/list/list.component';
import { CoreModuleLogScoreListComponent } from './score/list/list.component';
import { CoreModuleLogSiteCreditBlockedListComponent } from './site-credit-blocked/list/list.component';
import { CoreModuleLogSiteUserCreditBlockedListComponent } from './site-user-credit-blocked/list/list.component';


const routes: Routes = [
  {
    path: '',
    component: CoreModuleLogComponent,
    children: [
      {
        path: 'report-abuse',
        component: CoreModuleLogReportAbuseListComponent
      },
      {
        path: 'memo',
        component: CoreModuleLogMemoListComponent
      },
      {
        path: 'favorite',
        component: CoreModuleLogFavoriteListComponent
      },
      {
        path: 'like',
        component: CoreModuleLogLikeListComponent
      },
      {
        path: 'score',
        component: CoreModuleLogScoreListComponent
      },
      {
        path: 'site-credit-blocked',
        component: CoreModuleLogSiteCreditBlockedListComponent
      },
      {
        path: 'site-user-credit-blocked',
        component: CoreModuleLogSiteUserCreditBlockedListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreModuleRoutes {
}
