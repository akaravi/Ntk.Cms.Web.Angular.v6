import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { Observable, Subscription } from 'rxjs';
import { UserModel } from '../../../../../../modules/auth/_models/user.model';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CoreAuthService, EnumManageUserAccessAreaTypes, EnumManageUserAccessControllerTypes, NtkCmsApiStoreService, TokenInfoModel } from 'ntk-cms-api';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit, OnDestroy {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  // user$: Observable<UserModel>;

  constructor(
    private layout: LayoutService,
    private auth: AuthService,
    private coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private cmsApiStore: NtkCmsApiStoreService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
  ) {
    this.loading.cdr = this.cdr;
   }
  tokenInfo: TokenInfoModel;
  cmsApiStoreSubscribe: Subscription;
  loading = new ProgressSpinnerModel();
  IsAdminSite = false;
  env = environment;
  ngOnInit(): void {

    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    // this.user$ = this.auth.currentUserSubject.asObservable();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo.UserType === EnumManageUserAccessControllerTypes.AdminCpSite
        || this.tokenInfo.UserType === EnumManageUserAccessControllerTypes.AdminMainCms
        || this.tokenInfo.UserType === EnumManageUserAccessControllerTypes.AdminResellerCms
        || this.tokenInfo.UserType === EnumManageUserAccessControllerTypes.SupportCpSite
        || this.tokenInfo.UserType === EnumManageUserAccessControllerTypes.SupportMainCms
        || this.tokenInfo.UserType === EnumManageUserAccessControllerTypes.SupportResellerCms) {
        this.IsAdminSite = true;
      }
      else {
        this.IsAdminSite = false;
      }
    });
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo.UserType === EnumManageUserAccessControllerTypes.AdminCpSite
        || this.tokenInfo.UserType === EnumManageUserAccessControllerTypes.AdminMainCms
        || this.tokenInfo.UserType === EnumManageUserAccessControllerTypes.AdminResellerCms
        || this.tokenInfo.UserType === EnumManageUserAccessControllerTypes.SupportCpSite
        || this.tokenInfo.UserType === EnumManageUserAccessControllerTypes.SupportMainCms
        || this.tokenInfo.UserType === EnumManageUserAccessControllerTypes.SupportResellerCms) {
        this.IsAdminSite = true;
      }
      else {
        this.IsAdminSite = false;
      }
      this.cdr.detectChanges();
    });
  }

  async logout() {
    // this.auth.logout();
    this.cmsToastrService.typeOrderActionLogout();
    const retOut = await this.coreAuthService.ServiceLogout().pipe(map(next => {
      if (next.IsSuccess) {
        this.cmsToastrService.typeSuccessLogout();
      } else {
        this.cmsToastrService.typeErrorLogout();
      }
      this.loading.Stop('main');
      return;
    })).toPromise();
    document.location.reload();
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
}
