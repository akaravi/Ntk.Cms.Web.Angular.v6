import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebDesignerBuilderComponent } from './web-designer-builder.component';

const routes: Routes = [
  {
    path: '',
    component: WebDesignerBuilderComponent,
    children: [

      /** */

      /** */
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebDesignerBuilderRoutes {
}
