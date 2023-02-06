import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModuleLogComponent } from './core-module-log.component';
import { CoreModuleRoutes } from './core-module-log.routing';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { SharedModule } from 'src/app/shared.module';

import { CoreModuleLogContentCountService, CoreModuleLogFavoriteService, CoreModuleLogLikeService, CoreModuleLogMemoService, CoreModuleLogReportAbuseService, CoreModuleLogScoreService, CoreModuleLogSiteCreditBlockedService, CoreModuleLogSiteUserCreditBlockedService, CoreModuleService, CoreModuleSiteCreditService, CoreModuleSiteUserCreditService, CoreModuleTagCategoryService, CoreModuleTagService } from 'ntk-cms-api';
import { CoreModuleLogContentCountEditComponent } from './content-count/edit/edit.component';
import { CoreModuleLogContentCountListComponent } from './content-count/list/list.component';
import { CoreModuleLogContentCountViewComponent } from './content-count/view/view.component';
import { CoreModuleLogFavoriteEditComponent } from './favorite/edit/edit.component';
import { CoreModuleLogFavoriteListComponent } from './favorite/list/list.component';
import { CoreModuleLogFavoriteViewComponent } from './favorite/view/view.component';
import { CoreModuleLogLikeEditComponent } from './like/edit/edit.component';
import { CoreModuleLogLikeListComponent } from './like/list/list.component';
import { CoreModuleLogLikeViewComponent } from './like/view/view.component';
import { CoreModuleLogMemoAddComponent } from './memo/add/add.component';
import { CoreModuleLogMemoEditComponent } from './memo/edit/edit.component';
import { CoreModuleLogMemoListComponent } from './memo/list/list.component';
import { CoreModuleLogMemoViewComponent } from './memo/view/view.component';
import { CoreModuleLogReportAbuseEditComponent } from './report-abuse/edit/edit.component';
import { CoreModuleLogReportAbuseListComponent } from './report-abuse/list/list.component';
import { CoreModuleLogReportAbuseViewComponent } from './report-abuse/view/view.component';
import { CoreModuleLogScoreEditComponent } from './score/edit/edit.component';
import { CoreModuleLogScoreListComponent } from './score/list/list.component';
import { CoreModuleLogScoreViewComponent } from './score/view/view.component';
import { CoreModuleLogSiteCreditBlockedEditComponent } from './site-credit-blocked/edit/edit.component';
import { CoreModuleLogSiteCreditBlockedListComponent } from './site-credit-blocked/list/list.component';
import { CoreModuleLogSiteCreditBlockedViewComponent } from './site-credit-blocked/view/view.component';
import { CoreModuleLogSiteUserCreditBlockedEditComponent } from './site-user-credit-blocked/edit/edit.component';
import { CoreModuleLogSiteUserCreditBlockedListComponent } from './site-user-credit-blocked/list/list.component';
import { CoreModuleLogSiteUserCreditBlockedViewComponent } from './site-user-credit-blocked/view/view.component';



@NgModule({
  imports: [
    CoreModuleRoutes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule.forRoot(),
    AngularEditorModule,

    CmsFileManagerModule
  ],
  declarations: [
    CoreModuleLogComponent,
    /**Memo */
    CoreModuleLogMemoListComponent,
    CoreModuleLogMemoEditComponent,
    CoreModuleLogMemoAddComponent,
    CoreModuleLogMemoViewComponent,
    /**ReportAbuse */
    CoreModuleLogReportAbuseListComponent,
    CoreModuleLogReportAbuseEditComponent,
    CoreModuleLogReportAbuseViewComponent,
    /**Favorite */
    CoreModuleLogFavoriteListComponent,
    CoreModuleLogFavoriteEditComponent,
    CoreModuleLogFavoriteViewComponent,
    /**ContentCount */
    CoreModuleLogContentCountListComponent,
    CoreModuleLogContentCountEditComponent,
    CoreModuleLogContentCountViewComponent,
    /**Like */
    CoreModuleLogLikeListComponent,
    CoreModuleLogLikeEditComponent,
    CoreModuleLogLikeViewComponent,
    /**score */
    CoreModuleLogScoreListComponent,
    CoreModuleLogScoreEditComponent,
    CoreModuleLogScoreViewComponent,
    /**SiteCreditBlocked */
    CoreModuleLogSiteCreditBlockedListComponent,
    CoreModuleLogSiteCreditBlockedEditComponent,
    CoreModuleLogSiteCreditBlockedViewComponent,
    /**SiteUserCreditBlocked */
    CoreModuleLogSiteUserCreditBlockedListComponent,
    CoreModuleLogSiteUserCreditBlockedEditComponent,
    CoreModuleLogSiteUserCreditBlockedViewComponent,
  ],
  exports: [
    CoreModuleLogComponent,
    /**Memo */
    CoreModuleLogMemoListComponent,
    CoreModuleLogMemoEditComponent,
    CoreModuleLogMemoAddComponent,
    CoreModuleLogMemoViewComponent,
    /**ReportAbuse */
    CoreModuleLogReportAbuseListComponent,
    CoreModuleLogReportAbuseEditComponent,
    CoreModuleLogReportAbuseViewComponent,
    /**Favorite */
    CoreModuleLogFavoriteListComponent,
    CoreModuleLogFavoriteEditComponent,
    CoreModuleLogFavoriteViewComponent,
    /**ContentCount */
    CoreModuleLogContentCountListComponent,
    CoreModuleLogContentCountEditComponent,
    CoreModuleLogContentCountViewComponent,
    /**Like */
    CoreModuleLogLikeListComponent,
    CoreModuleLogLikeEditComponent,
    CoreModuleLogLikeViewComponent,
    /**score */
    CoreModuleLogScoreListComponent,
    CoreModuleLogScoreEditComponent,
    CoreModuleLogScoreViewComponent,
    /**SiteCreditBlocked */
    CoreModuleLogSiteCreditBlockedListComponent,
    CoreModuleLogSiteCreditBlockedEditComponent,
    CoreModuleLogSiteCreditBlockedViewComponent,
    /**SiteUserCreditBlocked */
    CoreModuleLogSiteUserCreditBlockedListComponent,
    CoreModuleLogSiteUserCreditBlockedEditComponent,
    CoreModuleLogSiteUserCreditBlockedViewComponent,
  ],
  providers: [
    CoreModuleService,
    CoreModuleTagService,
    CoreModuleTagCategoryService,
    CoreModuleSiteCreditService,
    CoreModuleSiteUserCreditService,
    CoreModuleLogFavoriteService,
    CoreModuleLogContentCountService,
    CoreModuleLogLikeService,
    CoreModuleLogMemoService,
    CoreModuleLogReportAbuseService,
    CoreModuleLogScoreService,
    CoreModuleLogSiteCreditBlockedService,
    CoreModuleLogSiteUserCreditBlockedService,
  ]
})
export class CoreModuleLogModule { }
