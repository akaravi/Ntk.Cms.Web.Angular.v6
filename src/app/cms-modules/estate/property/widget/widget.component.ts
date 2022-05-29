//**msh */
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EstatePropertyService, EnumRecordStatus, FilterDataModel, FilterModel, NtkCmsApiStoreService, EnumFilterDataModelSearchTypes, EnumManageUserAccessDataTypes } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-property-widget',
  templateUrl: './widget.component.html',
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
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
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
    this.service.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.modelData.set('All', ret.TotalRowCount);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
      },
      error: (er) => {
      }
    }
    );

    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    let fastfilter = new FilterDataModel();
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
      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'Active');
      }
    }
    );
    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    fastfilter = new FilterDataModel();
    fastfilter.PropertyName = 'RecordStatus';
    fastfilter.Value = EnumRecordStatus.Available;
    fastfilter.SearchType = EnumFilterDataModelSearchTypes.NotEqual;
    filterStatist2.Filters.push(fastfilter);
    this.service.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
    this.service.ServiceGetCount(filterStatist2).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          if (ret.TotalRowCount > 0) {
            this.modelData.set('InChecking', ret.TotalRowCount);
            this.widgetInfoModel.link = '/estate/property/InChecking/true';
          }
          else {
            this.modelData.delete('InChecking');
            this.widgetInfoModel.link = '/estate/property';
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
        this.loading.Stop(this.constructor.name + 'InChecking');
      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'InChecking');
      }
    }
    );
  }
}
