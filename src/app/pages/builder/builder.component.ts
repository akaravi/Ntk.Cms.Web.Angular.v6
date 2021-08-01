import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from '../../_metronic/core/';
import KTLayoutExamples from '../../../assets/js/layout/extended/examples';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { NtkCmsApiStoreService, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  activeTabId = 1;
  constructor(private layout: LayoutService,
    private el: ElementRef,
    private tokenHelper: TokenHelper,
    private cmsApiStore: NtkCmsApiStoreService,
  ) {
    this.tokenHelper.getCurrentToken();
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
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
