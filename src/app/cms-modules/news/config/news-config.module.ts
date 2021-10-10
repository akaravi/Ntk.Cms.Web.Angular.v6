import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NewsConfigurationService,
  CoreModuleService,
  CoreUserGroupService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

// import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { NewsConfigMainAdminComponent } from './mainAdmin/configMainAdmin.component';
import { NewsConfigSiteComponent } from './site/configSite.component';
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
    NewsConfigurationService,
  ]
})
export class NewsConfigModule {
}
