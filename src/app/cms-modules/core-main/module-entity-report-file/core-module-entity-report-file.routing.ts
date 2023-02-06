import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModuleEntityReportFileListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreModuleEntityReportFileListComponent
      },
      {
        path: 'LinkModuleEntityReportFileId/:LinkModuleEntityReportFileId',
        component: CoreModuleEntityReportFileListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreModuleEntityReportFileRouting {
}
