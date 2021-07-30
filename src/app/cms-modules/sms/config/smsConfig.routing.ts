import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsConfigComponent } from './smsConfig.component';

const routes: Routes = [
  {
    path: '',
    component: SmsConfigComponent,
    // children: [
    //   {
    //     path: 'source',
    //     component: ApplicationSourceListComponent
    //   },
    //   {
    //     path: 'source/add',
    //     component: ApplicationSourceAddComponent
    //   },
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
    // ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsConfigRoutes {
}
