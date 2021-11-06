import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog.component';
import { BlogContentListComponent } from './content/list/list.component';
import { BlogCommentListComponent } from './comment/list/list.component';
import { BlogContentEditComponent } from './content/edit/edit.component';
import { BlogContentAddComponent } from './content/add/add.component';
import { BlogConfigMainAdminComponent } from './config/main-admin/config-main-admin.component';
import { BlogConfigSiteComponent } from './config/site/config-site.component';


const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    children: [
         /* Config */
         {
          path: 'config',
          loadChildren: () =>
            import('./config/blog-config.module').then((m) => m.BlogConfigModule),
        },
        /* Config */
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
