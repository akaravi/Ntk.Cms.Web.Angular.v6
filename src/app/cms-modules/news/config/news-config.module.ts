import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  CoreModuleService,
  NewsConfigurationService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { NewsConfigCheckSiteComponent } from './check-site/check-site.component';
import { NewsConfigCheckUserComponent } from './check-user/check-user.component';
import { NewsConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { NewsConfigRouting } from './news-config.routing';
import { NewsConfigSiteComponent } from './site/config-site.component';
@NgModule({
  declarations: [
    /*Config*/
    NewsConfigMainAdminComponent,
    NewsConfigSiteComponent,
    NewsConfigCheckUserComponent,
    NewsConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    NewsConfigMainAdminComponent,
    NewsConfigSiteComponent,
    NewsConfigCheckUserComponent,
    NewsConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    NewsConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    NewsConfigurationService,
  ]
})
export class NewsConfigModule {
}