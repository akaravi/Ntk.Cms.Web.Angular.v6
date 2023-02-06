import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  ApiTelegramConfigurationService, CoreModuleService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { ApiTelegramConfigRouting } from './api-telegram-config.routing';
import { ApiTelegramConfigCheckSiteComponent } from './check-site/check-site.component';
import { ApiTelegramConfigCheckUserComponent } from './check-user/check-user.component';
import { ApiTelegramConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ApiTelegramConfigSiteComponent } from './site/config-site.component';
@NgModule({
  declarations: [
    /*Config*/
    ApiTelegramConfigMainAdminComponent,
    ApiTelegramConfigSiteComponent,
    ApiTelegramConfigCheckUserComponent,
    ApiTelegramConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    ApiTelegramConfigMainAdminComponent,
    ApiTelegramConfigSiteComponent,
    ApiTelegramConfigCheckUserComponent,
    ApiTelegramConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    ApiTelegramConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    ApiTelegramConfigurationService,
  ]
})
export class ApiTelegramConfigModule {
}
