import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CoreModuleService,
  PollingConfigurationService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PollingConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { PollingConfigSiteComponent } from './site/config-site.component';
import { PollingConfigCheckUserComponent } from './check-user/check-user.component';
import { PollingConfigCheckSiteComponent } from './check-site/check-site.component';
import { PollingConfigRouting } from './polling-config.routing';


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
