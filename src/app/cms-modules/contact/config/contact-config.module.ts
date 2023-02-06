import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  ContactConfigurationService, CoreModuleService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { ContactConfigCheckSiteComponent } from './check-site/check-site.component';
import { ContactConfigCheckUserComponent } from './check-user/check-user.component';
import { ContactConfigRouting } from './contact-config.routing';
import { ContactConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ContactConfigSiteComponent } from './site/config-site.component';


@NgModule({
  declarations: [
    /*Config*/
    ContactConfigMainAdminComponent,
    ContactConfigSiteComponent,
    ContactConfigCheckUserComponent,
    ContactConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    ContactConfigMainAdminComponent,
    ContactConfigSiteComponent,
    ContactConfigCheckUserComponent,
    ContactConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    ContactConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    ContactConfigurationService,
  ]
})
export class ContactConfigModule {
}
