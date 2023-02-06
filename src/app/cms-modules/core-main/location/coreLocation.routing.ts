import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreLocationListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreLocationListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreLocationRouting {
}
