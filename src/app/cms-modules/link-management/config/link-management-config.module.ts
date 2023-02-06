import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  CoreModuleService,
  LinkManagementConfigurationService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { LinkManagementConfigCheckSiteComponent } from './check-site/check-site.component';
import { LinkManagementConfigCheckUserComponent } from './check-user/check-user.component';
import { LinkManagementConfigRouting } from './link-management-config.routing';
import { LinkManagementConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { LinkManagementConfigSiteComponent } from './site/config-site.component';


@NgModule({
  declarations: [
    /*Config*/
    LinkManagementConfigMainAdminComponent,
    LinkManagementConfigSiteComponent,
    LinkManagementConfigCheckUserComponent,
    LinkManagementConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    LinkManagementConfigMainAdminComponent,
    LinkManagementConfigSiteComponent,
    LinkManagementConfigCheckUserComponent,
    LinkManagementConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    LinkManagementConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    LinkManagementConfigurationService,
  ]
})
export class LinkManagementConfigModule {
}
