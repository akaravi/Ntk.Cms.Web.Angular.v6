import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { CoreModuleListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreModuleListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreModuleRouting {
}
