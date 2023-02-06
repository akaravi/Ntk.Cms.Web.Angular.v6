
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreConfigurationService, ErrorExceptionResult } from 'ntk-cms-api';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-auth-singup-rule',
  templateUrl: './singupRule.Component.html',
})
export class SingupRuleComponent implements OnInit {
  constructor(
    private coreConfigurationService: CoreConfigurationService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<string> = new ErrorExceptionResult<string>();
  ngOnInit(): void {
    const pName = this.constructor.name + 'ServiceUserMembershipRule';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_the_rules'));
    this.coreConfigurationService
      .ServiceUserMembershipRule()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            // console.log(ret);
            this.dataModelResult = ret;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
        }
      }
      );
  }

}