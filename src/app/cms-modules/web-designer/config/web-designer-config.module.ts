import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CoreModuleService,
  WebDesignerConfigurationService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { WebDesignerConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { WebDesignerConfigSiteComponent } from './site/config-site.component';
import { WebDesignerConfigCheckUserComponent } from './check-user/check-user.component';
import { WebDesignerConfigCheckSiteComponent } from './check-site/check-site.component';
import { WebDesignerConfigRouting } from './web-designer-config.routing';
@NgModule({
  declarations: [
    /*Config*/
    WebDesignerConfigMainAdminComponent,
    WebDesignerConfigSiteComponent,
    WebDesignerConfigCheckUserComponent,
    WebDesignerConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    WebDesignerConfigMainAdminComponent,
    WebDesignerConfigSiteComponent,
    WebDesignerConfigCheckUserComponent,
    WebDesignerConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    WebDesignerConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    WebDesignerConfigurationService,
  ]
})
export class WebDesignerConfigModule {
}