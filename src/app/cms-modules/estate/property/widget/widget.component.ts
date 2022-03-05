import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EstatePropertyService, EnumRecordStatus, FilterDataModel, FilterModel, NtkCmsApiStoreService, EnumFilterDataModelSearchTypes, EnumManageUserAccessDataTypes } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';

@Component({
  selector: 'app-estate-property-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class EstatePropertyWidgetComponent implements OnInit, OnDestroy {
  filteModelContent = new FilterModel();
  modelData = new Map<string, number>();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  indexTheme = ['symbol-light-success', 'symbol-light-warning', 'symbol-light-danger', 'symbol-light-info'];
  @Input()
  loading = new ProgressSpinnerModel();

  constructor(
    private service: EstatePropertyService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
  ) {
    this.loading.cdr = this.cdr;
  }
  ngOnInit(): void {
    this.widgetInfoModel.title = 'املاک های ثبت شده';
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/estate/property';

    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.onActionStatist();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();

  }

  onActionStatist(): void {
    this.loading.Start(this.constructor.name + 'InChecking');
    this.loading.Start(this.constructor.name + 'Active');
    this.loading.Start(this.constructor.name + 'All');
    this.modelData.set('InChecking', 0);
    this.modelData.set('Active', 0);
    this.modelData.set('All', 1);
    this.service.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
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
    let fastfilter = new FilterDataModel();
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
    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    fastfilter = new FilterDataModel();
    fastfilter.PropertyName = 'RecordStatus';
    fastfilter.Value = EnumRecordStatus.Available;
    fastfilter.SearchType = EnumFilterDataModelSearchTypes.NotEqual;
    filterStatist2.Filters.push(fastfilter);
    this.service.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
    this.service.ServiceGetCount(filterStatist2).subscribe(
      (next) => {
        if (next.IsSuccess) {
          if (next.TotalRowCount > 0) {
            this.modelData.set('InChecking', next.TotalRowCount);
            this.widgetInfoModel.link = '/estate/property/InChecking/true';
          }
          else {
            this.modelData.delete('InChecking');
            this.widgetInfoModel.link = '/estate/property';
          }
        }
        this.loading.Stop(this.constructor.name + 'InChecking');
      }
      ,
      (error) => {
        this.loading.Stop(this.constructor.name + 'InChecking');
      }
    );
  }
}
