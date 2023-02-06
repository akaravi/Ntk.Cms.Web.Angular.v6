import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  ArticleConfigurationService, CoreModuleService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { ArticleConfigRouting } from './article-config.routing';
import { ArticleConfigCheckSiteComponent } from './check-site/check-site.component';
import { ArticleConfigCheckUserComponent } from './check-user/check-user.component';
import { ArticleConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ArticleConfigSiteComponent } from './site/config-site.component';
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