import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EstatePropertyService, EnumRecordStatus, FilterDataModel, FilterModel, NtkCmsApiStoreService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';

@Component({
  selector: 'app-estate-property-widget-add',
  templateUrl: './widget-add.component.html',
  styleUrls: ['./widget-add.component.scss']
})

export class EstatePropertyWidgetAddComponent implements OnInit, OnDestroy {
  @Input() cssClass = '';

  constructor(
    private service: EstatePropertyService,
    private cmsApiStore: NtkCmsApiStoreService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
  ) {
    this.loading.cdr = this.cdr;
   }
  filteModelContent = new FilterModel();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
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
    this.loading.Start(this.constructor.name + 'All');
    this.service.ServiceGetCount(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.rowExist = true;
          this.widgetInfoModel.title = 'ملک جدید اضافه کنید';
          this.widgetInfoModel.description = 'تعداد املاک ثبت شده : '+next.TotalRowCount;
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

  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
