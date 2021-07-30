import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketingComponent } from './ticketing.component';
import { TicketingDepartemenListComponent } from './departemen/list/list.component';
import { TicketingDepartemenEditComponent } from './departemen/edit/edit.component';
import { TicketingFaqListComponent } from './faq/list/list.component';
import { TicketingTaskEditComponent } from './task/edit/edit.component';
import { TicketingTaskListComponent } from './task/list/list.component';
import { TicketingTemplateListComponent } from './template/list/list.component';
import { TicketingConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { TicketingConfigSiteComponent } from './config/site/configSite.component';
import { TicketingDepartemenLogListComponent } from './departemenLog/list/list.component';
import { TicketingAnswerListComponent } from './answer/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: TicketingComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: TicketingConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: TicketingConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: TicketingConfigSiteComponent
      },
      /*Config*/
      {
        path: 'departemen',
        component: TicketingDepartemenListComponent
      },
      {
        path: 'departemen/add/',
        component: TicketingDepartemenEditComponent
      },
      {
        path: 'departemen/edit/:Id',
        component: TicketingDepartemenEditComponent
      },
      {
        path: 'departemenlog/DepartemenId/:DepartemenId',
        component: TicketingDepartemenLogListComponent
      },
      {
        path: 'departemenlog/OperatorId/:OperatorId',
        component: TicketingDepartemenLogListComponent
      },
      {
        path: 'faq',
        component: TicketingFaqListComponent
      },
      {
        path: 'faq/:DepartemenId',
        component: TicketingFaqListComponent
      }
      , {
        path: 'template',
        component: TicketingTemplateListComponent
      },
      {
        path: 'template/:DepartemenId',
        component: TicketingTemplateListComponent
      }
      ,
      {
        path: 'task',
        component: TicketingTaskListComponent
      },
      {
        path: 'task/:DepartemenId',
        component: TicketingTaskListComponent
      }
      ,
      {
        path: 'task/edit/:id',
        component: TicketingTaskEditComponent
      }
      ,
      {
        path: 'answer',
        component: TicketingAnswerListComponent
      },
      {
        path: 'answer/LinkTicketId/:LinkTicketId',
        component: TicketingAnswerListComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketingRouting {
}
