
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  BaseModuleSiteCheckSiteModel, CoreEnumService,
  ErrorExceptionResult, EstateConfigurationService, TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-config-checksite',
  templateUrl: './check-site.component.html'
})
export class EstateConfigCheckSiteComponent implements OnInit, OnDestroy {
  requestLinkSiteId = 0;

  constructor(
    private configService: EstateConfigurationService,
    private activatedRoute: ActivatedRoute,
    private tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.requestLinkSiteId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkSiteId'));
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.onLoadDate();
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
  dataModelResult: ErrorExceptionResult<BaseModuleSiteCheckSiteModel> = new ErrorExceptionResult<BaseModuleSiteCheckSiteModel>();
  tableRowsSelected: Array<BaseModuleSiteCheckSiteModel> = [];
  tableRowSelected: BaseModuleSiteCheckSiteModel = new BaseModuleSiteCheckSiteModel();
  tableSource: MatTableDataSource<BaseModuleSiteCheckSiteModel> = new MatTableDataSource<BaseModuleSiteCheckSiteModel>();


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
    if (!this.requestLinkSiteId || this.requestLinkSiteId === 0) {
      this.requestLinkSiteId = this.tokenInfo.siteId;
    }
    if (!this.requestLinkSiteId || this.requestLinkSiteId === 0) {
      return;
    }
    const pName = this.constructor.name + '.ServiceCheckSite';
    this.loading.Start(pName, this.translate.instant('TITLE.Check_website'));
    this.configService
      .ServiceCheckSite(this.requestLinkSiteId)
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);
          this.dataModelResult = ret;
          this.tableSource.data = ret.listItems;
          if (!ret.isSuccess) {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
        },
        error: (er) => {
          this.loading.Stop(pName);

          this.cmsToastrService.typeErrorGetOne(er);
        }
      }
      );
  }
}
