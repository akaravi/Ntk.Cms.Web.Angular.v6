
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthRenewTokenModel,
  CoreAuthService,
  CoreSiteUserModel,
  CoreSiteUserService,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel
} from 'ntk-cms-api';
import { TranslationService } from 'src/app/core/i18n/translation.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from '../../../../core/services/cmsToastr.service';


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

    this.coreSiteUserService.ServiceGetAllSiteCurrentUser().subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.statusCheckExistWebSite = false;
          if (this.dataModelResult.listItems?.length === 1) {
            setTimeout(() => {
              this.onActionClickSelectSite(this.dataModelResult.listItems[0].linkSiteId);
            }, 1000);
          }
        }
        else {
          this.cmsToastrService.typeError(ret.errorMessage);
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
    if (!this.formInfo.buttonSubmittedEnabled) {
      return;
    }
    this.selectSiteId = id;
    this.formInfo.buttonSubmittedEnabled = false;
    let authModel: AuthRenewTokenModel;
    authModel = new AuthRenewTokenModel();
    authModel.siteId = id;
    authModel.lang = this.translationService.getSelectedLanguage();


    const pName = this.constructor.name + '.ServiceRenewToken';
    this.loading.Start(pName);

    this.coreAuthService.ServiceRenewToken(authModel).subscribe({
      next: (res) => {
        if (res.isSuccess && res.item.siteId > 0) {
          this.cmsToastrService.typeSuccessSelected();
          this.loading.Stop(pName);
          setTimeout(() => this.router.navigate(['/']), 5000);
        }
        else {
          this.cmsToastrService.typeErrorSelected();
          this.formInfo.buttonSubmittedEnabled = true;
        }
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.formInfo.buttonSubmittedEnabled = true;
        this.loading.Stop(pName);
      }
    }
    );

  }

  onActionAddFirstSite(model: ErrorExceptionResult<any>): void {
    if (model.isSuccess) {
      let authModel: AuthRenewTokenModel;
      authModel = new AuthRenewTokenModel();

      const pName = this.constructor.name + '.onActionAddFirstSite';
      this.loading.Start(pName);

      this.coreAuthService.ServiceRenewToken(authModel).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {

            setTimeout(() => this.router.navigate(['/dashboard/']), 5000);
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
