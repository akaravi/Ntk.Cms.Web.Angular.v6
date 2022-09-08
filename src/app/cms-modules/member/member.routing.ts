import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberGroupAddComponent } from './group/add/add.component';
import { MemberGroupEditComponent } from './group/edit/edit.component';
import { MemberGroupListComponent } from './group/list/list.component';
import { MemberComponent } from './member.component';
const routes: Routes = [
  {
    path: '',
    component: MemberComponent,
    children: [
      {
        path: 'group',
        component: MemberGroupListComponent
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