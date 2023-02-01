import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileContentExplorerComponent } from './content/explorer/explorer.component';
import { FileContentListComponent } from './content/list/list.component';
import { FileManagerComponent } from './file-manager.component';


const routes: Routes = [
  {
    path: '',
    component: FileManagerComponent,
    children: [
      {
        path: 'content',
        component: FileContentListComponent
      },
      {
        path: 'explorer',
        component: FileContentExplorerComponent
      },
      {
        path: '',
        redirectTo: 'explorer',
        pathMatch: 'full',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileManagerRouting {
}
