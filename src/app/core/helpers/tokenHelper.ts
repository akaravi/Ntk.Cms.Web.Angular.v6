import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  CoreAuthService,
  EnumDeviceType,
  EnumOperatingSystemType,
  NtkCmsApiStoreService,
  SET_TOKEN_INFO,
  TokenDeviceClientInfoDtoModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { TranslationService } from '../i18n/translation.service';
import { CmsStoreService } from '../reducers/cmsStore.service';

@Injectable({
  providedIn: 'root',
})
export class TokenHelper implements OnDestroy {
  constructor(
    public coreAuthService: CoreAuthService,
    private cmsApiStore: NtkCmsApiStoreService,
    private translationService: TranslationService,
    private cmsStoreService: CmsStoreService,
    private router: Router,
  ) {

  }

  tokenInfo: TokenInfoModel = new TokenInfoModel();
  cmsApiStoreSubscribe: Subscription;


  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  async getCurrentToken(): Promise<TokenInfoModel> {
    const storeSnapshot = this.cmsApiStore.getStateSnapshot();
    if (storeSnapshot?.ntkCmsAPiState?.tokenInfo) {
      this.tokenInfo = storeSnapshot.ntkCmsAPiState.tokenInfo;
      return storeSnapshot.ntkCmsAPiState.tokenInfo;
    }
    return await this.coreAuthService.ServiceCurrentToken()
      .pipe(map(response => {
        this.cmsApiStore.setState({ type: SET_TOKEN_INFO, payload: response.Item });
        return response.Item;
      })).toPromise();
  }
  getCurrentTokenOnChange(): Observable<TokenInfoModel> {
    return this.cmsApiStore.getState((state) => {
      this.cmsStoreService.setState({ EnumRecordStatusResultStore: null });
      return state.ntkCmsAPiState.tokenInfo;
    });
  }
  CurrentTokenInfoRenew(): void {
    this.coreAuthService.CurrentTokenInfoRenew();
  }
  getDeviceToken(): void {
    const DeviceToken = this.coreAuthService.getDeviceToken();
    if (!DeviceToken || DeviceToken.length === 0) {
      const model: TokenDeviceClientInfoDtoModel = {
        SecurityKey: environment.cmsTokenConfig.SecurityKey,
        ClientMACAddress: '',
        OSType: EnumOperatingSystemType.none,
        DeviceType: EnumDeviceType.WebSite,
        PackageName: '',
        AppBuildVer: 0,
        AppSourceVer: '',
        Country: '',
        DeviceBrand: '',
        Language: this.translationService.getSelectedLanguage(),
        LocationLat: '',
        LocationLong: '',
        SimCard: '',
        NotificationId: ''

      };
      this.translationService.setLanguage(this.translationService.getSelectedLanguage());
      this.coreAuthService.ServiceGetTokenDevice(model).toPromise();
    }
  }
  CheckRouteByToken(): void {
    const storeSnapshot = this.cmsApiStore.getStateSnapshot();
    if (storeSnapshot?.ntkCmsAPiState?.tokenInfo) {
      this.tokenInfo = storeSnapshot.ntkCmsAPiState.tokenInfo;
    }
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
