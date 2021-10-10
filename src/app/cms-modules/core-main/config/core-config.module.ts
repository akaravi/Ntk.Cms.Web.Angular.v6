import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CoreConfigurationService,
  CoreModuleService,
  CoreUserGroupService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

// import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CoreConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { CoreConfigSiteComponent } from './site/configSite.component';
import { CoreConfigCheckUserComponent } from './check-user/check-user.component';
import { CoreConfigCheckSiteComponent } from './check-site/check-site.component';
import { CoreConfigRouting } from './core-config.routing';


@NgModule({
  declarations: [
    /*Config*/
    CoreConfigMainAdminComponent,
    CoreConfigSiteComponent,
    CoreConfigCheckUserComponent,
    CoreConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    CoreConfigMainAdminComponent,
    CoreConfigSiteComponent,
    CoreConfigCheckUserComponent,
    CoreConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreConfigurationService,
  ]
})
export class CoreConfigModule {
}
