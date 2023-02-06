import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreUserComponent } from './coreUser.component';
import { CoreUserEditComponent } from './edit/edit.component';
import { CoreUserListComponent } from './list/list.component';
import { CoreUserResellerChartComponent } from './reseller-chart/reseller-chart.component';


const routes: Routes = [
  {
    path: '',
    component: CoreUserComponent,
    children: [
      {
        path: '',
        component: CoreUserListComponent
      }, {
        path: 'siteuser/:LinkSiteId',
        component: CoreUserListComponent
      },
      {
        path: 'edit/:Id',
        component: CoreUserEditComponent
      },
      {
        path: 'reseller-chart',
        component: CoreUserResellerChartComponent

      },
      {
        path: 'reseller-chart/LinkUserId/:LinkUserId',
        component: CoreUserResellerChartComponent

      }

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreUserRouting {
}
