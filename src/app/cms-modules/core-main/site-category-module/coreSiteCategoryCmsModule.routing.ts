import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { CoreSiteCategoryCmsModuleListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreSiteCategoryCmsModuleListComponent
      },
      {
        path: 'LinkCmsModuleId/:LinkCmsModuleId',
        component: CoreSiteCategoryCmsModuleListComponent
      },
      {
        path: 'LinkCmsSiteCategoryId/:LinkCmsSiteCategoryId',
        component: CoreSiteCategoryCmsModuleListComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreSiteCategoryCmsModuleRouting {
}
