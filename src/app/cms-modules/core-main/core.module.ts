import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { CoreRoutes } from './core.routing';
import { CoreConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { CoreConfigSiteComponent } from './config/site/configSite.component';
import { CoreConfigurationService } from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreConfigCheckUserComponent } from './config/check-user/check-user.component';
import { CoreConfigCheckSiteComponent } from './config/check-site/check-site.component';

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
    CoreConfigCheckUserComponent,
    CoreConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    CoreConfigMainAdminComponent,
    CoreConfigSiteComponent,
    CoreConfigCheckUserComponent,
    CoreConfigCheckSiteComponent,
    /*Config*/
  ],
  providers: [
    CoreConfigurationService,
  ]
})
export class CoreModule { }
