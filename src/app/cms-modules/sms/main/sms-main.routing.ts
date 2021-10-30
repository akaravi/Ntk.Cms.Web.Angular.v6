import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsMainApiPathCompanyListComponent } from './api-path-company/list/list.component';
import { SmsMainApiPathPermissionListComponent } from './api-path-permission/list/list.component';
import { SmsMainApiPathPriceServiceListComponent } from './api-path-price-service/list/list.component';
import { SmsMainApiPathEditComponent } from './api-path/edit/edit.component';
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
      {
        path: 'api-path/edit/:Id',
        component: SmsMainApiPathEditComponent
      },
      {
        path: 'api-path-permission',
        component: SmsMainApiPathPermissionListComponent
      },
      {
        path: 'api-path-permission/LinkApiPathId/:LinkApiPathId',
        component: SmsMainApiPathPermissionListComponent
      },
      {
        path: 'api-path-price-service',
        component: SmsMainApiPathPriceServiceListComponent
      },
      {
        path: 'api-path-price-service/LinkApiPathId/:LinkApiPathId',
        component: SmsMainApiPathPriceServiceListComponent
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
