import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BiographyComponent } from './biography.component';
import { BiographyContentListComponent } from './content/list/list.component';
import { BiographyCommentListComponent } from './comment/list/list.component';
import { BiographyContentEditComponent } from './content/edit/edit.component';
import { BiographyContentAddComponent } from './content/add/add.component';
import { BiographyConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { BiographyConfigSiteComponent } from './config/site/configSite.component';


const routes: Routes = [
  {
    path: '',
    component: BiographyComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: BiographyConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: BiographyConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: BiographyConfigSiteComponent
      },
      /*Config*/
      {
        path: 'content',
        // resolve: {categoryList: CategoryResolver},
        // loadChildren: () =>    import('./content/content.module').then(m => m.ContentModule)
        component: BiographyContentListComponent
      },
      {
        path: 'content/add/:CategoryId',
        component: BiographyContentAddComponent
      },
      {
        path: 'content/edit/:Id',
        component: BiographyContentEditComponent
      },
      {
        path: 'comment',
        component: BiographyCommentListComponent
      },
      {
        path: 'comment/:ContentId',
        component: BiographyCommentListComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiographyRouting {
}
