import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CoreSiteService, EnumRecordStatus, FilterDataModel, FilterModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-core-site-widget-count2',
  templateUrl: './widget2.component.html',
  styleUrls: ['./widget2.component.scss']
})

export class CoreSiteWidgetCount2Component implements OnInit, OnDestroy {
  @Input() cssClass = '';
  @Input() widgetHeight = '200px';
  @Input() baseColor = 'success';
  @Input() iconColor = 'success';
  textInverseCSSClass;
  svgCSSClass;
  constructor(
    private service: CoreSiteService,
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
    this.widgetInfoModel.title = this.translate.instant('TITLE.Registered_MemberSite');
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/core/site/list';

    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
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
    this.loading.Start(this.constructor.name + 'Active','دریافت سایت های عضو فعال');
    this.loading.Start(this.constructor.name + 'All','دریافت همه ی سایت های عضو');
    this.modelData.set('Active', 0);
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
    fastfilter.Value = EnumRecordStatus.Available;
    filterStatist1.Filters.push(fastfilter);
    this.service.ServiceGetCount(filterStatist1).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.modelData.set('Active', next.TotalRowCount);
        }
        this.loading.Stop(this.constructor.name + 'Active');

      }
      ,
      (error) => {
        this.loading.Stop(this.constructor.name + 'Active');

      }
    );
  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
