
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
      //  this.dataModel.siteId = siteId;
    }
    const ResellerSiteId = + localStorage.getItem('ResellerSiteId');
    if (ResellerSiteId > 0) {
      //  this.dataModel.resellerSiteId = ResellerSiteId;
    }
    const ResellerUserId = + localStorage.getItem('ResellerUserId');
    if (ResellerUserId > 0) {
      //  this.dataModel.resellerUserId = ResellerUserId;
    }
    /** read storage */
  }
  DataGetInfo(): void {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.coreSiteService.ServiceGetShareInfo().subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
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
    if (this.dataModelResult?.item?.urlResellerUserShortLinkUrl?.length > 0) {

      const indexLast = this.dataModelResult.item.urlResellerUserShortLinkUrl.lastIndexOf('/');
      if (indexLast > 0) {
        const key = this.dataModelResult.item.urlResellerUserShortLinkUrl.substr(indexLast + 1);
        // const url = this.router.serializeUrl(
        //   this.router.createUrlTree([encodeURI('#/linkmanagement/target-billboard-log/Key/' + key)])
        // );
        // window.open(url, '_blank');
        this.router.navigate(['/linkmanagement/target-billboard-log/Key/' + key]);
      }
    }
  }
  onActionbuttonResllerUserCategoryShortLinkStatus(): void {
    if (this.dataModelResult?.item?.urlResellerSiteCategoryShortLinkUrl?.length > 0) {
      const indexLast = this.dataModelResult.item.urlResellerSiteCategoryShortLinkUrl.lastIndexOf('/');
      if (indexLast > 0) {
        const key = this.dataModelResult.item.urlResellerSiteCategoryShortLinkUrl.substr(indexLast + 1);
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
    if (this.dataModelResult?.item?.urlResellerSiteShortLinkUrl?.length > 0) {
      const indexLast = this.dataModelResult.item.urlResellerSiteShortLinkUrl.lastIndexOf('/');
      if (indexLast > 0) {
        const key = this.dataModelResult.item.urlResellerSiteShortLinkUrl.substr(indexLast + 1);

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
        title: 'آدرس وب سایت',
        urlViewContentQRCodeBase64: this.dataModelResult.item.urlSiteHomeShortLinkQRCodeBase64,
        urlViewContent: this.dataModelResult.item.urlSiteHome,
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
        title: 'آدرس سامانه مدیریت محتوا',
        urlViewContentQRCodeBase64: this.dataModelResult.item.urlSiteCPanelShortLinkQRCodeBase64,
        urlViewContent: this.dataModelResult.item.urlSiteCPanel,
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
        title: 'آدرس اشتراک گزاری وب سایت',
        urlViewContentQRCodeBase64: this.dataModelResult.item.urlSiteCPanelShortLinkQRCodeBase64,
        urlViewContent: this.dataModelResult.item.urlSiteCPanel,
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
        title: 'آدرس اشتراک گزاری با حساب کاربری شما',
        urlViewContentQRCodeBase64: this.dataModelResult.item.urlResellerUserShortLinkQRCodeBase64,
        urlViewContent: this.dataModelResult.item.urlResellerUserShortLinkUrl,
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
        title: 'آدرس اشتراک گزاری با حساب کاربری شما',
        urlViewContentQRCodeBase64: this.dataModelResult.item.urlResellerSiteCategoryShortLinkQRCodeBase64,
        urlViewContent: this.dataModelResult.item.urlResellerSiteCategoryShortLinkUrl,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
}
