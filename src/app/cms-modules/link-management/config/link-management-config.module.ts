import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  LinkManagementConfigurationService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LinkManagementConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { LinkManagementConfigSiteComponent } from './site/configSite.component';
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
    LinkManagementConfigurationService,
  ]
})
export class LinkManagementConfigModule {
}
