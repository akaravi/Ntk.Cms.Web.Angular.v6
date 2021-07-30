import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { CoreRoutes } from './core.routing';
import { CoreConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { CoreConfigSiteComponent } from './config/site/configSite.component';
import { CoreConfigurationService } from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CoreRoutes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
  ],
  declarations: [
    CoreComponent,
    /*Config*/
    CoreConfigMainAdminComponent,
    CoreConfigSiteComponent,
    /*Config*/
  ],
  providers: [
    CoreConfigurationService,
  ]
})
export class CoreModule { }
