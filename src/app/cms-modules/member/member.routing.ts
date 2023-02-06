import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberGroupListComponent } from './group/list/list.component';
import { MemberComponent } from './member.component';
import { MemberPropertyAliasListComponent } from './property-alias/list/list.component';
import { MemberPropertyDetailGroupListComponent } from './property-detail-group/list/list.component';
import { MemberPropertyDetailListComponent } from './property-detail/list/list.component';
const routes: Routes = [
  {
    path: '',
    component: MemberComponent,
    children: [
      {
        path: 'group',
        component: MemberGroupListComponent
      },
      {
        path: 'property-alias',
        component: MemberPropertyAliasListComponent
      },
      {
        path: 'property-detail-group',
        component: MemberPropertyDetailGroupListComponent
      },
      {
        path: 'property-detail',
        component: MemberPropertyDetailListComponent
      },
      {
        path: 'property-detail/LinkPropertyId/:LinkPropertyId',
        component: MemberPropertyDetailListComponent
      },
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
export class MemberRoutes {
}