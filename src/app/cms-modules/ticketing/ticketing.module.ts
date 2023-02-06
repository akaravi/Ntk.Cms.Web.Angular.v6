import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TicketingComponent } from './ticketing.component';
import { TicketingRouting } from './ticketing.routing';


import {
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  TicketingAnswerService,
  TicketingConfigurationService,
  TicketingDepartemenLogService,
  TicketingDepartemenOperatorService,
  TicketingDepartemenService,
  TicketingEnumService,
  TicketingFaqService,
  TicketingTaskService,
  TicketingTemplateService
} from 'ntk-cms-api';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { TicketingAnswerAddComponent } from './answer/add/add.component';
import { TicketingAnswerEditComponent } from './answer/edit/edit.component';
import { TicketingAnswerListComponent } from './answer/list/list.component';
import { TicketingAnswerViewComponent } from './answer/view/view.component';
import { TicketingDepartemenAddComponent } from './departemen/add/add.component';
import { TicketingDepartemenDeleteComponent } from './departemen/delete/delete.component';
import { TicketingDepartemenEditComponent } from './departemen/edit/edit.component';
import { TicketingDepartemenListComponent } from './departemen/list/list.component';
import { TicketingDepartemenSelectorComponent } from './departemen/selector/selector.component';
import { TicketingDepartemenTreeComponent } from './departemen/tree/tree.component';
import { TicketingDepartemenLogEditComponent } from './departemenLog/edit/edit.component';
import { TicketingDepartemenLogListComponent } from './departemenLog/list/list.component';
import { TicketingDepartemenOperatorAddComponent } from './departemenOperator/add/add.component';
import { TicketingDepartemenOperatorEditComponent } from './departemenOperator/edit/edit.component';
import { TicketingDepartemenOperatorListComponent } from './departemenOperator/list/list.component';
import { TicketingDepartemenOperatorSelectorComponent } from './departemenOperator/selector/selector.component';
import { TicketingFaqAddComponent } from './faq/add/add.component';
import { TicketingFaqEditComponent } from './faq/edit/edit.component';
import { TicketingFaqListComponent } from './faq/list/list.component';
import { TicketingFaqOriginListComponent } from './faq/origin-list/origin-list.component';
import { TicketingTaskAddComponent } from './task/add/add.component';
import { TicketingTaskContactUsAddComponent } from './task/contact-us-add/contact-us-add.component';
import { TicketingTaskContactUsListComponent } from './task/contact-us-list/contact-us-list.component';
import { TicketingTaskEditComponent } from './task/edit/edit.component';
import { TicketingTaskHeaderComponent } from './task/header/header.component';
import { TicketingTaskListComponent } from './task/list/list.component';
import { TicketingTaskViewComponent } from './task/view/view.component';
import { TicketingTemplateAddComponent } from './template/add/add.component';
import { TicketingTemplateEditComponent } from './template/edit/edit.component';
import { TicketingTemplateListComponent } from './template/list/list.component';
import { TicketingTemplateSelectorComponent } from './template/selector/selector.component';



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
    TicketingTemplateSelectorComponent,
    /** */
    TicketingTaskListComponent,
    TicketingTaskEditComponent,
    TicketingTaskAddComponent,
    TicketingTaskViewComponent,
    TicketingTaskContactUsAddComponent,
    TicketingTaskContactUsListComponent,
    TicketingTaskHeaderComponent,
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

    CmsFileManagerModule,
    InlineSVGModule,
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    /*Config*/
    TicketingConfigurationService,
    /*Config*/
    CoreModuleTagService,
    TicketingEnumService,
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
