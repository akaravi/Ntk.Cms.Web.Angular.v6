import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { WebDesignerConfigCheckSiteComponent } from './check-site/check-site.component';
import { WebDesignerConfigCheckUserComponent } from './check-user/check-user.component';
import { WebDesignerConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { WebDesignerConfigSiteComponent } from './site/configSite.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: WebDesignerConfigMainAdminComponent
      },
      {
        path: 'site',
        component: WebDesignerConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: WebDesignerConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: WebDesignerConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: WebDesignerConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: WebDesignerConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: WebDesignerConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebDesignerConfigRouting {
}
