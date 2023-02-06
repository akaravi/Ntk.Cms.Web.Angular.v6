import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreEnumService,
  CoreModuleService, CoreUserClaimContentService, CoreUserClaimGroupDetailService, CoreUserClaimGroupService, CoreUserClaimTypeService
} from 'ntk-cms-api';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { SharedModule } from 'src/app/shared.module';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CoreUserClaimContentAddComponent } from './content/add/add.component';
import { CoreUserClaimContentCheckListComponent } from './content/check-list/check-list.component';
import { CoreUserClaimContentEditComponent } from './content/edit/edit.component';
import { CoreUserClaimContentListComponent } from './content/list/list.component';
import { CoreUserClaimComponent } from './core-user-claim.component';
import { CoreUserClaimRouting } from './core-user-claim.routing';
import { CoreUserClaimGroupDetailAddComponent } from './group-detail/add/add.component';
import { CoreUserClaimGroupDetailEditComponent } from './group-detail/edit/edit.component';
import { CoreUserClaimGroupDetailListComponent } from './group-detail/list/list.component';
import { CoreUserClaimGroupDetailSelectorComponent } from './group-detail/selector/selector.component';
import { CoreUserClaimGroupDetailTreeComponent } from './group-detail/tree/tree.component';
import { CoreUserClaimGroupAddComponent } from './group/add/add.component';
import { CoreUserClaimGroupEditComponent } from './group/edit/edit.component';
import { CoreUserClaimGroupHeaderComponent } from './group/header/header.component';
import { CoreUserClaimGroupListComponent } from './group/list/list.component';
import { CoreUserClaimGroupSelectionlistComponent } from './group/selectionlist/selectionlist.component';
import { CoreUserClaimGroupSelectorComponent } from './group/selector/selector.component';
import { CoreUserClaimGroupTreeComponent } from './group/tree/tree.component';
import { CoreUserClaimTypeAddComponent } from './type/add/add.component';
import { CoreUserClaimTypeEditComponent } from './type/edit/edit.component';
import { CoreUserClaimTypeHeaderComponent } from './type/header/header.component';
import { CoreUserClaimTypeListComponent } from './type/list/list.component';
import { CoreUserClaimTypeSelectionlistComponent } from './type/selectionlist/selectionlist.component';
import { CoreUserClaimTypeSelectorComponent } from './type/selector/selector.component';
import { CoreUserClaimTypeTreeComponent } from './type/tree/tree.component';

@NgModule({
  declarations: [
    CoreUserClaimComponent,
    /** */
    CoreUserClaimGroupListComponent,
    CoreUserClaimGroupAddComponent,
    CoreUserClaimGroupEditComponent,
    CoreUserClaimGroupSelectorComponent,
    CoreUserClaimGroupTreeComponent,
    CoreUserClaimGroupHeaderComponent,
    /** */
    /** */
    CoreUserClaimTypeListComponent,
    CoreUserClaimTypeAddComponent,
    CoreUserClaimTypeEditComponent,
    CoreUserClaimTypeSelectorComponent,
    CoreUserClaimTypeSelectionlistComponent,
    CoreUserClaimTypeTreeComponent,
    CoreUserClaimTypeHeaderComponent,
    /** */
    /** */
    CoreUserClaimGroupDetailListComponent,
    CoreUserClaimGroupDetailAddComponent,
    CoreUserClaimGroupDetailEditComponent,
    CoreUserClaimGroupDetailSelectorComponent,
    CoreUserClaimGroupDetailTreeComponent,
    CoreUserClaimGroupSelectionlistComponent,
    /** */
    /** */
    CoreUserClaimContentListComponent,
    CoreUserClaimContentCheckListComponent,
    CoreUserClaimContentAddComponent,
    CoreUserClaimContentEditComponent,
    /** */
  ],
  exports: [
    CoreUserClaimComponent,
    /** */
    CoreUserClaimGroupListComponent,
    CoreUserClaimGroupAddComponent,
    CoreUserClaimGroupEditComponent,
    CoreUserClaimGroupSelectorComponent,
    CoreUserClaimGroupTreeComponent,
    CoreUserClaimGroupHeaderComponent,
    /** */
    /** */
    CoreUserClaimTypeListComponent,
    CoreUserClaimTypeAddComponent,
    CoreUserClaimTypeEditComponent,
    CoreUserClaimTypeSelectorComponent,
    CoreUserClaimTypeSelectionlistComponent,
    CoreUserClaimTypeTreeComponent,
    CoreUserClaimTypeHeaderComponent,
    /** */
    /** */
    CoreUserClaimGroupDetailListComponent,
    CoreUserClaimGroupDetailAddComponent,
    CoreUserClaimGroupDetailEditComponent,
    CoreUserClaimGroupDetailSelectorComponent,
    CoreUserClaimGroupDetailTreeComponent,
    /** */
    /** */
    CoreUserClaimContentListComponent,
    CoreUserClaimContentCheckListComponent,
    CoreUserClaimContentAddComponent,
    CoreUserClaimContentEditComponent,
    /** */
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreUserClaimRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule.forRoot(),
    AngularEditorModule,


  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    /** */
    CoreUserClaimContentService,
    CoreUserClaimTypeService,
    CoreUserClaimGroupService,
    CoreUserClaimGroupDetailService,
    /** */
    CmsConfirmationDialogService
  ]
})
export class CoreUserClaimModule {
}
