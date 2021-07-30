import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CoreAuthService, CoreCpMainMenuModel, CoreCpMainMenuService, ErrorExceptionResult, NtkCmsApiStoreService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DynamicAsideMenuConfig } from 'src/app/_metronic/configs/dynamic-aside-menu.config';
import { environment } from 'src/environments/environment';
import { LayoutService, DynamicAsideMenuService } from '../../../../_metronic/core';

@Component({
  selector: 'app-aside-dynamic',
  templateUrl: './aside-dynamic.component.html',
  styleUrls: ['./aside-dynamic.component.scss']
})
export class AsideDynamicComponent implements OnInit, OnDestroy {
  menuConfigitems: any;
  subscriptions: Subscription[] = [];

  disableAsideSelfDisplay: boolean;
  headerLogo: string;
  brandSkin: string;
  ulCSSClasses: string;
  asideMenuHTMLAttributes: any = {};
  asideMenuCSSClasses: string;
  asideMenuDropdown;
  brandClasses: string;
  asideMenuScroll = 1;
  asideSelfMinimizeToggle = false;

  currentUrl: string;

  constructor(
    private layout: LayoutService,
    private router: Router,
    private menu: DynamicAsideMenuService,
    private cdr: ChangeDetectorRef,
    private coreCpMainMenuService: CoreCpMainMenuService,
    public coreAuthService: CoreAuthService,
    private cmsApiStore: NtkCmsApiStoreService,
  ) { }

  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    // load view settings
    this.disableAsideSelfDisplay =
      this.layout.getProp('aside.self.display') === false;
    this.brandSkin = this.layout.getProp('brand.self.theme');
    this.headerLogo = this.getLogo();
    this.ulCSSClasses = this.layout.getProp('aside_menu_nav');
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('aside_menu');
    this.asideMenuHTMLAttributes = this.layout.getHTMLAttributes('aside_menu');
    this.asideMenuDropdown = this.layout.getProp('aside.menu.dropdown') ? '1' : '0';
    this.brandClasses = this.layout.getProp('brand');
    this.asideSelfMinimizeToggle = this.layout.getProp(
      'aside.self.minimize.toggle'
    );
    this.asideMenuScroll = this.layout.getProp('aside.menu.scroll') ? 1 : 0;
    this.asideMenuCSSClasses = `${this.asideMenuCSSClasses} ${this.asideMenuScroll === 1 ? 'scroll my-4 ps ps--active-y' : ''}`;

    // router subscription
    this.currentUrl = this.router.url.split(/[?#]/)[0];
    const routerSubscr = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
      this.cdr.detectChanges();
    });
    this.subscriptions.push(routerSubscr);

    // menu load

    this.DataGetCpMenu();

    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe(() => {
      this.DataGetCpMenu();
    });


    // const menuSubscr = this.menu.menuConfig$.subscribe(res => {
    //   this.menuConfig = res;
    //   this.cdr.detectChanges();
    // });
    // this.subscriptions.push(menuSubscr);
  }

  private getLogo() {
    if (this.brandSkin === 'light') {
      return './assets/media/logos/logo-dark.png';
    } else {
      return './assets/media/logos/logo-light.png';
    }
  }
  DataGetCpMenu(): void {
    this.menuConfigitems = [{
      title: 'Dashboard',
      root: true,
      icon: 'flaticon2-architecture-and-city',
      svg: './assets/media/svg/icons/Design/Layers.svg',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
      bullet: 'dot',
    }];
    this.coreCpMainMenuService.ServiceGetAllMenu(null).subscribe(
      (next) => {
        const list = [];
        next.ListItems.forEach(element => {
          list.push(this.listItemAdd(element, true));
        });
        list.forEach(element => {
          this.menuConfigitems.push(element);
        });
        if (environment.loadDemoMenu) {
          DynamicAsideMenuConfig.items.forEach(element => {
            this.menuConfigitems.push(element);
          });
        }
      }
    );
  }
  listItemAdd(item: CoreCpMainMenuModel, rootStatus = false): any {
    let retOut: any;
    retOut = {
      title: item.Title,
      root: rootStatus,
      page: item.RouteAddressLink,
      Color: item.Color,
      Icon: item.Icon,
      svg: '',
    };
    if (item.Children && item.Children.length > 0) {
      retOut.submenu = this.listItemsChildAdd(item);
    }
    return retOut;
  }
  listItemsChildAdd(item: CoreCpMainMenuModel): any {
    const list = [];
    if (item && item.Children) {
      item.Children.forEach(element => {
        list.push(this.listItemAdd(element));
      });
    }
    return list;
  }
  isMenuItemActive(path) {
    if (!this.currentUrl || !path) {
      return false;
    }

    if (this.currentUrl === path) {
      return true;
    }

    if (this.currentUrl.indexOf(path) > -1) {
      return true;
    }

    return false;
  }

  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();

    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
