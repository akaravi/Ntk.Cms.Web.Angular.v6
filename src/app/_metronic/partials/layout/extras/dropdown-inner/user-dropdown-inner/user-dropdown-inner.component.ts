import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LayoutService } from '../../../../../core';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CoreAuthService, EnumManageUserAccessControllerTypes, NtkCmsApiStoreService, TokenInfoModel } from 'ntk-cms-api';
import { map } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { environment } from 'src/environments/environment';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';

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
    public publicHelper: PublicHelper,
  ) {
    this.loading.cdr = this.cdr;

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
      if (this.tokenInfo.UserAccessUserType === EnumManageUserAccessControllerTypes.AdminCpSite
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessControllerTypes.AdminMainCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessControllerTypes.AdminResellerCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessControllerTypes.SupportCpSite
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessControllerTypes.SupportMainCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessControllerTypes.SupportResellerCms) {
        this.IsAdminSite = true;
      }
      else {
        this.IsAdminSite = false;
      }
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo.UserAccessUserType === EnumManageUserAccessControllerTypes.AdminCpSite
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessControllerTypes.AdminMainCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessControllerTypes.AdminResellerCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessControllerTypes.SupportCpSite
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessControllerTypes.SupportMainCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessControllerTypes.SupportResellerCms) {
        this.IsAdminSite = true;
      }
      else {
        this.IsAdminSite = false;
      }
      this.cdr.detectChanges();
    });

  }

  async logout() {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, 'خروج از حساب کاربری');
    this.cmsToastrService.typeOrderActionLogout();
    const retOut = await this.coreAuthService.ServiceLogout().pipe(map(next => {
      this.loading.Stop(pName);
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
