import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreCpMainMenuListComponent } from './list/list.component';
import { CoreCpMainMenuComponent } from './coreCpMainMenu.component';
import { CoreCpMainMenuEditComponent } from './edit/edit.component';


const routes: Routes = [
  {
    path: '',
    component: CoreCpMainMenuComponent,
    children: [
      {
        path: '',
        component: CoreCpMainMenuListComponent
      },
      {
        path: 'edit/:Id',
        component: CoreCpMainMenuEditComponent
      }

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreCpMainMenuRouting {
}
