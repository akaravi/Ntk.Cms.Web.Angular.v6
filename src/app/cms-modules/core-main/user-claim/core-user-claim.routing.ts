import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreUserClaimContentCheckListComponent } from './content/check-list/check-list.component';
import { CoreUserClaimContentListComponent } from './content/list/list.component';
import { CoreUserClaimGroupDetailListComponent } from './group-detail/list/list.component';
import { CoreUserClaimGroupListComponent } from './group/list/list.component';
import { CoreUserClaimTypeListComponent } from './type/list/list.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'group',
        component: CoreUserClaimGroupListComponent
      },
      /** */
      {
        path: 'groupdetail',
        component: CoreUserClaimGroupDetailListComponent
      },
      {
        path: 'groupdetail/LinkUserClaimTypeId/:LinkUserClaimTypeId',
        component: CoreUserClaimGroupDetailListComponent
      },
      {
        path: 'groupdetail/LinkUserClaimGroupId/:LinkUserClaimGroupId',
        component: CoreUserClaimGroupDetailListComponent
      },
      /** */
      {
        path: 'type',
        component: CoreUserClaimTypeListComponent
      },
      /** */
      {
        path: 'content',
        component: CoreUserClaimContentListComponent
      },
      {
        path: 'content/LinkUserClaimTypeId/:LinkUserClaimTypeId',
        component: CoreUserClaimContentListComponent
      },
      {
        path: 'content/LinkSiteId/:LinkSiteId',
        component: CoreUserClaimContentListComponent
      },
      {
        path: 'content/LinkUserId/:LinkUserId',
        component: CoreUserClaimContentListComponent
      },
      /** */
      /** */
      {
        path: 'checklist',
        component: CoreUserClaimContentCheckListComponent
      },
      {
        path: 'checklist/:LinkSiteId/:LinkUserId',
        component: CoreUserClaimContentCheckListComponent
      },
      /** */
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreUserClaimRouting {
}
