import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkManagementAccountingDetailListComponent } from './accounting-detail/list/list.component';
import { LinkManagementAccountingListComponent } from './accounting/list/list.component';
import { LinkManagementBillboardPatternListComponent } from './billboard-pattern/list/list.component';
import { LinkManagementBillboardAddComponent } from './billboard/add/add.component';
import { LinkManagementBillboardEditComponent } from './billboard/edit/edit.component';
import { LinkManagementBillboardListComponent } from './billboard/list/list.component';
import { LinkManagementComponent } from './link-management.component';
import { LinkManagementMemberListComponent } from './member/list/list.component';
import { LinkManagementTargetBillboardLogListComponent } from './target-billboard-log/list/list.component';
import { LinkManagementTargetAddComponent } from './target/add/add.component';
import { LinkManagementTargetEditComponent } from './target/edit/edit.component';
import { LinkManagementTargetListComponent } from './target/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: LinkManagementComponent,
    children: [
      /* Config */
      {
        path: 'config',
        loadChildren: () =>
          import('./config/link-management-config.module').then((m) => m.LinkManagementConfigModule),
      },
      /* Config */
      {
        path: 'target',
        component: LinkManagementTargetListComponent
      },
      {
        path: 'target/add/:CategoryId',
        component: LinkManagementTargetAddComponent
      },
      {
        path: 'target/edit/:Id',
        component: LinkManagementTargetEditComponent
      },
      {
        path: 'billboard',
        component: LinkManagementBillboardListComponent
      },
      {
        path: 'billboard/add/:CategoryId',
        component: LinkManagementBillboardAddComponent
      },
      {
        path: 'billboard/edit/:Id',
        component: LinkManagementBillboardEditComponent
      },
      {
        path: 'target-billboard-log',
        component: LinkManagementTargetBillboardLogListComponent
      },
      {
        path: 'target-billboard-log/LinkManagementBillboardId/:LinkManagementBillboardId',
        component: LinkManagementTargetBillboardLogListComponent
      },
      {
        path: 'target-billboard-log/LinkManagementTargetId/:LinkManagementTargetId',
        component: LinkManagementTargetBillboardLogListComponent
      },
      {
        path: 'target-billboard-log/Key/:Key',
        component: LinkManagementTargetBillboardLogListComponent
      },
      {
        path: 'billboard-pattern',
        component: LinkManagementBillboardPatternListComponent
      },
      {
        path: 'accounting',
        component: LinkManagementAccountingListComponent
      },
      {
        path: 'accountingdetail',
        component: LinkManagementAccountingDetailListComponent
      },
      {
        path: 'accountingdetail/LinkManagementAccountingId/:LinkManagementAccountingId',
        component: LinkManagementAccountingDetailListComponent
      },
      {
        path: 'member',
        component: LinkManagementMemberListComponent
      }

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkManagementRoutes {
}
