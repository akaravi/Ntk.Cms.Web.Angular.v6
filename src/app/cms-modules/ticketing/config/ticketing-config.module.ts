import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  TicketingConfigurationService,
  CoreModuleService,
  CoreUserGroupService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

// import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { TicketingConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { TicketingConfigSiteComponent } from './site/configSite.component';
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
    TicketingConfigurationService,
  ]
})
export class TicketingConfigModule {
}
