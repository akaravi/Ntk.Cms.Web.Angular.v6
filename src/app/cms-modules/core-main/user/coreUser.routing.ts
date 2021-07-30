import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreUserListComponent } from './list/list.component';
import { CoreUserComponent } from './coreUser.component';
import { CoreUserEditComponent } from './edit/edit.component';


const routes: Routes = [
  {
    path: '',
    component: CoreUserComponent,
    children: [
      {
        path: '',
        component: CoreUserListComponent
      },      {
        path: 'siteuser/:LinkSiteId',
        component: CoreUserListComponent
      },
      {
        path: 'edit/:Id',
        component: CoreUserEditComponent
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
