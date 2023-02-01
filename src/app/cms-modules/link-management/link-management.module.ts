import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from 'src/app/shared.module';
import { LinkManagementComponent } from './link-management.component';
import { LinkManagementRoutes } from './link-management.routing';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { ColorPickerModule } from 'ngx-color-picker';
import {
  CoreAuthService,
  CoreEnumService, CoreModuleService, LinkManagementAccountingDetailService, LinkManagementAccountingService, LinkManagementBillboardPatternService,
  LinkManagementBillboardService, LinkManagementBillboardTargetCategoryService, LinkManagementConfigurationService, LinkManagementEnumService, LinkManagementMemberService,
  LinkManagementTargetBillboardLogService, LinkManagementTargetCategoryService,
  LinkManagementTargetService
} from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { LinkManagementAccountingDetailAddComponent } from './accounting-detail/add/add.component';
import { LinkManagementAccountingDetailDeleteComponent } from './accounting-detail/delete/delete.component';
import { LinkManagementAccountingDetailEditComponent } from './accounting-detail/edit/edit.component';
import { LinkManagementAccountingDetailListComponent } from './accounting-detail/list/list.component';
import { LinkManagementAccountingAddComponent } from './accounting/add/add.component';
import { LinkManagementAccountingDeleteComponent } from './accounting/delete/delete.component';
import { LinkManagementAccountingEditComponent } from './accounting/edit/edit.component';
import { LinkManagementAccountingListComponent } from './accounting/list/list.component';
import { LinkManagementAccountingSelectorComponent } from './accounting/selector/selector.component';
import { LinkManagementBillboardPatternAddComponent } from './billboard-pattern/add/add.component';
import { LinkManagementBillboardPatternDeleteComponent } from './billboard-pattern/delete/delete.component';
import { LinkManagementBillboardPatternEditComponent } from './billboard-pattern/edit/edit.component';
import { LinkManagementBillboardPatternListComponent } from './billboard-pattern/list/list.component';
import { LinkManagementBillboardPatternSelectorComponent } from './billboard-pattern/selector/selector.component';
import { LinkManagementBillboardPatternTreeSelectorComponent } from './billboard-pattern/tree-selector/tree-selector.component';
import { LinkManagementBillboardPatternTreeComponent } from './billboard-pattern/tree/tree.component';
import { LinkManagementBillboardAddComponent } from './billboard/add/add.component';
import { LinkManagementBillboardDeleteComponent } from './billboard/delete/delete.component';
import { LinkManagementBillboardEditComponent } from './billboard/edit/edit.component';
import { LinkManagementBillboardListComponent } from './billboard/list/list.component';
import { LinkManagementMemberAddComponent } from './member/add/add.component';
import { LinkManagementMemberDeleteComponent } from './member/delete/delete.component';
import { LinkManagementMemberEditComponent } from './member/edit/edit.component';
import { LinkManagementMemberListComponent } from './member/list/list.component';
import { LinkManagementMemberSelectorComponent } from './member/selector/selector.component';
import { LinkManagementTargetBillboardLogDeleteComponent } from './target-billboard-log/delete/delete.component';
import { LinkManagementTargetBillboardLogEditComponent } from './target-billboard-log/edit/edit.component';
import { LinkManagementTargetBillboardLogListComponent } from './target-billboard-log/list/list.component';
import { LinkManagementTargetCategoryAddComponent } from './target-category/add/add.component';
import { LinkManagementTargetCategoryDeleteComponent } from './target-category/delete/delete.component';
import { LinkManagementTargetCategoryEditComponent } from './target-category/edit/edit.component';
import { LinkManagementTargetCategorySelectorComponent } from './target-category/selector/selector.component';
import { LinkManagementTargetCategoryTreeSelectorComponent } from './target-category/tree-selector/tree-selector.component';
import { LinkManagementTargetCategoryTreeComponent } from './target-category/tree/tree.component';
import { LinkManagementTargetAddComponent } from './target/add/add.component';
import { LinkManagementTargetDeleteComponent } from './target/delete/delete.component';
import { LinkManagementTargetEditComponent } from './target/edit/edit.component';
import { LinkManagementTargetListComponent } from './target/list/list.component';

