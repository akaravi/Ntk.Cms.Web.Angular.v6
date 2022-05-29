import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../../../core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CoreAuthService, EnumManageUserAccessDataTypes, EnumManageUserAccessUserTypes, EnumTicketStatus, ErrorExceptionResultBase, FilterDataModel, FilterModel, TicketingTaskService, TokenInfoModel } from 'ntk-cms-api';
import { map } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { environment } from 'src/environments/environment';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
})
export class UserDropdownInnerComponent implements OnInit, OnDestroy {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  // user$: Observable<UserModel>;
  constructor(
    private layout: LayoutService,
    private coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    private ticketingTaskService: TicketingTaskService,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  tokenInfo: TokenInfoModel;
  cmsApiStoreSubscribe: Subscription;
  @Input()
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
      this.DataTaskViewerGetCount();
      if (this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.AdminCpSite
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.AdminMainCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.AdminResellerCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.SupportCpSite
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.SupportMainCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.SupportResellerCms) {
        this.IsAdminSite = true;
        this.DataTaskEditorGetCount();
      }
      else {
        this.IsAdminSite = false;
      }
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;
      this.DataTaskViewerGetCount();
      if (this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.AdminCpSite
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.AdminMainCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.AdminResellerCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.SupportCpSite
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.SupportMainCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.SupportResellerCms) {
        this.IsAdminSite = true;
        this.DataTaskEditorGetCount();
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
  dataTaskGetCountViewerModelResult =new ErrorExceptionResultBase();
  dataTaskGetCountEditorModelResult =new ErrorExceptionResultBase();
  DataTaskViewerGetCount(): void {

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    /*filter CLone*/
    const filterModel = new FilterModel();
    /*filter CLone*/
    const filter = new FilterDataModel();
    filter.PropertyName = 'TicketStatus';
    filter.Value = EnumTicketStatus.Unread;
    filterModel.Filters.push(filter);
    this.ticketingTaskService.setAccessDataType(EnumManageUserAccessDataTypes.Viewer)
    this.ticketingTaskService.ServiceGetCount(filterModel).subscribe(
      (next) => {

        if (next.IsSuccess) {
          this.dataTaskGetCountViewerModelResult = next;
        }
        else {
          this.cmsToastrService.typeErrorGetAll(next.ErrorMessage);

        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.cmsToastrService.typeError(error);

        this.loading.Stop(pName);

      }
    );
  }

  DataTaskEditorGetCount(): void {

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    /*filter CLone*/
    const filterModel = new FilterModel();
    /*filter CLone*/
    const filter = new FilterDataModel();
    filter.PropertyName = 'TicketStatus';
    filter.Value = EnumTicketStatus.Unread;
    filterModel.Filters.push(filter);
    this.ticketingTaskService.setAccessDataType(EnumManageUserAccessDataTypes.Editor)
    this.ticketingTaskService.ServiceGetCount(filterModel).subscribe(
      (next) => {

        if (next.IsSuccess) {
          this.dataTaskGetCountEditorModelResult = next;
        }
        else {
          this.cmsToastrService.typeErrorGetAll(next.ErrorMessage);

        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.cmsToastrService.typeError(error);

        this.loading.Stop(pName);

      }
    );
  }
}
