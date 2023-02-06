import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreUserSupportAccessListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreUserSupportAccessListComponent
      },
      {
        path: 'list/LinkSiteId/:LinkSiteId/LinkUserId/:LinkUserId',
        component: CoreUserSupportAccessListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreUserSupportAccessRouting {
}
