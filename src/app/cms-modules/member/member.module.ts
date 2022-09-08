import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberComponent } from './member.component';
import { MemberRoutes } from './member.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

import {
  CoreAuthService,
  CoreEnumService,
  ApplicationEnumService,
  CoreModuleTagService,
  CoreModuleService,
  MemberConfigurationService,
  MemberUserSiteService,
  MemberUserSearchAliasService,
  MemberUserGroupService,
  MemberUserService,
  MemberPropertyTypeSiteService,
  MemberPropertyTypeService,
  MemberPropertySiteService,
  MemberPropertyDetailGroupService,
  MemberPropertyDetailValueService,
  MemberPropertyDetailService,
  MemberPropertyService,
  MemberPropertyAliasService,
  MemberHistoryService,
  MemberGroupService
} from 'ntk-cms-api';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { MemberGroupListComponent } from './group/list/list.component';
import { MemberGroupAddComponent } from './group/add/add.component';
import { MemberGroupEditComponent } from './group/edit/edit.component';
import { MemberGroupDeleteComponent } from './group/delete/delete.component';
import { MemberGroupSelectorComponent } from './group/selector/selector.component';
import { MemberGroupHeaderComponent } from './group/header/header.component';
import { MemberGroupTreeComponent } from './group/tree/tree.component';
@NgModule({
  declarations: [
    MemberComponent,
    /* */
    MemberGroupListComponent,
    MemberGroupAddComponent,
    MemberGroupEditComponent,
    MemberGroupDeleteComponent,
    MemberGroupHeaderComponent,
    MemberGroupSelectorComponent,
    MemberGroupTreeComponent,
    /* */
  ],
  imports: [
    CommonModule,
    MemberRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,

    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    CoreAuthService,
    /*Config*/
    MemberConfigurationService,
    /*Config*/
    /** */
    MemberGroupService,
    MemberHistoryService,
    MemberPropertyService,
    MemberPropertyAliasService,
    MemberPropertyDetailService,
    MemberPropertyDetailGroupService,
    MemberPropertyDetailValueService,
    MemberPropertySiteService,
    MemberPropertyTypeService,
    MemberPropertyTypeSiteService,
    MemberUserService,
    MemberUserGroupService,
    MemberUserSearchAliasService,
    MemberUserSiteService,
    /** */
    CmsConfirmationDialogService,
    ApplicationEnumService,
    CoreModuleTagService,

  ]
})
export class MemberModule { }