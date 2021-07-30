import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';


import {
  AuthRenewTokenModel,
  CoreAuthService,
  CoreSiteModel,
  CoreSiteService,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel
} from 'ntk-cms-api';
import { CmsToastrService } from '../../../../core/services/cmsToastr.service';
import { TranslationService } from 'src/app/core/i18n/translation.service';


@Component({
  selector: 'app-site-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class CoreSiteSelectionComponent implements OnInit {

  subManager = new Subscription();
  filterModel = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreSiteModel>;

  constructor(
    private coreAuthService: CoreAuthService,
    private translationService: TranslationService,
    private coreSiteService: CoreSiteService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
  ) {

  }
  formInfo: FormInfoModel = new FormInfoModel();
  statusCheckExistWebSite = true;
  ngOnInit(): void {
    // this.dataModel = this.activatedRoute.snapshot.data.list;
    this.DataGetAll();

  }
  DataGetAll(): void {

    this.coreSiteService.ServiceGetAll(null).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.statusCheckExistWebSite = false;
        }
        else {
          this.cmsToastrService.typeError(next.ErrorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
      }
    );
  }

  onActionClickSelectSite(id: number): void {
    if (!this.formInfo.ButtonSubmittedEnabled) {
      return;
    }

    this.formInfo.ButtonSubmittedEnabled = false;
    let authModel: AuthRenewTokenModel;
    authModel = new AuthRenewTokenModel();
    authModel.SiteId = id;
    authModel.Lang= this.translationService.getSelectedLanguage()
    this.subManager.add(
      this.coreAuthService.ServiceRenewToken(authModel).subscribe(
        (res) => {
          if (res.IsSuccess) {
            this.cmsToastrService.typeSuccessSelected();
            this.formInfo.ButtonSubmittedEnabled = true;
            this.router.navigate(['/']);
          }
          else {
            this.cmsToastrService.typeErrorSelected();
            this.formInfo.ButtonSubmittedEnabled = true;
          }
        },
        (error) => {
          this.cmsToastrService.typeError(error);
          this.formInfo.ButtonSubmittedEnabled = true;
        }
      )
    );
  }

  onActionAddFirstSite(model: ErrorExceptionResult<any>): void {
    if (model.IsSuccess) {
      let authModel: AuthRenewTokenModel;
      authModel = new AuthRenewTokenModel();
      // authModel.SiteId = model.Id;
      this.subManager.add(
        this.coreAuthService.ServiceRenewToken(authModel).subscribe(
          (next) => {
            if (next.IsSuccess) {
              this.router.navigate([environment.cmsUiConfig.Pathdashboard]);
            }
          },
          (error) => {
            this.cmsToastrService.typeError(error);
          }
        )
      );
    }
  }
}
