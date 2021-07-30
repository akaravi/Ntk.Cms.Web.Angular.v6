import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TokenInfoModel } from 'ntk-cms-api';

@Injectable({
  providedIn: 'root',
})
export class CmsAuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<TokenInfoModel>;
  currentUserSubject: BehaviorSubject<TokenInfoModel>;

  get currentUserValue(): TokenInfoModel {
    return this.currentUserSubject.value;
  }

  constructor(
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<TokenInfoModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    // const subscr = this.getUserByToken().subscribe();
    // this.unsubscribe.push(subscr);
  }


  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
