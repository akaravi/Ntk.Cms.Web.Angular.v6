import {Component, OnDestroy, OnInit} from '@angular/core';
import { TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';

@Component({
  selector: 'app-core-info',
  templateUrl: './core-info.component.html',
  styleUrls: ['./core-info.component.scss']
})
export class CoreInfoComponent implements OnInit, OnDestroy  {

  constructor(
    private tokenHelper: TokenHelper,
  ) {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
    });
  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo: TokenInfoModel;

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
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
}
