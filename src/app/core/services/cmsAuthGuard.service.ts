import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import {Injectable} from '@angular/core';
import {CoreAuthService} from 'ntk-cms-api';

@Injectable({
  providedIn: 'root'
})
export class CmsAuthGuard implements CanActivate {
    constructor(private authService: CoreAuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const token = this.authService.getUserToken();
        if (token && token.length > 0) {
            return true;
        }
        this.router.navigate(['auth'], {queryParams: {returnUrl: state.url}});

        return false;
    }
}
