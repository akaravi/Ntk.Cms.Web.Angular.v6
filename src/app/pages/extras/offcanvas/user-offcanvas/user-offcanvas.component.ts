import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreAuthService, EnumManageUserAccessDataTypes, EnumTicketStatus, ErrorExceptionResultBase, FilterDataModel, FilterModel, TicketingTaskService, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { LayoutService } from 'src/app/core/services/layout.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
})
export class UserOffcanvasComponent implements OnInit, OnDestroy {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  // user$: Observable<UserModel>;

  constructor(
    private layout: LayoutService,
    private coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public tokenHelper: TokenHelper,
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
      if (this.tokenHelper.isAdminSite) {
        this.DataTaskEditorGetCount();
      }
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;
      this.DataTaskViewerGetCount();
      this.cdr.detectChanges();
      if (this.tokenHelper.isAdminSite) {
        this.DataTaskEditorGetCount();
      }
      this.cdr.detectChanges();
    });
  }

  async logout() {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Sign_out_of_user_account'));
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
