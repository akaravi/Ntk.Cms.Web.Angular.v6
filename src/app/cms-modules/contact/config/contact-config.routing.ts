import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactConfigCheckSiteComponent } from './check-site/check-site.component';
import { ContactConfigCheckUserComponent } from './check-user/check-user.component';
import { ContactConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ContactConfigSiteComponent } from './site/config-site.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*Config*/
      {
        path: 'mainadmin',
        component: ContactConfigMainAdminComponent
      },
      {
        path: 'site',
        component: ContactConfigSiteComponent
      },
      {
        path: 'site/:LinkSiteId',
        component: ContactConfigSiteComponent
      },
      {
        path: 'checkuser',
        component: ContactConfigCheckUserComponent
      },
      {
        path: 'checkuser/:LinkUserId',
        component: ContactConfigCheckUserComponent
      },
      {
        path: 'checksite',
        component: ContactConfigCheckSiteComponent
      },
      {
        path: 'checksite/:LinkSiteId',
        component: ContactConfigCheckSiteComponent
      },
      /*Config*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactConfigRouting {
}
