import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CoreModuleService,
  ContactConfigurationService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ContactConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ContactConfigSiteComponent } from './site/config-site.component';
import { ContactConfigCheckUserComponent } from './check-user/check-user.component';
import { ContactConfigCheckSiteComponent } from './check-site/check-site.component';
import { ContactConfigRouting } from './contact-config.routing';


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
