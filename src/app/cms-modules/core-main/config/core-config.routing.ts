import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { CoreConfigCheckSiteComponent } from './check-site/check-site.component';
import { CoreConfigCheckUserComponent } from './check-user/check-user.component';
import { CoreConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { CoreConfigSiteComponent } from './site/configSite.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: CoreConfigMainAdminComponent
      },
      {
        path: 'site',
        component: CoreConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: CoreConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: CoreConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: CoreConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: CoreConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: CoreConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreConfigRouting {
}
