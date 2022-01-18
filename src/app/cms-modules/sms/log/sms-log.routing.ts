import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsMainApiLogInBoxListComponent } from './inbox/list/list.component';
import { SmsMainApiLogOutBoxListComponent } from './outbox/list/list.component';
import { SmsLogComponent } from './sms-log.component';

const routes: Routes = [
  {
    path: '',
    component: SmsLogComponent,
     children: [
      {
        path: 'inbox',
        component: SmsMainApiLogInBoxListComponent
      },
      {
        path: 'outbox',
        component: SmsMainApiLogOutBoxListComponent
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
