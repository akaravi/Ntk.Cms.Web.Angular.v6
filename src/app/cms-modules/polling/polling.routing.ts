import { PollingContentListComponent } from './content/list/list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PollingComponent } from './polling.component';
import { PollingContentAddComponent } from './content/add/add.component';
import { PollingContentEditComponent } from './content/edit/edit.component';
import { PollingVoteListComponent } from './vote/list/list.component';
import { PollingConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { PollingConfigSiteComponent } from './config/site/configSite.component';



const routes: Routes = [
  {
    path: '',
    component: PollingComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: PollingConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: PollingConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: PollingConfigSiteComponent
      },
      /*Config*/
      {
        path: 'content',
        // resolve: {categoryList: CategoryResolver},
        // loadChildren: () =>    import('./content/content.module').then(m => m.ContentModule)
        component: PollingContentListComponent
      },
      {
        path: 'content/add/:CategoryId',
        component: PollingContentAddComponent
      },
      {
        path: 'content/edit/:Id',
        component: PollingContentEditComponent
      },
      {
        path: 'vote',
        component: PollingVoteListComponent
      },
      {
        path: 'vote/:ContentId',
        component: PollingVoteListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PollingRouting {
}
