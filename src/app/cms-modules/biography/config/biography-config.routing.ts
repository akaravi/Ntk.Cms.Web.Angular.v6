import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { BiographyConfigCheckSiteComponent } from './check-site/check-site.component';
import { BiographyConfigCheckUserComponent } from './check-user/check-user.component';
import { BiographyConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { BiographyConfigSiteComponent } from './site/configSite.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: BiographyConfigMainAdminComponent
      },
      {
        path: 'site',
        component: BiographyConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: BiographyConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: BiographyConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: BiographyConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: BiographyConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: BiographyConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiographyConfigRouting {
}
