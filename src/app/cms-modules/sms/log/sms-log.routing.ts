import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsLogInBoxListComponent } from './inbox/list/list.component';
import { SmsLogOutBoxDetailListComponent } from './outbox-detail/list/list.component';
import { SmsLogOutBoxListComponent } from './outbox/list/list.component';
import { SmsLogComponent } from './sms-log.component';

const routes: Routes = [
  {
    path: '',
    component: SmsLogComponent,
    children: [
      /**inbox */
      {
        path: 'inbox',
        component: SmsLogInBoxListComponent
      },
      {
        path: 'inbox/list/LinkPrivateConfigId/:LinkPrivateConfigId',
        component: SmsLogInBoxListComponent
      },
      {
        path: 'inbox/list/LinkApiNumberId/:LinkApiNumberId',
        component: SmsLogInBoxListComponent
      },
      {
        path: 'inbox/list/LinkSiteId/:LinkSiteId',
        component: SmsLogInBoxListComponent
      },
      /**outbox */
      {
        path: 'outbox',
        component: SmsLogOutBoxListComponent
      },
      {
        path: 'outbox/list/LinkPrivateConfigId/:LinkPrivateConfigId',
        component: SmsLogOutBoxListComponent
      },
      {
        path: 'outbox/list/LinkApiNumberId/:LinkApiNumberId',
        component: SmsLogOutBoxListComponent
      },
      {
        path: 'outbox/list/LinkSiteId/:LinkSiteId',
        component: SmsLogOutBoxListComponent
      },
      {
        path: 'outbox-detail/LinkOutBoxId/:LinkOutBoxId',
        component: SmsLogOutBoxDetailListComponent
      },
      //   {
      //     path: 'source/edit/:Id',
      //     component: ApplicationSourceEditComponent
      //   },
      //   {
      //     path: 'app',
      //     component: ApplicationAppListComponent
      //   },
      //   {
      //     path: 'app/:SourceId',
      //     component: ApplicationAppListComponent
      //   },
      //   {
      //     path: 'app/add/:SourceId',
      //     component: ApplicationAppAddComponent
      //   },
      //   {
      //     path: 'app/edit/:Id',
      //     component: ApplicationAppEditComponent
      //   },
      //   {
      //     path: 'intro',
      //     component: ApplicationIntroListComponent
      //   },
      //   {
      //     path: 'intro/add/:ApplicationId',
      //     component: ApplicationIntroListComponent
      //   },
      //   {
      //     path: 'intro/edit/:Id',
      //     component: ApplicationIntroListComponent
      //   },
      //   {
      //     path: 'memberinfo',
      //     component: ApplicationMemberInfoListComponent
      //   },
      //   {
      //     path: 'notification',
      //     component: ApplicationNotificationListComponent
      //   },

      //   {
      //     path: 'themeconfig',
      //     component: ApplicationThemeConfigListComponent
      //   },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsLogRoutes {
}
