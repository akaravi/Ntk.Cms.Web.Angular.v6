import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ChartConfigurationService, CoreModuleService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { ChartConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { ChartConfigSiteComponent } from './site/configSite.component';
import { ChartConfigCheckUserComponent } from './check-user/check-user.component';
import { ChartConfigCheckSiteComponent } from './check-site/check-site.component';
import { ChartConfigRouting } from './chart-config.routing';


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
