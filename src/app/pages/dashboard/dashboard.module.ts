import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardsModule } from '../../_metronic/partials/content/dashboards/dashboards.module';
import { NewsContentWidgetComponent } from 'src/app/cms-modules/news/content/widget/widget.component';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ApplicationAppWidgetComponent } from 'src/app/cms-modules/application/content/widget/widget.component';
import { ApplicationMemberInfoWidgetComponent } from 'src/app/cms-modules/application/memberInfo/widget/widget.component';
import { ChartContentWidgetComponent } from 'src/app/cms-modules/chart/content/widget/widget.component';
import { ArticleContentWidgetComponent } from 'src/app/cms-modules/article/content/widget/widget.component';
import { CoreSiteWidgetCountComponent } from 'src/app/cms-modules/core-main/site/widget/count/widget.component';
import { CoreSiteWidgetStatusComponent } from 'src/app/cms-modules/core-main/site/widget/status/widget.component';
import { CoreSiteWidgetModuleComponent } from 'src/app/cms-modules/core-main/site/widget/module/widget.component';
import { CoreUserWidgetComponent } from 'src/app/cms-modules/core-main/user/widget/widget.component';
import {
  ApplicationAppService,
  ApplicationMemberInfoService,
  ArticleContentService,
  ChartContentService,
  CoreSiteService,
  CoreUserService,
  NewsContentService
} from 'ntk-cms-api';

@NgModule({
  declarations: [
    DashboardComponent,
    ApplicationAppWidgetComponent,
    ApplicationMemberInfoWidgetComponent,
    NewsContentWidgetComponent,
    ChartContentWidgetComponent,
    ArticleContentWidgetComponent,
    CoreSiteWidgetCountComponent,
    CoreSiteWidgetStatusComponent,
    CoreSiteWidgetModuleComponent,
    CoreUserWidgetComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    DashboardsModule,
  ],
  providers: [
    PublicHelper,
    ApplicationAppService,
    ApplicationMemberInfoService,
    NewsContentService,
    ChartContentService,
    ArticleContentService,
    CoreSiteService,
    CoreUserService,
  ]
})
export class DashboardModule { }
