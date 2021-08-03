import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardsModule } from '../../_metronic/partials/content/dashboards/dashboards.module';
import { NewsContentWidgetComponent } from 'src/app/cms-modules/news/content/widget/widget.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NewsContentWidgetComponent
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
})
export class DashboardModule {}
