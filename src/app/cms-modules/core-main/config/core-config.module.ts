import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreConfigurationService, CoreModuleService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { CoreConfigCheckSiteComponent } from './check-site/check-site.component';
import { CoreConfigCheckUserComponent } from './check-user/check-user.component';
import { CoreConfigRouting } from './core-config.routing';
import { CoreConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { CoreConfigSiteComponent } from './site/config-site.component';


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
    CoreModuleService,
    CoreConfigurationService,
  ]
})
export class CoreConfigModule {
}
