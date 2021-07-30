import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartComponent } from './chart.component';
import { ChartContentListComponent } from './content/list/list.component';
import { ChartCommentListComponent } from './comment/list/list.component';
import { ChartContentEditComponent } from './content/edit/edit.component';
import { ChartContentAddComponent } from './content/add/add.component';
import { ChartConfigSiteComponent } from './config/site/configSite.component';
import { ChartConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';



const routes: Routes = [
  {
    path: '',
    component: ChartComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: ChartConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: ChartConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: ChartConfigSiteComponent
      },
      /*Config*/
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
