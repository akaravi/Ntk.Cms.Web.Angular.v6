import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CoreAuthService, CoreCpMainMenuModel, CoreCpMainMenuService, NtkCmsApiStoreService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DynamicHeaderMenuConfig } from 'src/app/_metronic/configs/dynamic-header-menu.config';
import { environment } from 'src/environments/environment';
import { LayoutService, DynamicHeaderMenuService } from '../../../../../_metronic/core';

@Component({
  selector: 'app-header-menu-dynamic',
  templateUrl: './header-menu-dynamic.component.html',
  styleUrls: ['./header-menu-dynamic.component.scss']
})
export class HeaderMenuDynamicComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  currentUrl: string;
  menuConfigitems: any;

  ulCSSClasses: string;
  rootArrowEnabled: boolean;
  headerMenuDesktopToggle: string;

  constructor(
    private layout: LayoutService,
    private router: Router,
    private menu: DynamicHeaderMenuService,
    private cdr: ChangeDetectorRef,
    private coreCpMainMenuService: CoreCpMainMenuService,
    public coreAuthService: CoreAuthService,
    private cmsApiStore: NtkCmsApiStoreService,
    ) { }
    cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.ulCSSClasses = this.layout.getStringCSSClasses('header_menu_nav');
    this.rootArrowEnabled = this.layout.getProp('header.menu.self.rootArrow');
    this.headerMenuDesktopToggle = this.layout.getProp(
      'header.menu.desktop.toggle'
    );

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
  DataGetCpMenu(): void {
    this.menuConfigitems = [{
      title: 'Dashboards',
      root: true,
      alignment: 'left',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
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
          DynamicHeaderMenuConfig.items.forEach(element => {
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
}
