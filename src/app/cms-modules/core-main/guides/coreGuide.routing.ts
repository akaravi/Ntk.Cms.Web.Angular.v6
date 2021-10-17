import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { CoreGuideListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreGuideListComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreGuideRouting {
}
