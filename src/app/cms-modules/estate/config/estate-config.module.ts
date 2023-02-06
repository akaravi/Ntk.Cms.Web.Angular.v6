import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreModuleService,
  EstateConfigurationService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { EstateConfigCheckSiteComponent } from './check-site/check-site.component';
import { EstateConfigCheckUserComponent } from './check-user/check-user.component';
import { EstateConfigRouting } from './estate-config.routing';
import { EstateConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { EstateConfigSiteComponent } from './site/config-site.component';


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
    CoreModuleService,
    EstateConfigurationService,
  ]
})
export class EstateConfigModule {
}
