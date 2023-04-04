
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
import { PersianCalendarService } from 'src/app/core/pipe/persianDatePipe/persian-date.service';
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
    if (!this.tokenInfoModel.siteId || this.tokenInfoModel.siteId <= 0) {
      return;
    }
    this.widgetInfoModel.link = '/core/site/edit/' + this.tokenInfoModel.siteId;
    this.modelData.set('Id', this.tokenInfoModel.siteId + '');
    this.modelData.set('Title', '...');
    this.modelData.set('Domain', '...');
    this.modelData.set('Sub Domain', '...');
    this.modelData.set('Created Date', '...');
    this.modelData.set('Expire Date', '...');
    this.service.ServiceGetOneById(this.tokenInfoModel.siteId).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.modelData.set('Title', ret.item.title);
          this.modelData.set('Domain', ret.item.domain);
          this.modelData.set('Sub Domain', ret.item.subDomain);
          this.modelData.set('Created Date', this.persianCalendarService.PersianCalendar(ret.item.createdDate));
          if (ret.item.expireDate) {
            this.modelData.set('Expire Date', this.persianCalendarService.PersianCalendar(ret.item.expireDate));
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
      },
      error: (er) => {
      }
    }
    );

  }
  onActionSiteSelect(model: CoreSiteModel): void {
    if (model && model.id > 0) {
      // this.inputSiteId = model.id;
      if (model.id !== this.tokenInfoModel.siteId) {
        if (model.id === this.tokenInfoModel.siteId) {
          const etitle = this.translate.instant('TITLE.Warrning');
          const emessage = this.translate.instant('MESSAGE.The_ID_of_this_website_is_the_same_as_the_website_you_are_on');
          this.cmsToastrService.toastr.warning(emessage, etitle);
          return;
        }
        const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
        authModel.userAccessAdminAllowToProfessionalData = this.tokenInfoModel.userAccessAdminAllowToProfessionalData;
        authModel.userAccessAdminAllowToAllData = this.tokenInfoModel.userAccessAdminAllowToAllData;
        authModel.userId = this.tokenInfoModel.userId;
        authModel.siteId = model.id;
        authModel.lang = this.tokenInfoModel.language;

        const title = this.translate.instant('TITLE.Information');
        const message = this.translate.instant('MESSAGE.Request_to_change_site_was_sent_to_the_server');
        this.cmsToastrService.toastr.info(message, title);
        this.coreAuthService.ServiceRenewToken(authModel).subscribe({
          next: (ret) => {
            if (ret.isSuccess) {
              if (ret.item.siteId === +model.id) {
                this.cmsToastrService.toastr.success(this.translate.instant('MESSAGE.New_site_acess_confirmed'), title);

              } else {
                this.cmsToastrService.toastr.warning(this.translate.instant('ERRORMESSAGE.MESSAGE.New_site_acess_denied'), title);
              }
            } else {
              this.cmsToastrService.typeErrorAccessChange(ret.errorMessage);
            }

          },
          error: (er) => {
            this.cmsToastrService.typeErrorAccessChange(er);
          }
        }
        );
      }
    }
  }
}
