import { Injectable, OnDestroy } from '@angular/core';
import { CoreAuthService, CoreCpMainMenuModel, CoreCpMainMenuService, NtkCmsApiStoreService, TokenInfoModel } from 'ntk-cms-api';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { environment } from 'src/environments/environment';
import { DynamicAsideMenuConfig } from '../../configs/dynamic-aside-menu.config';

const emptyMenuConfig = {
  items: []
};

@Injectable({
  providedIn: 'root'
})
export class DynamicAsideMenuService implements OnDestroy {
  private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
  menuConfig$: Observable<any>;
  constructor(
    private coreCpMainMenuService: CoreCpMainMenuService,
    public coreAuthService: CoreAuthService,
    private cmsApiStore: NtkCmsApiStoreService,
    private tokenHelper: TokenHelper
  ) {
    this.menuConfig$ = this.menuConfigSubject.asObservable();
    this.setMenu([]);
    // this.loadMenu();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo && this.tokenInfo.UserId > 0 && this.tokenInfo.SiteId > 0) {
        this.DataGetCpMenu();
      }
    });
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState( (state) => state.ntkCmsAPiState.tokenInfo).subscribe((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo && this.tokenInfo.UserId > 0 && this.tokenInfo.SiteId > 0) {
        this.DataGetCpMenu();
      }
    });
  }
  tokenInfo = new TokenInfoModel();
  cmsApiStoreSubscribe: Subscription;
  // Here you able to load your menu from server/data-base/localStorage
  // Default => from DynamicAsideMenuConfig
  // private loadMenu() {
  //   this.setMenu(DynamicAsideMenuConfig);
  // }

  private setMenu(menuConfig) {
    this.menuConfigSubject.next(menuConfig);
  }

  private getMenu(): any {
    return this.menuConfigSubject.value;
  }
  DataGetCpMenu(): void {
    const menuItems: any = [{
      title: 'داشبورد',
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
          menuItems.push(element);
        });
        if (environment.loadDemoMenu) {
          DynamicAsideMenuConfig.items.forEach(element => {
            menuItems.push(element);
          });
        }
        //this.setMenu(DynamicAsideMenuConfig);
        this.setMenu(menuItems);
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

  ngOnDestroy() {
    this.cmsApiStoreSubscribe .unsubscribe();
  }
}
