import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CoreModuleService,
  LinkManagementConfigurationService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LinkManagementConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { LinkManagementConfigSiteComponent } from './site/config-site.component';
import { LinkManagementConfigCheckUserComponent } from './check-user/check-user.component';
import { LinkManagementConfigCheckSiteComponent } from './check-site/check-site.component';
import { LinkManagementConfigRouting } from './link-management-config.routing';


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
