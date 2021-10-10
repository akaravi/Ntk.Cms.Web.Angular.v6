import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { EstateConfigCheckSiteComponent } from './check-site/check-site.component';
import { EstateConfigCheckUserComponent } from './check-user/check-user.component';
import { EstateConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { EstateConfigSiteComponent } from './site/configSite.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: EstateConfigMainAdminComponent
      },
      {
        path: 'site',
        component: EstateConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: EstateConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: EstateConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: EstateConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: EstateConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: EstateConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstateConfigRouting {
}
