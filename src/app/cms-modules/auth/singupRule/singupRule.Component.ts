import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  ) {
    this.loading.cdr = this.cdr;
  }
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<string> = new ErrorExceptionResult<string>();
  ngOnInit(): void {
    const pName = this.constructor.name + 'ServiceUserMembershipRule';
    this.loading.Start(pName, 'دریافت تنظیمات پیش فرض ماژول');
    this.coreConfigurationService
      .ServiceUserMembershipRule()
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.dataModelResult = next;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
          this.loading.Stop(pName);
        },
        (error) => {
          this.cmsToastrService.typeErrorGetOne(error);
          this.loading.Stop(pName);
        }
      );
  }
}