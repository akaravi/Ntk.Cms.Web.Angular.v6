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
import { MemberPropertyAliasAddComponent } from './property-alias/add/add.component';
import { MemberPropertyAliasDeleteComponent } from './property-alias/delete/delete.component';
import { MemberPropertyAliasEditComponent } from './property-alias/edit/edit.component';
import { MemberPropertyAliasHeaderComponent } from './property-alias/header/header.component';
import { MemberPropertyAliasTreeComponent } from './property-alias/tree/tree.component';
import { MemberPropertyAliasListComponent } from './property-alias/list/list.component';
import { MemberPropertyAliasSelectorComponent } from './property-alias/selector/selector.component';
import { MemberPropertyDetailGroupAddComponent } from './property-detail-group/add/add.component';
import { MemberPropertyDetailGroupEditComponent } from './property-detail-group/edit/edit.component';
import { MemberPropertyDetailGroupListComponent } from './property-detail-group/list/list.component';
import { MemberPropertyDetailGroupSelectorComponent } from './property-detail-group/selector/selector.component';
import { MemberPropertyDetailGroupTreeComponent } from './property-detail-group/tree/tree.component';
import { IconPickerModule } from 'ngx-icon-picker';
import { MemberPropertyDetailAddComponent } from './property-detail/add/add.component';
import { MemberPropertyDetailEditComponent } from './property-detail/edit/edit.component';
import { MemberPropertyDetailListComponent } from './property-detail/list/list.component';
import { MemberPropertyDetailSelectorComponent } from './property-detail/selector/selector.component';
import { MemberPropertyDetailTreeComponent } from './property-detail/tree/tree.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
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
    MemberPropertyAliasListComponent,
    MemberPropertyAliasAddComponent,
    MemberPropertyAliasEditComponent,
    MemberPropertyAliasDeleteComponent,
    MemberPropertyAliasHeaderComponent,
    MemberPropertyAliasSelectorComponent,
    MemberPropertyAliasTreeComponent,
    /* */
    MemberPropertyDetailGroupListComponent,
    MemberPropertyDetailGroupAddComponent,
    MemberPropertyDetailGroupEditComponent,
    MemberPropertyDetailGroupSelectorComponent,
    MemberPropertyDetailGroupTreeComponent,
    /* */
    MemberPropertyDetailListComponent,
    MemberPropertyDetailAddComponent,
    MemberPropertyDetailEditComponent,
    MemberPropertyDetailSelectorComponent,
    MemberPropertyDetailTreeComponent,
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
    IconPickerModule,
    InlineSVGModule,
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