import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LayoutService } from '../../../../../core';
import { UserModel } from '../../../../../../modules/auth/_models/user.model';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CoreAuthService, EnumManageUserAccessControllerTypes, NtkCmsApiStoreService, TokenInfoModel } from 'ntk-cms-api';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit, OnDestroy {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
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


  }
  tokenInfo: TokenInfoModel;
  cmsApiStoreSubscribe: Subscription;
  loading = new ProgressSpinnerModel();
  IsAdminSite = false;
  env = environment;
  ngOnInit(): void {
    this.extrasUserDropdownStyle = this.layout.getProp(
      'extras.user.dropdown.style'
    );
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
      this.loading.Stop('main');
      if (next.IsSuccess) {
        this.cmsToastrService.typeSuccessLogout();
      } else {
        this.cmsToastrService.typeErrorLogout();
      }
      return;
    })).toPromise();
    document.location.reload();
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
}
