
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreUserService, FilterModel, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { PersianCalendarService } from 'src/app/core/pipe/persian-date/persian-date.service';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-user-widget',
  templateUrl: './widget.component.html',
})
export class CoreUserWidgetComponent implements OnInit, OnDestroy {
  tokenInfoModel = new TokenInfoModel();
  filteModelContent = new FilterModel();
  modelData = new Map<string, string>();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  indexTheme = ['symbol-light-success', 'symbol-light-warning', 'symbol-light-danger', 'symbol-light-info', 'symbol-light-info', 'symbol-light-info', 'symbol-light-info', 'symbol-light-info', 'symbol-light-info'];
  @Input()
  loading = new ProgressSpinnerModel();

  constructor(
    private service: CoreUserService,
    private cmsToastrService: CmsToastrService,
    private persianCalendarService: PersianCalendarService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  ngOnInit(): void {
    this.widgetInfoModel.title = 'شما :';
    this.widgetInfoModel.description = 'خلاصه مشخصات حساب کاربری شما';
    this.widgetInfoModel.link = '/core/User';


    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfoModel = value;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfoModel = next;
      this.onActionStatist();
    });
    this.onActionStatist();
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();

  }

  onActionStatist(): void {
    if (!this.tokenInfoModel.userId || this.tokenInfoModel.userId <= 0) {
      return;
    }
    this.loading.Start(this.constructor.name + 'All');
    this.widgetInfoModel.link = '/core/user/edit/' + this.tokenInfoModel.userId;
    this.modelData.set('Id', this.tokenInfoModel.userId + '');
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
    this.service.ServiceGetOneById(this.tokenInfoModel.userId).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.modelData.set('Username', ret.item.username);
          this.modelData.set('Name', ret.item.name);
          this.modelData.set('Last Name', ret.item.lastName);
          this.modelData.set('Compnay', ret.item.companyName);
          this.modelData.set('Email', ret.item.email);
          this.modelData.set('Email Confirmed', ret.item.emailConfirmed + '');
          this.modelData.set('Mobile', ret.item.mobile);
          this.modelData.set('Mobile Confirmed', ret.item.mobileConfirmed + '');

          this.modelData.set('Created Date', this.persianCalendarService.PersianCalendar(ret.item.createdDate));
          if (ret.item.expireDate) {
            this.modelData.set('Expire Date', this.persianCalendarService.PersianCalendar(ret.item.expireDate));
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(this.constructor.name + 'All');
      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'All');
      }
    }
    );

  }
}
