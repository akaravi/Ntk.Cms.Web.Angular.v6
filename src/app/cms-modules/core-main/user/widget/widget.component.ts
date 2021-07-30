import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoreUserService, EnumRecordStatus, FilterDataModel, FilterModel, NtkCmsApiStoreService, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { PersianCalendarService } from 'src/app/core/pipe/PersianDatePipe/persian-date.service';

@Component({
  selector: 'app-core-user-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class CoreUserWidgetComponent implements OnInit, OnDestroy {
  tokenInfoModel = new TokenInfoModel();
  filteModelContent = new FilterModel();
  modelData = new Map<string, string>();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  indexTheme = ['symbol-light-success', 'symbol-light-warning', 'symbol-light-danger', 'symbol-light-info', 'symbol-light-info', 'symbol-light-info', 'symbol-light-info', 'symbol-light-info', 'symbol-light-info'];
  constructor(
    private service: CoreUserService,
    private cmsApiStore: NtkCmsApiStoreService,
    private persianCalendarService: PersianCalendarService
  ) { }
  ngOnInit(): void {
    this.widgetInfoModel.title = 'شما :';
    this.widgetInfoModel.description = 'خلاصه مشخصات حساب کاربری شما';
    this.widgetInfoModel.link = '/core/User';


    this.tokenInfoModel = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.tokenInfoModel = next;
      this.onActionStatist();
    });
    this.onActionStatist();
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();

  }

  onActionStatist(): void {
    if (!this.tokenInfoModel.UserId || this.tokenInfoModel.UserId <= 0) {
      return;
    }
    this.widgetInfoModel.link = '/core/user/edit/' + this.tokenInfoModel.UserId;
    this.modelData.set('Id', this.tokenInfoModel.UserId + '');
    this.modelData.set('Username', '...');
    this.modelData.set('Name', '...');
    this.modelData.set('Last Name', '...');
    this.modelData.set('Compnay', '...');
    this.modelData.set('Email', '...');
    this.modelData.set('Email Confirmed', '...');
    this.modelData.set('Mobile', '...');
    this.modelData.set('Mobile Confirmed', '...');

    this.modelData.set('Created Date', '...');
    this.modelData.set('Expire Date', '...');
    this.service.ServiceGetOneById(this.tokenInfoModel.UserId).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.modelData.set('Username', next.Item.Username);
          this.modelData.set('Name', next.Item.Name);
          this.modelData.set('Last Name', next.Item.LastName);
          this.modelData.set('Compnay', next.Item.CompanyName);
          this.modelData.set('Email', next.Item.Email);
          this.modelData.set('Email Confirmed', next.Item.EmailConfirmed + '');
          this.modelData.set('Mobile', next.Item.Mobile);
          this.modelData.set('Mobile Confirmed', next.Item.MobileConfirmed + '');

          this.modelData.set('Created Date', this.persianCalendarService.PersianCalendar(next.Item.CreatedDate));
          if (next.Item.ExpireDate) {
            this.modelData.set('Expire Date', this.persianCalendarService.PersianCalendar(next.Item.ExpireDate));
          }
        }
      },
      (error) => {
      }
    );

  }
}
