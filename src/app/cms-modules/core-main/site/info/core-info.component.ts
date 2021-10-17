import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { CoreSiteService, ErrorExceptionResult, ShareInfoModel, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-info',
  templateUrl: './core-info.component.html',
  styleUrls: ['./core-info.component.scss']
})
export class CoreInfoComponent implements OnInit, OnDestroy  {

  constructor(
    private tokenHelper: TokenHelper,
    private cmsToastrService: CmsToastrService,
    private coreSiteService: CoreSiteService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loading.cdr = this.cdr;
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.DataGetInfo();
    });
    this.DataGetInfo();
  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo: TokenInfoModel;
  loading = new ProgressSpinnerModel();

  dataModelResult: ErrorExceptionResult<ShareInfoModel> = new ErrorExceptionResult<ShareInfoModel>();

  ngOnInit(): void {
     /** read storage */
     const siteId = + localStorage.getItem('siteId');
     if (siteId > 0) {
      //  this.dataModel.SiteId = siteId;
     }
     const ResellerSiteId = + localStorage.getItem('ResellerSiteId');
     if (ResellerSiteId > 0) {
      //  this.dataModel.ResellerSiteId = ResellerSiteId;
     }
     const ResellerUserId = + localStorage.getItem('ResellerUserId');
     if (ResellerUserId > 0) {
      //  this.dataModel.ResellerUserId = ResellerUserId;
     }
     /** read storage */
  }
  DataGetInfo(): void {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.coreSiteService.ServiceGetShareInfo().subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next; 
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }
}
