import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreCurrencyListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreCurrencyListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreCurrencyRouting {
}
