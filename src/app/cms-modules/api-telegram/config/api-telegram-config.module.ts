import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApiTelegramConfigurationService, CoreModuleService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ApiTelegramConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ApiTelegramConfigSiteComponent } from './site/config-site.component';
import { ApiTelegramConfigCheckUserComponent } from './check-user/check-user.component';
import { ApiTelegramConfigCheckSiteComponent } from './check-site/check-site.component';
import { ApiTelegramConfigRouting } from './api-telegram-config.routing';
import { ApiTelegramBotConfigAddComponent } from '../bot-config/add/add.component';
import { ApiTelegramBotConfigEditComponent } from '../bot-config/edit/edit.component';
import { ApiTelegramBotConfigListComponent } from '../bot-config/list/list.component';
@NgModule({
  declarations: [
    /*Config*/
    ApiTelegramConfigMainAdminComponent,
    ApiTelegramConfigSiteComponent,
    ApiTelegramConfigCheckUserComponent,
    ApiTelegramConfigCheckSiteComponent,
    /*Config*/
    ApiTelegramBotConfigListComponent,
    ApiTelegramBotConfigAddComponent,
    ApiTelegramBotConfigEditComponent,
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
