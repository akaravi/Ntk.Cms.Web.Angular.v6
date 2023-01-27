import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreAuthService, CoreCpMainMenuModel, CoreCpMainMenuService, TokenInfoModel } from 'ntk-cms-api';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';

const emptyMenuConfig = {
  items: []
};

@Injectable({
  providedIn: 'root'
})
export class DynamicHeaderMenuService implements OnDestroy {
  private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
  menuConfig$: Observable<any>;
  constructor(
    private coreCpMainMenuService: CoreCpMainMenuService,
    public coreAuthService: CoreAuthService,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.menuConfig$ = this.menuConfigSubject.asObservable();
    this.setMenu([]);
    // this.loadMenu();

    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo && this.tokenInfo.userId > 0 && this.tokenInfo.siteId > 0) {
        setTimeout(() => { this.DataGetCpMenu(); }, 1000);
      }
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;

      if (this.tokenInfo && this.tokenInfo.userId > 0 && this.tokenInfo.siteId > 0) {
        setTimeout(() => { this.DataGetCpMenu(); }, 1000);
      }
    });
  }
  tokenInfo = new TokenInfoModel();
  cmsApiStoreSubscribe: Subscription;


  private setMenu(menuConfig) {
    this.menuConfigSubject.next(menuConfig);
  }

  private getMenu(): any {
    return this.menuConfigSubject.value;
  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetCpMenu(): void {
    const menuItems: any = [{
      title: this.translate.instant('MENU.DASHBOARD'),
      root: true,
      alignment: 'left',
      page: '/dashboard',
      translate: this.translate.instant('MENU.DASHBOARD'),
    }];
    this.coreCpMainMenuService.ServiceGetAllMenu(null).subscribe(
      (next) => {
        const list = [];
        next.listItems.forEach(element => {
          list.push(this.listItemAdd(element, true));
        });

        menuItems.push({
          title: this.translate.instant('MENU.MENU'),
          bullet: 'dot',
          icon: 'flaticon-web',
          page: '',
          //translate: 'MENU.MENU',
          mega: false,
          submenu: list
        });

        this.setMenu(menuItems);
      }
    );
  }
  listItemAdd(item: CoreCpMainMenuModel, rootStatus = false): any {
    let retOut: any;
    retOut = {
      title: item.titleML,
      root: rootStatus,
      page: (item.routeAddressLink?.length > 0) ? item.routeAddressLink : null,
      color: item.color,
      icon: item.icon,
      svg: '',
      bullet: 'dot',
      mega: true,
    };
    if (item.children && item.children.length > 0) {
      retOut.submenu = this.listItemsChildAdd(item);
    }
    return retOut;
  }
  listItemsChildAdd(item: CoreCpMainMenuModel): any {
    const list = [];
    if (item && item.children) {
      item.children.forEach(element => {
        list.push(this.listItemAdd(element));
      });
    }
    return list;
  }
}
