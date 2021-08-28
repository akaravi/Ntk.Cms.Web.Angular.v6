import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { CoreAuthService, ErrorExceptionResult, NtkCmsApiStoreService, SET_TOKEN_INFO, TokenInfoModel } from 'ntk-cms-api';
import { first, map, take, takeUntil, takeWhile } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CmsAuthGuard implements CanActivate, OnDestroy {
    constructor(
        private coreAuthService: CoreAuthService,
        private cmsApiStore: NtkCmsApiStoreService,
        private router: Router) {
    }
    runSubscribe = false;
    subscriptions: Subscription;
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const token = this.coreAuthService.getUserToken();
        if (!token || token.length === 0) {
            this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        const storeSnapshot = this.cmsApiStore.getStateSnapshot();
        let tokenInfo: TokenInfoModel = new TokenInfoModel();
        if (storeSnapshot?.ntkCmsAPiState?.tokenInfo) {
            tokenInfo = storeSnapshot.ntkCmsAPiState.tokenInfo;
            if (tokenInfo && tokenInfo.UserId > 0) {
                return true;
            }
        }
        this.subscriptions = this.coreAuthService.ServiceCurrentToken().subscribe(
            (next) => {
                this.cmsApiStore.setState({ type: SET_TOKEN_INFO, payload: next.Item });
                tokenInfo = next.Item;
                this.runSubscribe = true;
                return;
            },
            (error) => {
                this.runSubscribe = true;
            }
        );
        while (!this.runSubscribe) {
            await this.delay(1000);
        }
        if (tokenInfo && tokenInfo.UserId > 0) {
            return true;
        }
        this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });
        return false;
    }
    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