@NgModule({
  declarations: [
    LinkManagementComponent,
    /** */
    LinkManagementTargetCategoryTreeComponent,
    LinkManagementTargetCategorySelectorComponent,
    LinkManagementTargetCategoryAddComponent,
    LinkManagementTargetCategoryEditComponent,
    LinkManagementTargetCategoryDeleteComponent,
    LinkManagementTargetCategoryTreeSelectorComponent,
    /** */
    LinkManagementTargetAddComponent,
    LinkManagementTargetEditComponent,
    LinkManagementTargetDeleteComponent,
    LinkManagementTargetListComponent,
    /** */
    LinkManagementBillboardPatternTreeComponent,
    LinkManagementBillboardPatternSelectorComponent,
    LinkManagementBillboardPatternAddComponent,
    LinkManagementBillboardPatternEditComponent,
    LinkManagementBillboardPatternDeleteComponent,
    LinkManagementBillboardPatternListComponent,
    LinkManagementBillboardPatternTreeSelectorComponent,
    /** */
    LinkManagementBillboardAddComponent,
    LinkManagementBillboardEditComponent,
    LinkManagementBillboardDeleteComponent,
    LinkManagementBillboardListComponent,
    /** */
    LinkManagementTargetBillboardLogEditComponent,
    LinkManagementTargetBillboardLogDeleteComponent,
    LinkManagementTargetBillboardLogListComponent,
    /** */
    LinkManagementMemberAddComponent,
    LinkManagementMemberDeleteComponent,
    LinkManagementMemberEditComponent,
    LinkManagementMemberListComponent,
    LinkManagementMemberSelectorComponent,
    /** */
    LinkManagementAccountingAddComponent,
    LinkManagementAccountingDeleteComponent,
    LinkManagementAccountingEditComponent,
    LinkManagementAccountingListComponent,
    LinkManagementAccountingSelectorComponent,
    /** */
    LinkManagementAccountingDetailAddComponent,
    LinkManagementAccountingDetailDeleteComponent,
    LinkManagementAccountingDetailEditComponent,
    LinkManagementAccountingDetailListComponent,
    /** */
  ],
  exports: [
    /** */
    LinkManagementTargetCategoryTreeComponent,
    LinkManagementTargetCategorySelectorComponent,
    LinkManagementTargetCategoryAddComponent,
    LinkManagementTargetCategoryEditComponent,
    LinkManagementTargetCategoryDeleteComponent,
    LinkManagementTargetCategoryTreeSelectorComponent,
    /** */
    LinkManagementTargetAddComponent,
    LinkManagementTargetEditComponent,
    LinkManagementTargetDeleteComponent,
    LinkManagementTargetListComponent,
    /** */
    LinkManagementBillboardPatternTreeComponent,
    LinkManagementBillboardPatternSelectorComponent,
    LinkManagementBillboardPatternAddComponent,
    LinkManagementBillboardPatternEditComponent,
    LinkManagementBillboardPatternDeleteComponent,
    LinkManagementBillboardPatternListComponent,
    LinkManagementBillboardPatternTreeSelectorComponent,
    /** */
    LinkManagementBillboardAddComponent,
    LinkManagementBillboardEditComponent,
    LinkManagementBillboardDeleteComponent,
    LinkManagementBillboardListComponent,
    /** */
    LinkManagementTargetBillboardLogEditComponent,
    LinkManagementTargetBillboardLogDeleteComponent,
    LinkManagementTargetBillboardLogListComponent,
    /** */
    LinkManagementMemberAddComponent,
    LinkManagementMemberDeleteComponent,
    LinkManagementMemberEditComponent,
    LinkManagementMemberListComponent,
    LinkManagementMemberSelectorComponent,
    /** */
    LinkManagementAccountingAddComponent,
    LinkManagementAccountingDeleteComponent,
    LinkManagementAccountingEditComponent,
    LinkManagementAccountingListComponent,
    LinkManagementAccountingSelectorComponent,
    /** */
    LinkManagementAccountingDetailAddComponent,
    LinkManagementAccountingDetailDeleteComponent,
    LinkManagementAccountingDetailEditComponent,
    LinkManagementAccountingDetailListComponent,
    /** */
  ],
  imports: [
    CommonModule,
    LinkManagementRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule.forRoot(),
    AngularEditorModule,


    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    ColorPickerModule,

  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    CoreAuthService,
    /*Config*/
    LinkManagementConfigurationService,
    /*Config*/
    CmsConfirmationDialogService,
    LinkManagementEnumService,
    LinkManagementAccountingService,
    LinkManagementAccountingDetailService,
    LinkManagementBillboardService,
    LinkManagementBillboardPatternService,
    LinkManagementBillboardTargetCategoryService,
    LinkManagementMemberService,
    LinkManagementTargetService,
    LinkManagementTargetBillboardLogService,
    LinkManagementTargetCategoryService,
  ]
})
export class LinkManagementModule { }
