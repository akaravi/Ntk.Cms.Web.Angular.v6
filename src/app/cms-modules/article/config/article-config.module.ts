import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ArticleConfigurationService, CoreModuleService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ArticleConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ArticleConfigSiteComponent } from './site/config-site.component';
import { ArticleConfigCheckUserComponent } from './check-user/check-user.component';
import { ArticleConfigCheckSiteComponent } from './check-site/check-site.component';
import { ArticleConfigRouting } from './article-config.routing';

@NgModule({
  declarations: [
    /*Config*/
    ArticleConfigMainAdminComponent,
    ArticleConfigSiteComponent,
    ArticleConfigCheckUserComponent,
    ArticleConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    ArticleConfigMainAdminComponent,
    ArticleConfigSiteComponent,
    ArticleConfigCheckUserComponent,
    ArticleConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    ArticleConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    ArticleConfigurationService,
  ]
})
export class ArticleConfigModule {
}
