import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CoreConfigurationService } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  constructor(
    private configService: CoreConfigurationService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef) {
    this.loading.cdr = this.cdr;
  }
  loading = new ProgressSpinnerModel();
  today: Date = new Date();
  public innerWidth = 0;
  showSplashModel = true;
  ngOnInit(): void {
    this.innerWidth = + window.innerWidth;
    console.log(this.innerWidth);
    if (this.innerWidth < 1000) {
      setTimeout(() => {
        this.showSplashModel = false;
        this.cdr.markForCheck();
      }, 5000);
    }
    this.GetServiceVer();
  }
  GetServiceVer(): void {
    const pName = this.constructor.name + 'ServiceIp';
    this.loading.Start(pName, 'دریافت اطلاعات سرور');
    this.configService.ServiceIp().subscribe(
      async (next) => {
        if (next.IsSuccess) {
          this.publicHelper.appServerVersion = next.AppVersion
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
