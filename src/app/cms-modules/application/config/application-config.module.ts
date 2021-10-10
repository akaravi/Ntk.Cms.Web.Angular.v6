import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ApplicationConfigurationService,
  CoreModuleService,
  CoreUserGroupService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

// import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { ApplicationConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { ApplicationConfigSiteComponent } from './site/configSite.component';
import { ApplicationConfigCheckUserComponent } from './check-user/check-user.component';
import { ApplicationConfigCheckSiteComponent } from './check-site/check-site.component';
import { ApplicationConfigRouting } from './application-config.routing';


@NgModule({
  declarations: [
    /*Config*/
    ApplicationConfigMainAdminComponent,
    ApplicationConfigSiteComponent,
    ApplicationConfigCheckUserComponent,
    ApplicationConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    ApplicationConfigMainAdminComponent,
    ApplicationConfigSiteComponent,
    ApplicationConfigCheckUserComponent,
    ApplicationConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    ApplicationConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    ApplicationConfigurationService,
  ]
})
export class ApplicationConfigModule {
}
