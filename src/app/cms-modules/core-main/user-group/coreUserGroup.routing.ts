import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreUserGroupListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreUserGroupListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreUserGroupRouting {
}
