import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreCpMainMenuComponent } from './coreCpMainMenu.component';
import { CoreCpMainMenuEditComponent } from './edit/edit.component';
import { CoreCpMainMenuListComponent } from './list/list.component';


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
