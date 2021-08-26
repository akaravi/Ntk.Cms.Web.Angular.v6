import { Component, OnDestroy, OnInit } from '@angular/core';
import { NtkCmsApiStoreService, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { LayoutService } from '../../../../../core';

@Component({
  selector: 'app-quick-actions-dropdown-inner',
  templateUrl: './quick-actions-dropdown-inner.component.html',
  styleUrls: ['./quick-actions-dropdown-inner.component.scss'],
})
export class QuickActionsDropdownInnerComponent implements OnInit, OnDestroy {
  constructor(
    private layout: LayoutService,
    private tokenHelper: TokenHelper,
    private cmsApiStore: NtkCmsApiStoreService,

  ) {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
    });
  }
  tokenInfo: TokenInfoModel;
  extrasQuickActionsDropdownStyle: 'light' | 'dark' = 'light';
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.extrasQuickActionsDropdownStyle = this.layout.getProp(
      'extras.quickActions.dropdown.style'
    );
  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
}
