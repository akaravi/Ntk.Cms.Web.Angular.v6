import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreDeviceListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreDeviceListComponent
      },
      {
        path: ':LinkSiteId',
        component: CoreDeviceListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreDeviceRouting {
}
