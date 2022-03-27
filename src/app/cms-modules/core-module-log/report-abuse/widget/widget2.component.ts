import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EnumRecordStatus, FilterDataModel, FilterModel, CoreModuleLogReportAbuseService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-ReportAbuse-widget2',
  templateUrl: './widget2.component.html',
  styleUrls: ['./widget2.component.scss']
})
export class CoreModuleLogReportAbuseWidget2Component implements OnInit, OnDestroy {
  @Input() cssClass = '';
  @Input() widgetHeight = '200px';
  @Input() baseColor = 'success';
  @Input() iconColor = 'success';
  textInverseCSSClass;
  svgCSSClass;
  constructor(
    private service: CoreModuleLogReportAbuseService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    private translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
  }
  filteModelContent = new FilterModel();
  modelData = new Map<string, number>();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  @Input()
  loading = new ProgressSpinnerModel();
  ngOnInit() {
    this.widgetInfoModel.title = this.translate.instant('TITLE.Report_Abuse');
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/coremodulelog/report-abuse';
    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.widgetInfoModel.title = this.translate.instant('TITLE.Report_Abuse');
      this.onActionStatist();
    });
    this.cssClass = `bg-${this.baseColor} ${this.cssClass}`;
    this.textInverseCSSClass = `text-inverse-${this.baseColor}`;
    this.svgCSSClass = `svg-icon--${this.iconColor}`;
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionStatist(): void {
    this.loading.Start(this.constructor.name + 'Pending', this.translate.instant('MESSAGE.Get_pending_report_abuse'));
    this.loading.Start(this.constructor.name + 'All', this.translate.instant('MESSAGE.Get_all_report_abuse'));
    this.modelData.set('Pending', 0);
    this.modelData.set('All', 0);

    this.service.ServiceGetCount(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.modelData.set('All', next.TotalRowCount);
        }
        this.loading.Stop(this.constructor.name + 'All');
      },
      (error) => {
        this.loading.Stop(this.constructor.name + 'All');
      }
    );

    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.PropertyName = 'RecordStatus';
    fastfilter.Value = EnumRecordStatus.Pending;
    filterStatist1.Filters.push(fastfilter);

    this.service.ServiceGetCount(filterStatist1).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.modelData.set('Pending', next.TotalRowCount);
        }
        this.loading.Stop(this.constructor.name + 'Pending');
      }
      ,
      (error) => {
        this.loading.Stop(this.constructor.name + 'Pending');
      }
    );
  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
