import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreAuthService, NtkCmsApiStoreService, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenHelper implements OnDestroy {
  constructor(
    public coreAuthService: CoreAuthService,
    private cmsApiStore: NtkCmsApiStoreService,
    private router: Router,
  ) {

  }

  tokenInfo: TokenInfoModel = new TokenInfoModel();
  cmsApiStoreSubscribe: Subscription;


  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  CurrentTokenInfoRenew(): void {
    this.coreAuthService.CurrentTokenInfoRenew();
  }
  CheckRouteByToken(): void {
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((value) => {
      this.tokenInfo = value;

      if (!this.tokenInfo || !this.tokenInfo.Token || this.tokenInfo.Token.length === 0) {
        if (this.router.url.indexOf('/auth/singin') < 0) {
          this.router.navigate(['/auth/singin']);
        }
      } else if (this.tokenInfo.UserId <= 0) {

        if (this.router.url.indexOf('/auth/singin') < 0) {
          this.router.navigate(['/auth/singin']);
        }
      } else if (this.tokenInfo.UserId > 0 && this.tokenInfo.SiteId <= 0) {
        if (this.router.url.indexOf('/core/site/selection') < 0) {
          this.router.navigate(['/core/site/selection']);
        }
      }
      if (this.tokenInfo && this.tokenInfo.UserId <= 0) {
        if (this.router.url.indexOf('/auth/singin') < 0) {
          this.router.navigate(['/auth/singin']);
        }
      }

      if (this.tokenInfo && this.tokenInfo.UserId > 0 && this.tokenInfo.SiteId <= 0) {
        if (this.router.url.indexOf('/core/site/selection') < 0) {
          this.router.navigate(['/core/site/selection']);
        }
      }
      // this.inputSiteId = this.tokenInfo.SiteId;
      // this.inputUserId = this.tokenInfo.UserId;
    });
  }

}
