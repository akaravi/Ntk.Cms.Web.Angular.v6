import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EnumFilterDataModelSearchTypes, EnumRecordStatus, EstatePropertyService, FilterDataModel, FilterModel, NtkCmsApiStoreService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-estate-property-widget-add',
  templateUrl: './widget-add.component.html',
  styleUrls: ['./widget-add.component.scss']
})

export class EstatePropertyWidgetAddComponent implements OnInit, OnDestroy {
  @Input() cssClass = '';

  constructor(
    private service: EstatePropertyService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    private translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
  }
  modelData = new Map<string, number>();

  filteModelContent = new FilterModel();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  @Input()
  loading = new ProgressSpinnerModel();
  rowExist = false;
  ngOnInit() {
    this.widgetInfoModel.title = 'بررسی املاک ثبت شده';
    this.widgetInfoModel.description = 'معرفی املاک شما';
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
    this.loading.Start(this.constructor.name + 'All','لیست املاک');
    this.loading.Start(this.constructor.name + 'InChecking','املاک نیاز به تایید');
    this.service.ServiceGetCount(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.rowExist = true;
          this.widgetInfoModel.title = this.translate.instant('TITLE.Add_Property');
          this.widgetInfoModel.description =  this.translate.instant('TITLE.Number_Registered_Property') + ' : ' + next.TotalRowCount;
          this.widgetInfoModel.link = '/estate/property/add';
        }
        else {
          this.widgetInfoModel.title = 'اولین ملک خود را ثبت کنید';
          this.widgetInfoModel.link = '/estate/property/add';
        }
        this.loading.Stop(this.constructor.name + 'All');

      },
      (error) => {
        this.widgetInfoModel.title = 'املاک جدید اضافه کنید';
        this.widgetInfoModel.link = '/estate/property/add';
        this.loading.Stop(this.constructor.name + 'All');
      }
    );
    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.PropertyName = 'RecordStatus';
    fastfilter.Value = EnumRecordStatus.Available;
    fastfilter.SearchType = EnumFilterDataModelSearchTypes.NotEqual;
    filterStatist2.Filters.push(fastfilter);
    this.service.ServiceGetCount(filterStatist2).subscribe(
      (next) => {
        if (next.IsSuccess) {
          if (next.TotalRowCount > 0) {
            this.modelData.set('InChecking', next.TotalRowCount);
          }
          else {
            this.modelData.delete('InChecking');
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
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
