import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ChartConfigurationService, CoreModuleService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { ChartConfigRouting } from './chart-config.routing';
import { ChartConfigCheckSiteComponent } from './check-site/check-site.component';
import { ChartConfigCheckUserComponent } from './check-user/check-user.component';
import { ChartConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ChartConfigSiteComponent } from './site/config-site.component';


@NgModule({
  declarations: [
    /*Config*/
    ChartConfigMainAdminComponent,
    ChartConfigSiteComponent,
    ChartConfigCheckUserComponent,
    ChartConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    ChartConfigMainAdminComponent,
    ChartConfigSiteComponent,
    ChartConfigCheckUserComponent,
    ChartConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChartConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    ChartConfigurationService,
  ]
})
export class ChartConfigModule {
}
