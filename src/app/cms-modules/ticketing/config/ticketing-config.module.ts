import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CoreModuleService,
  TicketingConfigurationService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { TicketingConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { TicketingConfigSiteComponent } from './site/config-site.component';
import { TicketingConfigCheckUserComponent } from './check-user/check-user.component';
import { TicketingConfigCheckSiteComponent } from './check-site/check-site.component';
import { TicketingConfigRouting } from './ticketing-config.routing';


@NgModule({
  declarations: [
    /*Config*/
    TicketingConfigMainAdminComponent,
    TicketingConfigSiteComponent,
    TicketingConfigCheckUserComponent,
    TicketingConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    TicketingConfigMainAdminComponent,
    TicketingConfigSiteComponent,
    TicketingConfigCheckUserComponent,
    TicketingConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    TicketingConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    TicketingConfigurationService,
  ]
})
export class TicketingConfigModule {
}
