import {
  AfterViewInit, Component, ElementRef, OnDestroy, OnInit,
  ViewChild
} from '@angular/core';

import { TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { LayoutInitService } from 'src/app/core/services/layout-init.service';
import { LayoutService } from 'src/app/core/services/layout.service';
import KTLayoutContent from '../../../assets/js/layout/base/content';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  // Public variables
  selfLayout = 'default';
  asideSelfDisplay: true;
  asideMenuStatic: true;
  contentClasses = '';
  contentContainerClasses = '';
  subheaderDisplay = true;
  contentExtended: false;
  asideCSSClasses: string;
  asideHTMLAttributes: any = {};
  headerMobileClasses = '';
  headerMobileAttributes = {};
  footerDisplay: boolean;
  footerLayout: string;
  footerCSSClasses: string;
  headerCSSClasses: string;
  headerHTMLAttributes: any = {};
  // offcanvases
  extrasSearchOffcanvasDisplay = false;
  extrasNotificationsOffcanvasDisplay = false;
  extrasQuickActionsOffcanvasDisplay = false;
  extrasCartOffcanvasDisplay = false;
  extrasUserOffcanvasDisplay = false;
  extrasQuickPanelDisplay = false;
  extrasScrollTopDisplay = false;
  @ViewChild('ktAside', { static: true }) ktAside: ElementRef;
  @ViewChild('ktHeaderMobile', { static: true }) ktHeaderMobile: ElementRef;
  @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;

  constructor(
    private initService: LayoutInitService,
    private layout: LayoutService,
    public tokenHelper: TokenHelper,
  ) {
    this.initService.init();
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
    // First Token Info
    this.tokenHelper.CurrentTokenInfoRenew();
    this.tokenHelper.CheckRouteByToken();

    // build view by layout config settings
    this.selfLayout = this.layout.getProp('self.layout');
    this.asideSelfDisplay = this.layout.getProp('aside.self.display');
    this.asideMenuStatic = this.layout.getProp('aside.menu.static');
    this.subheaderDisplay = this.layout.getProp('subheader.display');
    this.contentClasses = this.layout.getStringCSSClasses('content');
    this.contentContainerClasses = this.layout.getStringCSSClasses(
      'content_container'
    );
    this.contentExtended = this.layout.getProp('content.extended');
    this.asideHTMLAttributes = this.layout.getHTMLAttributes('aside');
    this.asideCSSClasses = this.layout.getStringCSSClasses('aside');
    this.headerMobileClasses = this.layout.getStringCSSClasses('header_mobile');
    this.headerMobileAttributes = this.layout.getHTMLAttributes(
      'header_mobile'
    );
    // Footer view
    this.footerDisplay = this.layout.getProp('footer.display');
    this.footerCSSClasses = this.layout.getStringCSSClasses('footer');
    this.footerLayout = this.layout.getProp('footer.layout');
    // Header view
    this.headerCSSClasses = this.layout.getStringCSSClasses('header');
    this.headerHTMLAttributes = this.layout.getHTMLAttributes('header');
    // offcanvases
    if (this.layout.getProp('extras.search.display')) {
      this.extrasSearchOffcanvasDisplay =
        this.layout.getProp('extras.search.layout') === 'offcanvas';
    }

    if (this.layout.getProp('extras.notifications.display')) {
      this.extrasNotificationsOffcanvasDisplay =
        this.layout.getProp('extras.notifications.layout') === 'offcanvas';
    }

    if (this.layout.getProp('extras.quickActions.display')) {
      this.extrasQuickActionsOffcanvasDisplay =
        this.layout.getProp('extras.quickActions.layout') === 'offcanvas';
    }

    if (this.layout.getProp('extras.cart.display')) {
      this.extrasCartOffcanvasDisplay =
        this.layout.getProp('extras.cart.layout') === 'offcanvas';
    }

    if (this.layout.getProp('extras.user.display')) {
      this.extrasUserOffcanvasDisplay =
        this.layout.getProp('extras.user.layout') === 'offcanvas';
    }

    this.extrasQuickPanelDisplay = this.layout.getProp(
      'extras.quickPanel.display'
    );

    this.extrasScrollTopDisplay = this.layout.getProp(
      'extras.scrolltop.display'
    );
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  ngAfterViewInit(): void {
    if (this.ktAside) {
      for (const key in this.asideHTMLAttributes) {
        if (this.asideHTMLAttributes.hasOwnProperty(key)) {
          this.ktAside.nativeElement.attributes[key] = this.asideHTMLAttributes[
            key
          ];
        }
      }
    }

    if (this.ktHeaderMobile) {
      for (const key in this.headerMobileAttributes) {
        if (this.headerMobileAttributes.hasOwnProperty(key)) {
          this.ktHeaderMobile.nativeElement.attributes[
            key
          ] = this.headerMobileAttributes[key];
        }
      }
    }

    if (this.ktHeader) {
      for (const key in this.headerHTMLAttributes) {
        if (this.headerHTMLAttributes.hasOwnProperty(key)) {
          this.ktHeader.nativeElement.attributes[
            key
          ] = this.headerHTMLAttributes[key];
        }
      }
    }
    // Init Content
    KTLayoutContent.init('kt_content');
  }
}
