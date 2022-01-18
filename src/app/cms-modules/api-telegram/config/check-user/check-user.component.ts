import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {
  BaseModuleSiteCheckUserModel,
  ApiTelegramConfigurationService,
  CoreEnumService,
  ErrorExceptionResult,
  NtkCmsApiStoreService,
  TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-apitelegram-config-checkuser',
  templateUrl: './check-user.component.html',
})
export class ApiTelegramConfigCheckUserComponent implements OnInit, OnDestroy {
  requestLinkUserId = 0;
  constructor(
    private configService: ApiTelegramConfigurationService,
    private activatedRoute: ActivatedRoute,
    private tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loading.cdr = this.cdr;
    this.requestLinkUserId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserId'));
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.onLoadDate();
    });
    this.onLoadDate();
  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<BaseModuleSiteCheckUserModel> = new ErrorExceptionResult<BaseModuleSiteCheckUserModel>();
  tableRowsSelected: Array<BaseModuleSiteCheckUserModel> = [];
  tableRowSelected: BaseModuleSiteCheckUserModel = new BaseModuleSiteCheckUserModel();
  tableSource: MatTableDataSource<BaseModuleSiteCheckUserModel> = new MatTableDataSource<BaseModuleSiteCheckUserModel>();
  tabledisplayedColumns: string[] = [
    'Accepted',
    'Title',
    'Description'
  ];
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onLoadDate(): void {
    if (!this.requestLinkUserId || this.requestLinkUserId === 0) {
      this.requestLinkUserId = this.tokenInfo.UserId;
    }
    if (!this.requestLinkUserId || this.requestLinkUserId === 0) {
      return;
    }
    const pName = this.constructor.name + '.ServiceCheckUser';
    this.loading.Start(pName, 'بررسی حساب کاربری');
    this.configService
      .ServiceCheckUser(this.requestLinkUserId)
      .subscribe(
        async (next) => {
          this.loading.Stop(pName);
          this.dataModelResult = next;
          this.tableSource.data = next.ListItems;
          if (!next.IsSuccess) {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(pName);
        }
      );
  }
}
