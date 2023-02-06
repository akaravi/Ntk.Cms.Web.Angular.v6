import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreSiteAddComponent } from './add/add.component';
import { CoreSiteAddFirstComponent } from './addFirst/addFirst.component';
import { CoreSiteEditComponent } from './edit/edit.component';
import { CoreInfoComponent } from './info/core-info.component';
import { CoreSiteListComponent } from './list/list.component';
import { CoreSiteModuleAddComponent } from './moduleAdd/moduleAdd.component';
import { CoreSiteModuleEditComponent } from './moduleEdit/moduleEdit.component';
import { CoreSiteModuleListComponent } from './moduleList/moduleList.component';
import { CoreSiteResellerChartComponent } from './reseller-chart/reseller-chart.component';
import { CoreSiteSelectionComponent } from './selection/selection.component';
import { CoreSiteUserListComponent } from './userList/userList.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreSiteListComponent
      },
      {
        path: 'list/LinkUserId/:LinkUserId',
        component: CoreSiteListComponent
      },
      {
        path: 'list/LinkSiteCategoryId/:LinkSiteCategoryId',
        component: CoreSiteListComponent
      },
      {
        path: 'selection',
        component: CoreSiteSelectionComponent
      },
      {
        path: 'addFirst',
        component: CoreSiteAddFirstComponent
      },
      {
        path: 'add',
        component: CoreSiteAddComponent
      },
      {
        path: 'edit',
        component: CoreSiteEditComponent
      },
      {
        path: 'edit/:Id',
        component: CoreSiteEditComponent
      },
      /** modulelist */
      {
        path: 'modulelist',
        component: CoreSiteModuleListComponent
      },
      {
        path: 'modulelist/LinkSiteId/:LinkSiteId',
        component: CoreSiteModuleListComponent
      },
      {
        path: 'modulelist/LinkModuleId/:LinkModuleId',
        component: CoreSiteModuleListComponent
      },
      /** modulelist */
      {
        path: 'moduleadd/:LinkSiteId',
        component: CoreSiteModuleAddComponent
      },
      {
        path: 'moduleadd/:LinkSiteId/:LinkModuleId',
        component: CoreSiteModuleAddComponent
      },
      {
        path: 'moduleedit/:LinkSiteId/:LinkModuleId',
        component: CoreSiteModuleEditComponent
      },
      /** userlist */
      {
        path: 'userlist',
        component: CoreSiteUserListComponent
      },
      {
        path: 'userlist/LinkSiteId/:LinkSiteId',
        component: CoreSiteUserListComponent
      },
      {
        path: 'userlist/LinkUserGroupId/:LinkUserGroupId',
        component: CoreSiteUserListComponent
      },
      {
        path: 'userlist/LinkUserId/:LinkUserId',
        component: CoreSiteUserListComponent
      },
      /** userlist */
      {
        path: 'info',
        component: CoreInfoComponent
      },
      {
        path: 'reseller-chart',
        component: CoreSiteResellerChartComponent

      },
      {
        path: 'reseller-chart/LinkSiteId/:LinkSiteId',
        component: CoreSiteResellerChartComponent

      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreSiteRouting {
}
