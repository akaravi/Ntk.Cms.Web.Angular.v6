//**msh */
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import {
  AuthRenewTokenModel,
  CoreAuthService,
  CoreSiteUserModel,
  CoreSiteUserService,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel
} from 'ntk-cms-api';
import { CmsToastrService } from '../../../../core/services/cmsToastr.service';
import { TranslationService } from 'src/app/core/i18n/translation.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-site-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class CoreSiteSelectionComponent implements OnInit {

  constructor(
    private coreAuthService: CoreAuthService,
    private translationService: TranslationService,
    private coreSiteUserService: CoreSiteUserService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.loading.cdr = cdr;
  }
  @Input() loading = new ProgressSpinnerModel();

  today = new Date();
  filterModel = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreSiteUserModel>;
  formInfo: FormInfoModel = new FormInfoModel();
  statusCheckExistWebSite = true;
  selectSiteId = 0;
  ngOnInit(): void {
    // this.dataModel = this.activatedRoute.snapshot.data.list;
    this.DataGetAll();
  }
  DataGetAll(): void {
    const pName = this.constructor.name + 'ServiceGetAll';
    this.loading.Start(pName);

    this.coreSiteUserService.ServiceGetAll(null).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.dataModelResult = ret;
          this.statusCheckExistWebSite = false;
          if (this.dataModelResult.ListItems?.length === 1) {
            setTimeout(() => {
              this.onActionClickSelectSite(this.dataModelResult.ListItems[0].LinkSiteId);
            }, 1000);
          }
        }
        else {
          this.cmsToastrService.typeError(ret.ErrorMessage);
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }
  onActionClickSelectSite(id: number): void {
    if (!this.formInfo.ButtonSubmittedEnabled) {
      return;
    }
    this.selectSiteId = id;
    this.formInfo.ButtonSubmittedEnabled = false;
    let authModel: AuthRenewTokenModel;
    authModel = new AuthRenewTokenModel();
    authModel.SiteId = id;
    authModel.Lang = this.translationService.getSelectedLanguage();


    const pName = this.constructor.name + '.ServiceRenewToken';
    this.loading.Start(pName);

    this.coreAuthService.ServiceRenewToken(authModel).subscribe({
      next: (res) => {
        if (res.IsSuccess && res.Item.SiteId > 0) {
          this.cmsToastrService.typeSuccessSelected();
          this.loading.Stop(pName);
          this.router.navigate(['/']);
        }
        else {
          this.cmsToastrService.typeErrorSelected();
          this.formInfo.ButtonSubmittedEnabled = true;
        }
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.formInfo.ButtonSubmittedEnabled = true;
        this.loading.Stop(pName);
      }
    }
    );

  }

  onActionAddFirstSite(model: ErrorExceptionResult<any>): void {
    if (model.IsSuccess) {
      let authModel: AuthRenewTokenModel;
      authModel = new AuthRenewTokenModel();

      const pName = this.constructor.name + '.onActionAddFirstSite';
      this.loading.Start(pName);

      this.coreAuthService.ServiceRenewToken(authModel).subscribe({
        next: (ret) => {
          if (ret.IsSuccess) {
            this.router.navigate([environment.cmsUiConfig.Pathdashboard]);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
      );
    }
  }
}
