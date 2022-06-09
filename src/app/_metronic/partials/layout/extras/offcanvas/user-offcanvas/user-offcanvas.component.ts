import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { Subscription } from 'rxjs';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CoreAuthService, EnumManageUserAccessDataTypes, EnumManageUserAccessUserTypes, EnumTicketStatus, ErrorExceptionResultBase, FilterDataModel, FilterModel, TicketingTaskService, TokenInfoModel } from 'ntk-cms-api';
import { map } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { environment } from 'src/environments/environment';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

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

    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    // this.user$ = this.auth.currentUserSubject.asObservable();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataTaskViewerGetCount();
      this.cdr.detectChanges();
      if (this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.AdminCpSite
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.AdminMainCms
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.AdminResellerCms
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.SupportCpSite
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.SupportMainCms
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.SupportResellerCms) {
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
      this.cdr.detectChanges();
      if (this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.AdminCpSite
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.AdminMainCms
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.AdminResellerCms
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.SupportCpSite
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.SupportMainCms
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.SupportResellerCms) {
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
    this.loading.Start(pName, 'خروج حساب کاربری');
    this.cmsToastrService.typeOrderActionLogout();
    const retOut = await this.coreAuthService.ServiceLogout().pipe(map(next => {
      if (next.isSuccess) {
        this.cmsToastrService.typeSuccessLogout();
      } else {
        this.cmsToastrService.typeErrorLogout();
      }
      this.loading.Stop(pName);
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
    filter.propertyName = 'TicketStatus';
    filter.value = EnumTicketStatus.Unread;
    filterModel.filters.push(filter);
    this.ticketingTaskService.setAccessDataType(EnumManageUserAccessDataTypes.Viewer)
    this.ticketingTaskService.ServiceGetCount(filterModel).subscribe(
      (next) => {

        if (next.isSuccess) {
          this.dataTaskGetCountViewerModelResult = next;
        }
        else {
          this.cmsToastrService.typeErrorGetAll(next.errorMessage);

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
    filter.propertyName = 'TicketStatus';
    filter.value = EnumTicketStatus.Unread;
    filterModel.filters.push(filter);
    this.ticketingTaskService.setAccessDataType(EnumManageUserAccessDataTypes.Editor)
    this.ticketingTaskService.ServiceGetCount(filterModel).subscribe(
      (next) => {

        if (next.isSuccess) {
          this.dataTaskGetCountEditorModelResult = next;
        }
        else {
          this.cmsToastrService.typeErrorGetAll(next.errorMessage);

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
