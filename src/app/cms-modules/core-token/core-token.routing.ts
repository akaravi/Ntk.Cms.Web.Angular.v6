import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreTokenActivationListComponent } from './activation/list/list.component';
import { CoreTokenComponent } from './core-token.component';
import { CoreTokenMicroServiceLogListComponent } from './micro-service-log/list/list.component';
import { CoreTokenMicroServiceListComponent } from './micro-service/list/list.component';
import { CoreTokenUserListComponent } from './user/list/list.component';
import { CoreTokenUserBadLoginListComponent } from './userBadLogin/list/list.component';
import { CoreTokenUserLogListComponent } from './userLog/list/list.component';



const routes: Routes = [
  {
    path: '',
    component: CoreTokenComponent,
    children: [
      /** */
      {
        path: 'user',
        component: CoreTokenUserListComponent
      },
      {
        path: 'user/LinkSiteId/:LinkSiteId',
        component: CoreTokenUserListComponent
      },
      {
        path: 'user/LinkUserId/:LinkUserId',
        component: CoreTokenUserListComponent
      },
      {
        path: 'user/LinkDeviceId/:LinkDeviceId',
        component: CoreTokenUserListComponent
      },
      /** */
      {
        path: 'userlog',
        component: CoreTokenUserLogListComponent
      },
      {
        path: 'userlog/LinkSiteId/:LinkSiteId',
        component: CoreTokenUserLogListComponent
      },
      {
        path: 'userlog/LinkUserId/:LinkUserId',
        component: CoreTokenUserLogListComponent
      },
      {
        path: 'userlog/LinkDeviceId/:LinkDeviceId',
        component: CoreTokenUserLogListComponent
      },
      /** */
      {
        path: 'userbadlogin',
        component: CoreTokenUserBadLoginListComponent
      },
      {
        path: 'userbadlogin/LinkSiteId/:LinkSiteId',
        component: CoreTokenUserBadLoginListComponent
      },
      {
        path: 'userbadlogin/LinkUserId/:LinkUserId',
        component: CoreTokenUserBadLoginListComponent
      },
      {
        path: 'userbadlogin/LinkDeviceId/:LinkDeviceId',
        component: CoreTokenUserBadLoginListComponent
      },
      /** */
      {
        path: 'activation',
        component: CoreTokenActivationListComponent
      },
      /** */
      {
        path: 'microservice',
        component: CoreTokenMicroServiceListComponent
      },
      /** */
      {
        path: 'microservicelog',
        component: CoreTokenMicroServiceLogListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreTokenRoutes {
}
