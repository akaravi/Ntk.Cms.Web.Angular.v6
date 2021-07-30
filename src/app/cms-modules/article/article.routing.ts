import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleComponent } from './article.component';
// import {CategoryResolver} from './category/tree/category.resolver';
import { ArticleContentListComponent } from './content/list/list.component';
import { ArticleCommentListComponent } from './comment/list/list.component';
import { ArticleCommentEditComponent } from './comment/edit/edit.component';
import { ArticleContentEditComponent } from './content/edit/edit.component';
import { ArticleContentAddComponent } from './content/add/add.component';
import { ArticleConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { ArticleConfigSiteComponent } from './config/site/configSite.component';


const routes: Routes = [
  {
    path: '',
    component: ArticleComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: ArticleConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: ArticleConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: ArticleConfigSiteComponent
      },
      /*Config*/
      {
        path: 'content',
        // resolve: {categoryList: CategoryResolver},
        // loadChildren: () =>    import('./content/content.module').then(m => m.ContentModule)
        component: ArticleContentListComponent
      },
      {
        path: 'content/add/:CategoryId',
        component: ArticleContentAddComponent
      },
      {
        path: 'content/edit/:Id',
        component: ArticleContentEditComponent
      },
      {
        path: 'comment',
        component: ArticleCommentListComponent
      },
      {
        path: 'comment/:ContentId',
        component: ArticleCommentListComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRouting {
}
