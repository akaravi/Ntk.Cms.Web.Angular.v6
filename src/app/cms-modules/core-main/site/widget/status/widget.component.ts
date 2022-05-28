//**msh */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthRenewTokenModel,
  CoreAuthService,
  CoreSiteModel,
  CoreSiteService,
  FilterModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
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
  @Input()
  loading = new ProgressSpinnerModel();
  constructor(
    private service: CoreSiteService,
    public translate: TranslateService,
    private persianCalendarService: PersianCalendarService,
    private cmsToastrService: CmsToastrService,
    private coreAuthService: CoreAuthService,
    private tokenHelper: TokenHelper,
  ) { }
  ngOnInit(): void {
    this.widgetInfoModel.title = 'سامانه فعال :';
    this.widgetInfoModel.description = 'خلاصه مشخصات حساب این سامانه ';
    this.widgetInfoModel.link = '/core/site';

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
    this.service.ServiceGetOneById(this.tokenInfoModel.SiteId).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.modelData.set('Title', ret.Item.Title);
          this.modelData.set('Domain', ret.Item.Domain);
          this.modelData.set('Sub Domain', ret.Item.SubDomain);
          this.modelData.set('Created Date', this.persianCalendarService.PersianCalendar(ret.Item.CreatedDate));
          if (ret.Item.ExpireDate) {
            this.modelData.set('Expire Date', this.persianCalendarService.PersianCalendar(ret.Item.ExpireDate));
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
      },
      error:(er) => {
      }
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

        const title = this.translate.instant('TITLE.Information');
        const message = this.translate.instant('MESSAGE.Request_to_change_site_was_sent_to_the_server');
        this.cmsToastrService.toastr.info(message, title);
        this.coreAuthService.ServiceRenewToken(authModel).subscribe({
          next: (ret) => {
            if (ret.IsSuccess) {
              if (ret.Item.SiteId === +model.Id) {
                this.cmsToastrService.toastr.success(this.translate.instant('MESSAGE.New_site_acess_confirmed'), title);

              } else {
                this.cmsToastrService.toastr.warning(this.translate.instant('ERRORMESSAGE.MESSAGE.New_site_acess_denied'), title);
              }
            } else {
              this.cmsToastrService.typeErrorAccessChange(ret.ErrorMessage);
            }

          },
          error:(er) => {
            this.cmsToastrService.typeErrorAccessChange(er);
          }
        }
        );
      }
    }
  }
}
