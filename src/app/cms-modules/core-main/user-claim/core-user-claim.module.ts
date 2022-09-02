import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CoreUserClaimGroupService,
  CoreUserClaimGroupDetailService,
  CoreUserClaimContentService,
  CoreUserClaimTypeService,
  CoreEnumService,
  CoreModuleService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { CoreUserClaimComponent } from './core-user-claim.component';
import { CoreUserClaimRouting } from './core-user-claim.routing';
import { SharedModule } from 'src/app/shared.module';
import { CoreUserClaimGroupListComponent } from './group/list/list.component';
import { CoreUserClaimGroupAddComponent } from './group/add/add.component';
import { CoreUserClaimGroupEditComponent } from './group/edit/edit.component';
import { CoreUserClaimGroupSelectorComponent } from './group/selector/selector.component';
import { CoreUserClaimGroupTreeComponent } from './group/tree/tree.component';
import { CoreUserClaimGroupHeaderComponent } from './group/header/header.component';
import { CoreUserClaimTypeListComponent } from './type/list/list.component';
import { CoreUserClaimTypeAddComponent } from './type/add/add.component';
import { CoreUserClaimTypeEditComponent } from './type/edit/edit.component';
import { CoreUserClaimTypeSelectorComponent } from './type/selector/selector.component';
import { CoreUserClaimTypeTreeComponent } from './type/tree/tree.component';
import { CoreUserClaimTypeHeaderComponent } from './type/header/header.component';
import { CoreUserClaimGroupDetailAddComponent } from './group-detail/add/add.component';
import { CoreUserClaimGroupDetailEditComponent } from './group-detail/edit/edit.component';
import { CoreUserClaimGroupDetailSelectorComponent } from './group-detail/selector/selector.component';
import { CoreUserClaimGroupDetailTreeComponent } from './group-detail/tree/tree.component';
import { CoreUserClaimGroupDetailListComponent } from './group-detail/list/list.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CoreUserClaimContentListComponent } from './content/list/list.component';
import { CoreUserClaimContentAddComponent } from './content/add/add.component';
import { CoreUserClaimContentEditComponent } from './content/edit/edit.component';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { CoreUserClaimContentCheckListComponent } from './content/check-list/check-list.component';
import { CoreUserClaimTypeSelectionlistComponent } from './type/selectionlist/selectionlist.component';
import { CoreUserClaimGroupSelectionlistComponent } from './group/selectionlist/selectionlist.component';

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
