import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LinkManagementComponent } from './linkManagement.component';
import { LinkManagementTargetAddComponent } from './target/add/add.component';
import { LinkManagementTargetEditComponent } from './target/edit/edit.component';
import { LinkManagementTargetListComponent } from './target/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: LinkManagementComponent,
    children: [
      /* Config */
      {
        path: 'config',
        loadChildren: () =>
          import('./config/link-management-config.module').then((m) => m.LinkManagementConfigModule),
      },
      /* Config */
      {
        path: 'target',
        component: LinkManagementTargetListComponent
      },
      {
        path: 'target/add',
        component: LinkManagementTargetAddComponent
      },
      {
        path: 'target/edit/:Id',
        component: LinkManagementTargetEditComponent
      }

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkManagementRoutes {
}
