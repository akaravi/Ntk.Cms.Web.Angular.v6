import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CoreConfigurationService, CoreModuleService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { CoreConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { CoreConfigSiteComponent } from './site/config-site.component';
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
    CoreModuleService,
    CoreConfigurationService,
  ]
})
export class CoreConfigModule {
}
