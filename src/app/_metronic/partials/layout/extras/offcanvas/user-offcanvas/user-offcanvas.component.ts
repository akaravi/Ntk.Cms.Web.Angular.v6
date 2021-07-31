import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { Observable, Subscription } from 'rxjs';
import { UserModel } from '../../../../../../modules/auth/_models/user.model';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CoreAuthService, NtkCmsApiStoreService, TokenInfoModel } from 'ntk-cms-api';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit, OnDestroy {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  // user$: Observable<UserModel>;

  constructor(
    private layout: LayoutService,
    private auth: AuthService,
    private coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private cmsApiStore: NtkCmsApiStoreService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { }
  tokenInfo: TokenInfoModel;
  cmsApiStoreSubscribe: Subscription;
  loading = new ProgressSpinnerModel();

  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    // this.user$ = this.auth.currentUserSubject.asObservable();

    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((value) => {
      this.tokenInfo = value;
      this.cdr.detectChanges();
    });
  }
  async logout() {
    // this.auth.logout();
    this.cmsToastrService.typeOrderActionLogout();
    const retOut = await this.coreAuthService.ServiceLogout().pipe(map(next => {
      this.loading.display = false;
      if (next.IsSuccess) {
        this.cmsToastrService.typeSuccessLogout();
      } else {
        this.cmsToastrService.typeErrorLogout();
      }
      return;
    })).toPromise();
    document.location.reload();
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
}
