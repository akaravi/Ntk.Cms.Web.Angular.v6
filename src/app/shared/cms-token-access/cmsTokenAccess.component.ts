import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthRenewTokenModel,
  CoreAuthService,
  TokenInfoModel,
  NtkCmsApiStoreService,
  EnumManageUserAccessControllerTypes,
  CoreSiteModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-token-access',
  templateUrl: './cmsTokenAccess.component.html',
  styleUrls: ['./cmsTokenAccess.component.scss'],
})
export class CmsTokenAccessComponent implements OnInit, OnDestroy {

  constructor(
    public coreAuthService: CoreAuthService,
    private cmsApiStore: NtkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
  ) {
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;

    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((value) => {
      this.tokenInfo = value;

      if (!this.tokenInfo || !this.tokenInfo.Token || this.tokenInfo.Token.length === 0) {
        this.router.navigate(['/auth/singin']);
      } else if (this.tokenInfo.UserId <= 0) {
        this.router.navigate(['/auth/singin']);
      } else if (this.tokenInfo.UserId > 0 && this.tokenInfo.SiteId <= 0) {
        this.router.navigate(['/core/site/selection']);
      }
      if (this.tokenInfo && this.tokenInfo.UserId <= 0) {
        this.router.navigate(['/auth/singin']);
      }

      if (this.tokenInfo && this.tokenInfo.UserId > 0 && this.tokenInfo.SiteId <= 0) {
        this.router.navigate(['/core/site/selection']);
      }
      // this.inputSiteId = this.tokenInfo.SiteId;
      // this.inputUserId = this.tokenInfo.UserId;
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
    const NewToall = !this.tokenInfo.UserAccessAdminAllowToAllData;
    authModel.UserAccessAdminAllowToProfessionalData = this.tokenInfo.UserAccessAdminAllowToProfessionalData;
    authModel.UserAccessAdminAllowToAllData = NewToall;
    authModel.SiteId = this.tokenInfo.SiteId;
    authModel.UserId = this.tokenInfo.UserId;
    authModel.Lang = this.tokenInfo.Language;

    const title = 'اطلاعات ';
    let message = '';
    if (authModel.UserAccessAdminAllowToAllData) {
      message = 'درخواست برای دسترسی به کلیه اطلاعات به سرور ارسال شد';
    } else {
      message = 'درخواست قطع  دسترسی به کل اطلاعات  به سرور ارسال شد';
    }
    this.cmsToastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.IsSuccess) {
          const etitle = 'اطلاعات ';
          const emessage = '';
          if (next.Item.UserAccessAdminAllowToAllData === NewToall) {
            message = 'دسترسی تایید شد';
            this.cmsToastrService.toastr.success(emessage, etitle);
          } else {
            message = 'دسترسی  جدید تایید نشد';
            this.cmsToastrService.toastr.warning(emessage, etitle);
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

  onActionbuttonUserAccessAdminAllowToProfessionalData(): void {
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    const NewToPerf = !this.tokenInfo.UserAccessAdminAllowToProfessionalData;
    authModel.UserAccessAdminAllowToProfessionalData = NewToPerf;
    authModel.UserAccessAdminAllowToAllData = this.tokenInfo.UserAccessAdminAllowToAllData;
    authModel.SiteId = this.tokenInfo.SiteId;
    authModel.UserId = this.tokenInfo.UserId;
    authModel.Lang = this.tokenInfo.Language;

    const title = 'اطلاعات ';
    let message = '';
    if (authModel.UserAccessAdminAllowToProfessionalData) {
      message = 'درخواست برای دسترسی حرفه ایی به سرور ارسال شد';
    } else {
      message = 'درخواست قطع  دسترسی حرفه ایی  به سرور ارسال شد';
    }
    this.cmsToastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.IsSuccess) {
          const etitle = 'اطلاعات ';
          if (next.Item.UserAccessAdminAllowToProfessionalData === NewToPerf) {
            const emessage = 'دسترسی تایید شد';
            this.cmsToastrService.toastr.success(emessage, etitle);
          } else {
            const emessage = 'دسترسی  جدید تایید نشد';
            this.cmsToastrService.toastr.warning(emessage, etitle);
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

  onActionbuttonSelectUser(): void {
    if (this.inputUserId === this.tokenInfo.UserId) {
      const etitle = 'هشدار';
      const emessage = 'شناسه درخواستی این کاربر با کاربری که در آن هستید یکسان است';
      this.cmsToastrService.toastr.warning(emessage, etitle);
      return;
    }
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    authModel.UserAccessAdminAllowToProfessionalData = this.tokenInfo.UserAccessAdminAllowToProfessionalData;
    authModel.UserAccessAdminAllowToAllData = this.tokenInfo.UserAccessAdminAllowToAllData;
    authModel.SiteId = this.tokenInfo.SiteId;
    authModel.UserId = this.inputUserId;
    authModel.Lang = this.tokenInfo.Language;

    const title = 'اطلاعات ';
    const message = 'درخواست تغییر کاربر به سرور ارسال شد';
    this.cmsToastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.IsSuccess) {
          if (next.Item.UserId === +this.inputUserId) {

            this.cmsToastrService.toastr.success('دسترسی به کاربر جدید تایید شد', title);
            this.inputSiteId = null;
            this.inputUserId = null;
          } else {
            this.cmsToastrService.toastr.warning('دسترسی به کاربر جدید تایید نشد', title);
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

  onActionbuttonSelectSite(): void {
    if (this.inputSiteId === this.tokenInfo.SiteId) {
      const etitle = 'هشدار';
      const emessage = 'شناسه این وب سایت با وب سایتی که در آن هستید یکسان است';
      this.cmsToastrService.toastr.warning(emessage, etitle);
      return;
    }
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    authModel.UserAccessAdminAllowToProfessionalData = this.tokenInfo.UserAccessAdminAllowToProfessionalData;
    authModel.UserAccessAdminAllowToAllData = this.tokenInfo.UserAccessAdminAllowToAllData;
    authModel.UserId = this.tokenInfo.UserId;
    authModel.SiteId = this.inputSiteId;
    authModel.Lang = this.tokenInfo.Language;

    const title = 'اطلاعات ';
    const message = 'درخواست تغییر سایت به سرور ارسال شد';
    this.cmsToastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.IsSuccess) {
          if (next.Item.SiteId === +this.inputSiteId ) {
            this.cmsToastrService.toastr.success('دسترسی به سایت جدید تایید شد', title);
            this.inputSiteId = null;
            this.inputUserId = null;
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
  onActionSiteSelect(model: CoreSiteModel): void {
    if (model && model.Id > 0) {
      // this.inputSiteId = model.Id;
      if ( model.Id !== this.tokenInfo.SiteId) {
        this.onActionbuttonSelectSite();
      }
    }
  }
}
