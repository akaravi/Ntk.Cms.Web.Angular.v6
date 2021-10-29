import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsMainApiPathCompanyListComponent } from './api-path-company/list/list.component';
import { SmsMainApiPathListComponent } from './api-path/list/list.component';
import { SmsMainComponent } from './sms-main.component';


const routes: Routes = [
  {
    path: '',
    component: SmsMainComponent,
    children: [
      {
        path: 'api-path-company',
        component: SmsMainApiPathCompanyListComponent
      },
      {
        path: 'api-path',
        component: SmsMainApiPathListComponent
      },
      {
        path: 'api-path/list',
        component: SmsMainApiPathListComponent
      },
      {
        path: 'api-path/list/LinkCompanyId/:LinkCompanyId',
        component: SmsMainApiPathListComponent
      },

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
    //     component: ApplicationThemeActionListComponent
    //   },
     ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsMainRoutes {
}
