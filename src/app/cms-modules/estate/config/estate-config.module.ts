import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  EstateConfigurationService,
  CoreModuleService,
  CoreUserGroupService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

// import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { EstateConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { EstateConfigSiteComponent } from './site/configSite.component';
import { EstateConfigCheckUserComponent } from './check-user/check-user.component';
import { EstateConfigCheckSiteComponent } from './check-site/check-site.component';
import { EstateConfigRouting } from './estate-config.routing';


@NgModule({
  declarations: [
    /*Config*/
    EstateConfigMainAdminComponent,
    EstateConfigSiteComponent,
    EstateConfigCheckUserComponent,
    EstateConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    EstateConfigMainAdminComponent,
    EstateConfigSiteComponent,
    EstateConfigCheckUserComponent,
    EstateConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    EstateConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    EstateConfigurationService,
  ]
})
export class EstateConfigModule {
}
