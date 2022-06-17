import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthRenewTokenModel,
  CoreAuthService,
  TokenInfoModel,
  NtkCmsApiStoreService,
  CoreSiteModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-token-access',
  templateUrl: './cmsTokenAccess.component.html',
})
export class CmsTokenAccessComponent implements OnInit, OnDestroy {

  constructor(
    public coreAuthService: CoreAuthService,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
  ) {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });


    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;
    });


  }

  tokenInfo: TokenInfoModel = new TokenInfoModel();
  loadingStatus = false;
  inputSiteId?: number;
  inputUserId?: number;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionbuttonUserAccessAdminAllowToAllData(): void {
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    const NewToall = !this.tokenInfo.userAccessAdminAllowToAllData;
    authModel.userAccessAdminAllowToProfessionalData = this.tokenInfo.userAccessAdminAllowToProfessionalData;
    authModel.userAccessAdminAllowToAllData = NewToall;
    authModel.siteId = this.tokenInfo.siteId;
    authModel.userId = this.tokenInfo.userId;
    authModel.lang = this.tokenInfo.language;

    const title = this.translate.instant('TITLE.Information');
    let message = '';
    if (authModel.userAccessAdminAllowToAllData) {
      message = 'درخواست برای دسترسی به کلیه اطلاعات به سرور ارسال شد';
    } else {
      message = 'درخواست قطع  دسترسی به کل اطلاعات  به سرور ارسال شد';
    }
    this.cmsToastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.isSuccess) {
          const etitle = this.translate.instant('TITLE.Information');
          const emessage = '';
          if (next.item.userAccessAdminAllowToAllData === NewToall) {
            message = 'دسترسی تایید شد';
            this.cmsToastrService.toastr.success(emessage, etitle);
          } else {
            message = 'دسترسی  جدید تایید نشد';
            this.cmsToastrService.toastr.warning(emessage, etitle);
          }
        } else {
          this.cmsToastrService.typeErrorAccessChange(next.errorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeErrorAccessChange(error);
      }
    );
  }

  onActionbuttonUserAccessAdminAllowToProfessionalData(): void {
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    const NewToPerf = !this.tokenInfo.userAccessAdminAllowToProfessionalData;
    authModel.userAccessAdminAllowToProfessionalData = NewToPerf;
    authModel.userAccessAdminAllowToAllData = this.tokenInfo.userAccessAdminAllowToAllData;
    authModel.siteId = this.tokenInfo.siteId;
    authModel.userId = this.tokenInfo.userId;
    authModel.lang = this.tokenInfo.language;

    const title = this.translate.instant('TITLE.Information');
    let message = '';
    if (authModel.userAccessAdminAllowToProfessionalData) {
      message = 'درخواست برای دسترسی حرفه ایی به سرور ارسال شد';
    } else {
      message = 'درخواست قطع  دسترسی حرفه ایی  به سرور ارسال شد';
    }
    this.cmsToastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.isSuccess) {
          const etitle = this.translate.instant('TITLE.Information');
          if (next.item.userAccessAdminAllowToProfessionalData === NewToPerf) {
            const emessage = 'دسترسی تایید شد';
            this.cmsToastrService.toastr.success(emessage, etitle);
          } else {
            const emessage = 'دسترسی  جدید تایید نشد';
            this.cmsToastrService.toastr.warning(emessage, etitle);
          }
        } else {
          this.cmsToastrService.typeErrorAccessChange(next.errorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeErrorAccessChange(error);
      }
    );
  }

  onActionbuttonSelectUser(): void {
    if (this.inputUserId === this.tokenInfo.userId) {
      const etitle = 'هشدار';
      const emessage = 'شناسه درخواستی این کاربر با کاربری که در آن هستید یکسان است';
      this.cmsToastrService.toastr.warning(emessage, etitle);
      return;
    }
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    authModel.userAccessAdminAllowToProfessionalData = this.tokenInfo.userAccessAdminAllowToProfessionalData;
    authModel.userAccessAdminAllowToAllData = this.tokenInfo.userAccessAdminAllowToAllData;
    authModel.siteId = this.tokenInfo.siteId;
    authModel.userId = this.inputUserId;
    authModel.lang = this.tokenInfo.language;

    const title = this.translate.instant('TITLE.Information');
    const message = 'درخواست تغییر کاربر به سرور ارسال شد';
    this.cmsToastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.isSuccess) {
          if (next.item.userId === +this.inputUserId) {

            this.cmsToastrService.toastr.success('دسترسی به کاربر جدید تایید شد', title);
            this.inputSiteId = null;
            this.inputUserId = null;
          } else {
            this.cmsToastrService.toastr.warning('دسترسی به کاربر جدید تایید نشد', title);
          }
        } else {
          this.cmsToastrService.typeErrorAccessChange(next.errorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeErrorAccessChange(error);
      }
    );
  }

  onActionbuttonSelectSite(): void {
    if (this.inputSiteId === this.tokenInfo.siteId) {
      const etitle = 'هشدار';
      const emessage = 'شناسه این وب سایت با وب سایتی که در آن هستید یکسان است';
      this.cmsToastrService.toastr.warning(emessage, etitle);
      return;
    }
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    authModel.userAccessAdminAllowToProfessionalData = this.tokenInfo.userAccessAdminAllowToProfessionalData;
    authModel.userAccessAdminAllowToAllData = this.tokenInfo.userAccessAdminAllowToAllData;
    authModel.userId = this.tokenInfo.userId;
    authModel.siteId = this.inputSiteId;
    authModel.lang = this.tokenInfo.language;

    const title = this.translate.instant('TITLE.Information');
    const message = this.translate.instant('MESSAGE.Request_to_change_site_was_sent_to_the_server');
    this.cmsToastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.isSuccess) {
          if (next.item.siteId === +this.inputSiteId) {
            this.cmsToastrService.toastr.success(this.translate.instant('MESSAGE.New_site_acess_confirmed'), title);
            this.inputSiteId = null;
            this.inputUserId = null;
          } else {
            this.cmsToastrService.toastr.warning(this.translate.instant('ERRORMESSAGE.MESSAGE.New_site_acess_denied'), title);
          }
        } else {
          this.inputSiteId = this.tokenInfo.siteId;
          this.cmsToastrService.typeErrorAccessChange(next.errorMessage);
        }

      },
      (error) => {
        this.cmsToastrService.typeErrorAccessChange(error);
      }
    );
  }
  onActionSiteSelect(model: CoreSiteModel): void {
    if (model && model.id > 0) {
      if (model.id !== this.tokenInfo.siteId) {
        this.inputSiteId = model.id;
        this.onActionbuttonSelectSite();
      }
    }
  }
}
