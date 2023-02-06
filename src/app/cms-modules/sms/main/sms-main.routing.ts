import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmsMainApiNumberPermissionListComponent } from './api-number-permission/list/list.component';
import { SmsMainApiNumberListComponent } from './api-number/list/list.component';
import { SmsMainApiPathCompanyListComponent } from './api-path-company/list/list.component';
import { SmsMainApiPathPermissionListComponent } from './api-path-permission/list/list.component';
import { SmsMainApiPathPriceServiceListComponent } from './api-path-price-service/list/list.component';
import { SmsMainApiPathEditComponent } from './api-path/edit/edit.component';
import { SmsMainApiPathListComponent } from './api-path/list/list.component';
import { SmsMainCustomerCreditListComponent } from './customer-credit/list/list.component';
import { SmsMainMessageContentListComponent } from './message-content/list/list.component';
import { SmsMainApiPathPublicConfigListComponent } from './public-config/list/list.component';
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
        path: 'publicconfig',
        component: SmsMainApiPathPublicConfigListComponent
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
        path: 'api-path/list/LinkPublicConfigId/:LinkPublicConfigId',
        component: SmsMainApiPathListComponent
      },
      {
        path: 'api-path/list/LinkSiteId/:LinkSiteId',
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
      {
        path: 'api-number',
        component: SmsMainApiNumberListComponent
      },
      {
        path: 'api-number-permission',
        component: SmsMainApiNumberPermissionListComponent
      },
      {
        path: 'api-number-permission/LinkApiNumberId/:LinkApiNumberId',
        component: SmsMainApiNumberPermissionListComponent
      },
      {
        path: 'customer-credit',
        component: SmsMainCustomerCreditListComponent
      },
      {
        path: 'message',
        component: SmsMainMessageContentListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsMainRoutes {
}
