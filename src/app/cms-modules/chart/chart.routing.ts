import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartComponent } from './chart.component';
import { ChartCommentListComponent } from './comment/list/list.component';
import { ChartContentAddComponent } from './content/add/add.component';
import { ChartContentEditComponent } from './content/edit/edit.component';
import { ChartContentListComponent } from './content/list/list.component';



const routes: Routes = [
  {
    path: '',
    component: ChartComponent,
    children: [
      /* Config */
      {
        path: 'config',
        loadChildren: () =>
          import('./config/chart-config.module').then((m) => m.ChartConfigModule),
      },
      /* Config */
      {
        path: 'content',
        // resolve: {categoryList: CategoryResolver},
        // loadChildren: () =>    import('./content/content.module').then(m => m.ContentModule)
        component: ChartContentListComponent
      },
      {
        path: 'content/add/:CategoryId',
        component: ChartContentAddComponent
      },
      {
        path: 'content/edit/:Id',
        component: ChartContentEditComponent
      },
      {
        path: 'comment',
        component: ChartCommentListComponent
      },
      {
        path: 'comment/:ContentId',
        component: ChartCommentListComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartRouting {
}
