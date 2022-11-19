import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { CoreModuleEntityListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreModuleEntityListComponent
      },
      {
        path: 'LinkModuleId/:LinkModuleId',
        component: CoreModuleEntityListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreModuleEntityRouting {
}
