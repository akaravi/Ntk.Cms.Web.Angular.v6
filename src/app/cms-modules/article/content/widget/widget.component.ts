//**msh */
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ArticleContentService, EnumRecordStatus, FilterDataModel, FilterModel, NtkCmsApiStoreService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-article-content-widget',
  templateUrl: './widget.component.html',
})
export class ArticleContentWidgetComponent implements OnInit, OnDestroy {
  filteModelContent = new FilterModel();
  modelData = new Map<string, number>();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  indexTheme = ['symbol-light-success', 'symbol-light-warning', 'symbol-light-danger', 'symbol-light-info'];
  @Input()
  loading = new ProgressSpinnerModel();
  constructor(
    private service: ArticleContentService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
  ) {
    this.loading.cdr = this.cdr;
  }
  ngOnInit(): void {
    this.widgetInfoModel.title = 'مقالات ثبت شده';
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/article/content';

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
        if (ret.IsSuccess) {
          this.modelData.set('All', ret.TotalRowCount);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
        this.loading.Stop(this.constructor.name + 'All');
      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'All');
      }
    }
    );
    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.PropertyName = 'RecordStatus';
    fastfilter.Value = EnumRecordStatus.Available;
    filterStatist1.Filters.push(fastfilter);
    this.service.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.modelData.set('Active', ret.TotalRowCount);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
        this.loading.Stop(this.constructor.name + 'Active');
      }
      ,
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'Active');
      }
    }
    );
  }
}