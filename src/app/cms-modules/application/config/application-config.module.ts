import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ApplicationConfigurationService, CoreModuleService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { ApplicationConfigRouting } from './application-config.routing';
import { ApplicationConfigCheckSiteComponent } from './check-site/check-site.component';
import { ApplicationConfigCheckUserComponent } from './check-user/check-user.component';
import { ApplicationConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ApplicationConfigSiteComponent } from './site/config-site.component';


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
    CoreModuleService,
    ApplicationConfigurationService,
  ]
})
export class ApplicationConfigModule {
}
