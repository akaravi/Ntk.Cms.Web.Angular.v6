import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketingRouting } from './ticketing.routing';
import { TicketingComponent } from './ticketing.component';
import { TagInputModule } from 'ngx-chips';

import {
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  TicketingAnswerService,
  TicketingConfigurationService,
  TicketingDepartemenLogService,
  TicketingDepartemenOperatorService,
  TicketingDepartemenService,
  TicketingFaqService,
  TicketingTaskService,
  TicketingTemplateService,
} from 'ntk-cms-api';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';

import { CmsFileManagerModule } from 'src/filemanager-api';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TicketingDepartemenListComponent } from './departemen/list/list.component';
import { TicketingDepartemenSelectorComponent } from './departemen/selector/selector.component';
import { TicketingDepartemenTreeComponent } from './departemen/tree/tree.component';
import { TicketingDepartemenDeleteComponent } from './departemen/delete/delete.component';
import { TicketingDepartemenEditComponent } from './departemen/edit/edit.component';
import { TicketingFaqEditComponent } from './faq/edit/edit.component';
import { TicketingFaqListComponent } from './faq/list/list.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { TicketingTaskListComponent } from './task/list/list.component';
import { TicketingTaskEditComponent } from './task/edit/edit.component';
import { TicketingDepartemenAddComponent } from './departemen/add/add.component';
import { TicketingTemplateListComponent } from './template/list/list.component';
import { TicketingFaqAddComponent } from './faq/add/add.component';
import { TicketingTemplateAddComponent } from './template/add/add.component';
import { TicketingTemplateEditComponent } from './template/edit/edit.component';
import { TicketingDepartemenLogEditComponent } from './departemenLog/edit/edit.component';
import { TicketingDepartemenOperatorAddComponent } from './departemenOperator/add/add.component';
import { TicketingDepartemenOperatorEditComponent } from './departemenOperator/edit/edit.component';
import { TicketingTaskAddComponent } from './task/add/add.component';
import { TicketingDepartemenLogListComponent } from './departemenLog/list/list.component';
import { TicketingDepartemenOperatorSelectorComponent } from './departemenOperator/selector/selector.component';
import { TicketingDepartemenOperatorListComponent } from './departemenOperator/list/list.component';
import { TicketingConfigSiteComponent } from './config/site/config-site.component';
import { TicketingConfigMainAdminComponent } from './config/main-admin/config-main-admin.component';
import { TicketingAnswerListComponent } from './answer/list/list.component';
import { TicketingAnswerAddComponent } from './answer/add/add.component';
import { TicketingAnswerEditComponent } from './answer/edit/edit.component';
import { TicketingTaskContactUsAddComponent } from './task/contact-us-add/contact-us-add.component';
import { TicketingFaqOriginListComponent } from './faq/origin-list/origin-list.component';
import { TicketingTaskContactUsListComponent } from './task/contact-us-list/contact-us-list.component';
import { TicketingTaskViewComponent } from './task/view/view.component';
import { TicketingAnswerViewComponent } from './answer/view/view.component';



@NgModule({
  declarations: [
    TicketingComponent,
    TicketingDepartemenListComponent,
    TicketingDepartemenAddComponent,
    TicketingDepartemenEditComponent,
    TicketingDepartemenDeleteComponent,
    TicketingDepartemenSelectorComponent,
    TicketingDepartemenTreeComponent,
    /* */
    TicketingFaqAddComponent,
    TicketingFaqEditComponent,
    TicketingFaqListComponent,
    TicketingFaqOriginListComponent,
    /* */
    TicketingTemplateAddComponent,
    TicketingTemplateEditComponent,
    TicketingTemplateListComponent,
    /** */
    TicketingTaskListComponent,
    TicketingTaskEditComponent,
    TicketingTaskAddComponent,
    TicketingTaskViewComponent,
    TicketingTaskContactUsAddComponent,
    TicketingTaskContactUsListComponent,
    /* */
    TicketingDepartemenOperatorListComponent,
    TicketingDepartemenLogEditComponent,
    TicketingDepartemenOperatorAddComponent,
    TicketingDepartemenOperatorEditComponent,
    TicketingDepartemenOperatorSelectorComponent,
    /* */
    TicketingAnswerListComponent,
    TicketingAnswerAddComponent,
    TicketingAnswerEditComponent,
    TicketingAnswerViewComponent,
    /* */
    TicketingDepartemenLogListComponent,
    /** */

  ],
  imports: [
    CommonModule,
    TicketingRouting,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    /*Config*/
    TicketingConfigurationService,
    /*Config*/
    CoreModuleTagService,
    TicketingDepartemenService,
    TicketingDepartemenLogService,
    TicketingDepartemenOperatorService,
    TicketingTaskService,
    TicketingFaqService,
    TicketingAnswerService,
    TicketingTemplateService,
    CmsConfirmationDialogService,

  ]
})
export class TicketingModule { }
