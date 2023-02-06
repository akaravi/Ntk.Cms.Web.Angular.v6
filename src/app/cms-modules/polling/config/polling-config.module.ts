import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  CoreModuleService,
  PollingConfigurationService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { PollingConfigCheckSiteComponent } from './check-site/check-site.component';
import { PollingConfigCheckUserComponent } from './check-user/check-user.component';
import { PollingConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { PollingConfigRouting } from './polling-config.routing';
import { PollingConfigSiteComponent } from './site/config-site.component';


@NgModule({
  declarations: [
    /*Config*/
    PollingConfigMainAdminComponent,
    PollingConfigSiteComponent,
    PollingConfigCheckUserComponent,
    PollingConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    PollingConfigMainAdminComponent,
    PollingConfigSiteComponent,
    PollingConfigCheckUserComponent,
    PollingConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    PollingConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    PollingConfigurationService,
  ]
})
export class PollingConfigModule {
}
