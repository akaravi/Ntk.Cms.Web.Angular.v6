
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnumRecordStatus, FilterDataModel, FilterModel, NewsCommentService, NewsContentService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
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
    private cmsToastrService: CmsToastrService,
    private serviceComment: NewsCommentService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  ngOnInit(): void {
    this.widgetInfoModel.title = this.translate.instant('TITLE.Registered_News');
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
    this.service.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.modelData.set('All', ret.totalRowCount);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }

      },
      error: (er) => {
      }
    }
    );
    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'RecordStatus';
    fastfilter.value = EnumRecordStatus.Available;
    filterStatist1.filters.push(fastfilter);
    this.service.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.modelData.set('Active', ret.totalRowCount);
        }
        this.loading.Stop(this.constructor.name + 'Active');
      }
      ,
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'Active');
      }
    }
    );
    /**Comment */
    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter2 = new FilterDataModel();
    fastfilter2.propertyName = 'RecordStatus';
    fastfilter2.value = EnumRecordStatus.Pending;
    filterStatist2.filters.push(fastfilter2);
    this.loading.Start(this.constructor.name + 'Pending_Comment');
    this.modelData.set('Pending_Comment', 0);
    this.serviceComment.ServiceGetCount(filterStatist2).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.modelData.set('Pending_Comment', ret.totalRowCount);
        }
        this.loading.Stop(this.constructor.name + 'Pending_Comment');
      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'Pending_Comment');
      }
    }
    );
  }
}
