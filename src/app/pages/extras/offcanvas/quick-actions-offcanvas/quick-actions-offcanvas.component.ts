import { Component, OnDestroy, OnInit } from '@angular/core';
import { TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'app-quick-actions-offcanvas',
  templateUrl: './quick-actions-offcanvas.component.html',
})
export class QuickActionsOffcanvasComponent implements OnInit, OnDestroy {

  constructor(
    private layout: LayoutService,
    private tokenHelper: TokenHelper,
  ) {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
    });
  }
  tokenInfo: TokenInfoModel;
  cmsApiStoreSubscribe: Subscription;
  extrasQuickActionsOffcanvasDirectionCSSClasses = 'offcanvas-right';
  ngOnInit(): void {
    this.extrasQuickActionsOffcanvasDirectionCSSClasses = `offcanvas-${this.layout.getProp(
      'extras.quickActions.offcanvas.direction'
    )}`;
  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }

}
