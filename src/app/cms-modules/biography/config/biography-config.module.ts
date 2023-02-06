import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  BiographyConfigurationService, CoreModuleService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { BiographyConfigRouting } from './biography-config.routing';
import { BiographyConfigCheckSiteComponent } from './check-site/check-site.component';
import { BiographyConfigCheckUserComponent } from './check-user/check-user.component';
import { BiographyConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { BiographyConfigSiteComponent } from './site/config-site.component';
@NgModule({
  declarations: [
    /*Config*/
    BiographyConfigMainAdminComponent,
    BiographyConfigSiteComponent,
    BiographyConfigCheckUserComponent,
    BiographyConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    BiographyConfigMainAdminComponent,
    BiographyConfigSiteComponent,
    BiographyConfigCheckUserComponent,
    BiographyConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    BiographyConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    BiographyConfigurationService,
  ]
})
export class BiographyConfigModule {
}