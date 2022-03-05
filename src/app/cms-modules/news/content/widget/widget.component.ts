import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NewsContentService, EnumRecordStatus, FilterDataModel, FilterModel, NtkCmsApiStoreService, NewsCommentService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
@Component({
  selector: 'app-news-content-widget',
  templateUrl: './widget.component.html',
})
export class NewsContentWidgetComponent implements OnInit, OnDestroy {
  filteModelContent = new FilterModel();
  modelData = new Map<string, number>();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  indexTheme = ['symbol-light-success', 'symbol-light-warning', 'symbol-light-danger', 'symbol-light-info'];
  @Input()
  loading = new ProgressSpinnerModel();
  constructor(
    private service: NewsContentService,
    private serviceComment: NewsCommentService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
  ) {
    this.loading.cdr = this.cdr;
  }
  ngOnInit(): void {
    this.widgetInfoModel.title = 'اخبار های ثبت شده';
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/news/content';
    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.onActionStatist();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionStatist(): void {
    this.loading.Start(this.constructor.name + 'Active');
    this.loading.Start(this.constructor.name + 'All');
    this.modelData.set('Active', 0);
    this.modelData.set('All', 1);
    this.service.ServiceGetCount(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.modelData.set('All', next.TotalRowCount);
        }
      },
      (error) => {
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
    /**Comment */
    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter2 = new FilterDataModel();
    fastfilter2.PropertyName = 'RecordStatus';
    fastfilter2.Value = EnumRecordStatus.Pending;
    filterStatist2.Filters.push(fastfilter2);
    this.loading.Start(this.constructor.name + 'Pending_Comment');
    this.modelData.set('Pending_Comment', 0);
    this.serviceComment.ServiceGetCount(filterStatist2).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.modelData.set('Pending_Comment', next.TotalRowCount);
        }
        this.loading.Stop(this.constructor.name + 'Pending_Comment');
      },
      (error) => {
        this.loading.Stop(this.constructor.name + 'Pending_Comment');
      }
    );
  }
}
