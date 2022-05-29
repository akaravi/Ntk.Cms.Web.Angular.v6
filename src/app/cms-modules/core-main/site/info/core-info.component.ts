//**msh */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreSiteService, ErrorExceptionResult, ShareInfoModel, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CmsLinkToComponent } from 'src/app/shared/cms-link-to/cms-link-to.component';

@Component({
  selector: 'app-core-info',
  templateUrl: './core-info.component.html',
  styleUrls: ['./core-info.component.scss']
})
export class CoreInfoComponent implements OnInit, OnDestroy {

  constructor(
    private tokenHelper: TokenHelper,
    private cmsToastrService: CmsToastrService,
    private coreSiteService: CoreSiteService,
    private router: Router,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog

  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
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

    this.coreSiteService.ServiceGetShareInfo().subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.dataModelResult = ret;
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }
  onActionbuttonResllerUser(): void {

    this.router.navigate(['/core/user/reseller-chart']);

  }
  onActionbuttonResllerUserShortLinkStatus(): void {
    if (this.dataModelResult?.Item?.UrlResellerUserShortLinkUrl?.length > 0) {

      const indexLast = this.dataModelResult.Item.UrlResellerUserShortLinkUrl.lastIndexOf('/');
      if (indexLast > 0) {
        const key = this.dataModelResult.Item.UrlResellerUserShortLinkUrl.substr(indexLast + 1);
        // const url = this.router.serializeUrl(
        //   this.router.createUrlTree([encodeURI('#/linkmanagement/target-billboard-log/Key/' + key)])
        // );
        // window.open(url, '_blank');
        this.router.navigate(['/linkmanagement/target-billboard-log/Key/' + key]);
      }
    }
  }
  onActionbuttonResllerUserCategoryShortLinkStatus(): void {
    if (this.dataModelResult?.Item?.UrlResellerSiteCategoryShortLinkUrl?.length > 0) {
      const indexLast = this.dataModelResult.Item.UrlResellerSiteCategoryShortLinkUrl.lastIndexOf('/');
      if (indexLast > 0) {
        const key = this.dataModelResult.Item.UrlResellerSiteCategoryShortLinkUrl.substr(indexLast + 1);
        // const url = this.router.serializeUrl(
        //   this.router.createUrlTree([encodeURI('#/linkmanagement/target-billboard-log/Key/' + key)])
        // );
        // window.open(url, '_blank');
        this.router.navigate(['/linkmanagement/target-billboard-log/Key/' + key]);
      }
    }
  }
  onActionbuttonResllerSite(): void {


    this.router.navigate(['/core/site/reseller-chart']);

  }
  onActionbuttonResllerSiteShortLinkStatus(): void {
    if (this.dataModelResult?.Item?.UrlResellerSiteShortLinkUrl?.length > 0) {
      const indexLast = this.dataModelResult.Item.UrlResellerSiteShortLinkUrl.lastIndexOf('/');
      if (indexLast > 0) {
        const key = this.dataModelResult.Item.UrlResellerSiteShortLinkUrl.substr(indexLast + 1);

        // const url = this.router.serializeUrl(
        //   this.router.createUrlTree([encodeURI('#/linkmanagement/target-billboard-log/Key/' + key)])
        // );
        // window.open(url, '_blank');
        this.router.navigate(['/linkmanagement/target-billboard-log/Key/' + key]);
      }
    }
  }
  onActionbuttonlinkToSiteHome(): void {
    //open popup
    const dialogRef = this.dialog.open(CmsLinkToComponent, {
      // height: "90%",
      data: {
        Title: 'آدرس وب سایت',
        UrlViewContentQRCodeBase64: this.dataModelResult.Item.UrlSiteHomeShortLinkQRCodeBase64,
        UrlViewContent: this.dataModelResult.Item.UrlSiteHome,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
  onActionbuttonlinkToSiteCPanel(): void {
    //open popup
    const dialogRef = this.dialog.open(CmsLinkToComponent, {
      // height: "90%",
      data: {
        Title: 'آدرس سامانه مدیریت محتوا',
        UrlViewContentQRCodeBase64: this.dataModelResult.Item.UrlSiteCPanelShortLinkQRCodeBase64,
        UrlViewContent: this.dataModelResult.Item.UrlSiteCPanel,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
  onActionbuttonResllerSiteShortLinkTo(): void {
    //open popup
    const dialogRef = this.dialog.open(CmsLinkToComponent, {
      // height: "90%",
      data: {
        Title: 'آدرس اشتراک گزاری وب سایت',
        UrlViewContentQRCodeBase64: this.dataModelResult.Item.UrlSiteCPanelShortLinkQRCodeBase64,
        UrlViewContent: this.dataModelResult.Item.UrlSiteCPanel,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
  onActionbuttonResllerUserShortLinkTo(): void {
    //open popup
    const dialogRef = this.dialog.open(CmsLinkToComponent, {
      // height: "90%",
      data: {
        Title: 'آدرس اشتراک گزاری با حساب کاربری شما',
        UrlViewContentQRCodeBase64: this.dataModelResult.Item.UrlResellerUserShortLinkQRCodeBase64,
        UrlViewContent: this.dataModelResult.Item.UrlResellerUserShortLinkUrl,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
  onActionbuttonResllerUserCategoryShortLinklinkTo(): void {
    //open popup 
    const dialogRef = this.dialog.open(CmsLinkToComponent, {
      // height: "90%",
      data: {
        Title: 'آدرس اشتراک گزاری با حساب کاربری شما',
        UrlViewContentQRCodeBase64: this.dataModelResult.Item.UrlResellerSiteCategoryShortLinkQRCodeBase64,
        UrlViewContent: this.dataModelResult.Item.UrlResellerSiteCategoryShortLinkUrl,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
}
