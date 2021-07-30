import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog.component';
import { BlogContentListComponent } from './content/list/list.component';
import { BlogCommentListComponent } from './comment/list/list.component';
import { BlogContentEditComponent } from './content/edit/edit.component';
import { BlogContentAddComponent } from './content/add/add.component';
import { BlogConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { BlogConfigSiteComponent } from './config/site/configSite.component';


const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: BlogConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: BlogConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: BlogConfigSiteComponent
      },
      /*Config*/
      {
        path: 'content',
        // resolve: {categoryList: CategoryResolver},
        // loadChildren: () =>    import('./content/content.module').then(m => m.ContentModule)
        component: BlogContentListComponent
      },
      {
        path: 'content/add/:CategoryId',
        component: BlogContentAddComponent
      },
      {
        path: 'content/edit/:Id',
        component: BlogContentEditComponent
      },
      {
        path: 'comment',
        component: BlogCommentListComponent
      },
      {
        path: 'comment/:ContentId',
        component: BlogCommentListComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRouting {
}
