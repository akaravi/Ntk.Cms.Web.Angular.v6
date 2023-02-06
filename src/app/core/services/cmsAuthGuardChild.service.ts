import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot
} from '@angular/router';
import { CoreAuthService } from 'ntk-cms-api';

@Injectable({
  providedIn: 'root'
})
export class CmsAuthGuardChild implements CanActivateChild {
  constructor(private authService: CoreAuthService, private router: Router) {
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authService.getUserToken();
    if (token && token.length > 0) {
      return true;
    }
    this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });

    return false;
  }
}
