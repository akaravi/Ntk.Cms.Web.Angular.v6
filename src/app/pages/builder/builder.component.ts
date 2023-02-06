import {
  AfterViewInit, Component, ElementRef,
  OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { LayoutService } from 'src/app/core/services/layout.service';
import KTLayoutExamples from '../../../assets/js/layout/extended/examples';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
})
export class BuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  activeTabId = 1;
  constructor(
    private layout: LayoutService,
    private el: ElementRef,
    private tokenHelper: TokenHelper,
  ) {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
    });
  }
  tokenInfo: TokenInfoModel = new TokenInfoModel();
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.model = this.layout.getConfig();
  }

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  setActiveTab(tabId: number) {
    this.activeTabId = tabId;
  }

  getActiveTabCSSClass(tabId: number) {
    if (tabId !== this.activeTabId) {
      return '';
    }

    return 'active';
  }

  resetPreview(): void {
    this.layout.refreshConfigToDefault();
  }

  submitPreview(): void {
    this.layout.setConfig(this.model);
    location.reload();
  }

  ngAfterViewInit() {
    // init code preview examples
    // see /src/assets/js/layout/extended/examples.js
    const elements = this.el.nativeElement.querySelectorAll('.example');
    KTLayoutExamples.init(elements);
  }
}
