import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreModuleService,
  CoreModuleSiteService,
  CoreSiteCategoryCmsModuleService,
  CoreSiteCategoryService,
  CoreSiteDomainAliasService,
  CoreSiteService,
  CoreSiteUserService,
  CoreUserService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { CoreSiteAddComponent } from './add/add.component';
import { CoreSiteAddFirstComponent } from './addFirst/addFirst.component';
import { CoreSiteComponent } from './coreSite.component';
import { CoreSiteResolver } from './coreSite.resolver';
import { CoreSiteRouting } from './coreSite.routing';
import { CoreSiteDeleteComponent } from './delete/delete.component';
import { CoreSiteEditComponent } from './edit/edit.component';
import { CoreSiteListComponent } from './list/list.component';
import { CoreSiteSelectionComponent } from './selection/selection.component';
import { CoreSiteSelectorComponent } from './selector/selector.component';
import { CoreSiteTreeComponent } from './tree/tree.component';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { ColorPickerModule } from 'ngx-color-picker';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CoreSharedModule } from '../core.shared.module';
import { CoreModuleModule } from '../module/coreModule.module';
import { CoreSiteCategoryCmsModuleModule } from '../site-category-module/coreSiteCategoryCmsModule.module';
import { CoreSiteCategoryCmsModule } from '../site-category/coreSiteCategory.module';
import { CoreUserGroupCmsModule } from '../user-group/coreUserGroup.module';
import { CoreUserModule } from '../user/coreUser.module';
import { CoreSiteModuleSiteInfoComponent } from './module-site-info/module-site-info.component';
import { CoreSiteModuleSiteOptimazeComponent } from './module-site-optimaze/module-site-optimaze.component';
import { CoreSiteModuleAddComponent } from './moduleAdd/moduleAdd.component';
import { CoreSiteModuleEditComponent } from './moduleEdit/moduleEdit.component';
import { CoreSiteModuleListComponent } from './moduleList/moduleList.component';
import { CoreSiteResellerChartComponent } from './reseller-chart/reseller-chart.component';
import { CoreSiteUserAddComponent } from './userAdd/userAdd.component';
import { CoreSiteUserEditComponent } from './userEdit/userEdit.component';
import { CoreSiteUserListComponent } from './userList/userList.component';


@NgModule({
  declarations: [
    CoreSiteComponent,
    CoreSiteAddFirstComponent,
    CoreSiteSelectionComponent,
    CoreSiteListComponent,
    CoreSiteAddComponent,
    CoreSiteEditComponent,
    CoreSiteDeleteComponent,
    CoreSiteSelectorComponent,
    CoreSiteTreeComponent,
    CoreSiteModuleListComponent,
    CoreSiteModuleAddComponent,
    CoreSiteModuleEditComponent,
    CoreSiteUserListComponent,
    CoreSiteUserAddComponent,
    CoreSiteUserEditComponent,
    CoreSiteResellerChartComponent,
    CoreSiteModuleSiteInfoComponent,
    CoreSiteModuleSiteOptimazeComponent,

  ],
  exports: [
    CoreSiteComponent,
    CoreSiteAddFirstComponent,
    CoreSiteSelectionComponent,
    CoreSiteListComponent,
    CoreSiteAddComponent,
    CoreSiteEditComponent,
    CoreSiteDeleteComponent,
    CoreSiteSelectorComponent,
    CoreSiteTreeComponent,
    CoreSiteModuleListComponent,
    CoreSiteModuleAddComponent,
    CoreSiteModuleEditComponent,
    CoreSiteUserListComponent,
    CoreSiteUserAddComponent,
    CoreSiteUserEditComponent,
    CoreSiteResellerChartComponent,
    CoreSiteModuleSiteInfoComponent,
    CoreSiteModuleSiteOptimazeComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreSiteRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,

    CoreSiteCategoryCmsModule,
    CoreSiteCategoryCmsModuleModule,
    CoreModuleModule,
    CoreUserModule,
    CoreUserGroupCmsModule,
    ColorPickerModule,
    CoreSharedModule,
  ],
  providers: [
    CoreSiteService,
    CoreSiteCategoryCmsModuleService,
    CoreModuleService,
    CoreSiteCategoryService,
    CoreSiteResolver,
    CoreModuleSiteService,
    CoreSiteDomainAliasService,
    CmsConfirmationDialogService,
    CoreUserService,
    CoreSiteUserService,
  ]
})
export class CoreSiteModule {
}
