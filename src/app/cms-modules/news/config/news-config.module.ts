import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CoreModuleService,
  NewsConfigurationService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NewsConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { NewsConfigSiteComponent } from './site/config-site.component';
import { NewsConfigCheckUserComponent } from './check-user/check-user.component';
import { NewsConfigCheckSiteComponent } from './check-site/check-site.component';
import { NewsConfigRouting } from './news-config.routing';
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