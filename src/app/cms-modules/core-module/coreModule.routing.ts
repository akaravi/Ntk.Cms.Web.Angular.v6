import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreModuleComponent } from './coreModule.component';
import { CoreModuleTagListComponent } from './tag/list/list.component';


const routes: Routes = [
  {
    path: '',
    component: CoreModuleComponent,
    children: [
      {
        path: 'tag',
        component: CoreModuleTagListComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreModuleRoutes {
}
