import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  BlogConfigurationService, CoreModuleService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { BlogConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { BlogConfigSiteComponent } from './site/configSite.component';
import { BlogConfigCheckUserComponent } from './check-user/check-user.component';
import { BlogConfigCheckSiteComponent } from './check-site/check-site.component';
import { BlogConfigRouting } from './blog-config.routing';


@NgModule({
  declarations: [
    /*Config*/
    BlogConfigMainAdminComponent,
    BlogConfigSiteComponent,
    BlogConfigCheckUserComponent,
    BlogConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    BlogConfigMainAdminComponent,
    BlogConfigSiteComponent,
    BlogConfigCheckUserComponent,
    BlogConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    BlogConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    BlogConfigurationService,
  ]
})
export class BlogConfigModule {
}
