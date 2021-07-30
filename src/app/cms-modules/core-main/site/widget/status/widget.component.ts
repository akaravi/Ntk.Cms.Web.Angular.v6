import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AuthRenewTokenModel,
  CoreAuthService,
  CoreSiteModel,
  CoreSiteService,
  FilterModel,
  NtkCmsApiStoreService,
  TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { PersianCalendarService } from 'src/app/core/pipe/PersianDatePipe/persian-date.service';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-site-widget-status',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class CoreSiteWidgetStatusComponent implements OnInit, OnDestroy {
  tokenInfoModel = new TokenInfoModel();
  filteModelContent = new FilterModel();
  modelData = new Map<string, string>();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  indexTheme = ['symbol-light-success', 'symbol-light-warning', 'symbol-light-danger', 'symbol-light-info', 'symbol-light-info', 'symbol-light-info'];
  constructor(
    private service: CoreSiteService,
    private cmsApiStore: NtkCmsApiStoreService,
    private persianCalendarService: PersianCalendarService,
    private cmsToastrService: CmsToastrService,
    private coreAuthService: CoreAuthService,
  ) { }
  ngOnInit(): void {
    this.widgetInfoModel.title = 'سامانه فعال :';
    this.widgetInfoModel.description = 'خلاصه مشخصات حساب این سامانه ';
    this.widgetInfoModel.link = '/core/site';

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
    if (!this.tokenInfoModel.SiteId || this.tokenInfoModel.SiteId <= 0) {
      return;
    }
    this.widgetInfoModel.link = '/core/site/edit/' + this.tokenInfoModel.SiteId;
    this.modelData.set('Id', this.tokenInfoModel.SiteId + '');
    this.modelData.set('Title', '...');
    this.modelData.set('Domain', '...');
    this.modelData.set('Sub Domain', '...');
    this.modelData.set('Created Date', '...');
    this.modelData.set('Expire Date', '...');
    this.service.ServiceGetOneById(this.tokenInfoModel.SiteId).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.modelData.set('Title', next.Item.Title);
          this.modelData.set('Domain', next.Item.Domain);
          this.modelData.set('Sub Domain', next.Item.SubDomain);
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
  onActionSiteSelect(model: CoreSiteModel): void {
    if (model && model.Id > 0) {
      // this.inputSiteId = model.Id;
      if (model.Id !== this.tokenInfoModel.SiteId) {
        if (model.Id === this.tokenInfoModel.SiteId) {
          const etitle = 'هشدار';
          const emessage = 'شناسه این وب سایت با وب سایتی که در آن هستید یکسان است';
          this.cmsToastrService.toastr.warning(emessage, etitle);
          return;
        }
        const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
        authModel.UserAccessAdminAllowToProfessionalData = this.tokenInfoModel.UserAccessAdminAllowToProfessionalData;
        authModel.UserAccessAdminAllowToAllData = this.tokenInfoModel.UserAccessAdminAllowToAllData;
        authModel.UserId = this.tokenInfoModel.UserId;
        authModel.SiteId = model.Id;
        authModel.Lang = this.tokenInfoModel.Language;

        const title = 'اطلاعات ';
        const message = 'درخواست تغییر سایت به سرور ارسال شد';
        this.cmsToastrService.toastr.info(message, title);
        this.coreAuthService.ServiceRenewToken(authModel).subscribe(
          (next) => {
            if (next.IsSuccess) {
              if (next.Item.SiteId === +model.Id) {
                this.cmsToastrService.toastr.success('دسترسی به سایت جدید تایید شد', title);

              } else {
                this.cmsToastrService.toastr.warning('دسترسی به سایت جدید تایید نشد', title);
              }
            } else {
              this.cmsToastrService.typeErrorAccessChange(next.ErrorMessage);
            }

          },
          (error) => {
            this.cmsToastrService.typeErrorAccessChange(error);
          }
        );
      }
    }
  }
}
