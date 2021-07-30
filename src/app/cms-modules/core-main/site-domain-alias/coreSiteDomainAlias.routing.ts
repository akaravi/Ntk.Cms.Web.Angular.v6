import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { CoreSiteDomainAliasListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreSiteDomainAliasListComponent
      },
      {
        path: ':Id',
        component: CoreSiteDomainAliasListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreSiteDomainAliasRouting {
}
