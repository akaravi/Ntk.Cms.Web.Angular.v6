import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact.component';
import { ContactContentAddComponent } from './content/add/add.component';
import { ContactContentEditComponent } from './content/edit/edit.component';
import { ContactContentListComponent } from './content/list/list.component';


const routes: Routes = [
  {
    path: '',
    component: ContactComponent,
    children: [
      /* Config */
      {
        path: 'config',
        loadChildren: () =>
          import('./config/contact-config.module').then((m) => m.ContactConfigModule),
      },
      /* Config */
      {
        path: 'content',
        component: ContactContentListComponent
      },
      {
        path: 'content/add/:CategoryId',
        component: ContactContentAddComponent
      },
      {
        path: 'content/edit/:Id',
        component: ContactContentEditComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRouting {
}
