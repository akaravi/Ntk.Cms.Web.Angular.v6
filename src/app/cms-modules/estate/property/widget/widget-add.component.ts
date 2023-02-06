
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  EnumFilterDataModelSearchTypes,
  EnumManageUserAccessDataTypes, EnumRecordStatus, EstatePropertyService, FilterDataModel, FilterModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-property-widget-add',
  templateUrl: './widget-add.component.html'
})

export class EstatePropertyWidgetAddComponent implements OnInit, OnDestroy {
  @Input() cssClass = '';

  constructor(
    private service: EstatePropertyService,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  modelData = new Map<string, number>();

  filteModelContent = new FilterModel();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  @Input()
  loading = new ProgressSpinnerModel();
  rowExist = false;
  ngOnInit() {
    this.widgetInfoModel.title = this.translate.instant('TITLE.Check_registered_properties');
    this.widgetInfoModel.description = this.translate.instant('TITLE.Introduction_of_your_property');
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
    this.loading.Start(this.constructor.name + 'All', this.translate.instant('MESSAGE.property_list'));
    this.loading.Start(this.constructor.name + 'InChecking', this.translate.instant('MESSAGE.property_needs_approval'));
    this.service.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
    this.service.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.rowExist = true;
          this.widgetInfoModel.title = this.translate.instant('TITLE.Add_Property');
          this.widgetInfoModel.description = this.translate.instant('TITLE.Number_Registered_Property') + ' : ' + ret.totalRowCount;
          this.widgetInfoModel.link = '/estate/property/add';
        }
        else {
          this.widgetInfoModel.title = this.translate.instant('TITLE.Register_your_first_property');
          this.widgetInfoModel.link = '/estate/property/add';
        }
        this.loading.Stop(this.constructor.name + 'All');

      },
      error: (er) => {
        this.widgetInfoModel.title = this.translate.instant('TITLE.Add_new_properties');
        this.widgetInfoModel.link = '/estate/property/add';
        this.loading.Stop(this.constructor.name + 'All');
      }
    }
    );
    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter1 = new FilterDataModel();
    fastfilter1.propertyName = 'RecordStatus';
    fastfilter1.value = EnumRecordStatus.Available;
    fastfilter1.searchType = EnumFilterDataModelSearchTypes.NotEqual;
    filterStatist2.filters.push(fastfilter1);
    const fastfilter2 = new FilterDataModel();
    fastfilter2.propertyName = 'RecordStatus';
    fastfilter2.value = EnumRecordStatus.DeniedConfirmed;
    fastfilter2.searchType = EnumFilterDataModelSearchTypes.NotEqual;
    filterStatist2.filters.push(fastfilter2);
    this.service.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
    this.service.ServiceGetCount(filterStatist2).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          if (ret.totalRowCount > 0) {
            this.modelData.set('InChecking', ret.totalRowCount);
          }
          else {
            this.modelData.delete('InChecking');
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(this.constructor.name + 'InChecking');

      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'InChecking');
      }
    }
    );

  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
