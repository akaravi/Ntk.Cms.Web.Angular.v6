
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
    public translate: TranslateService,
    private cdr: ChangeDetectorRef) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  loading = new ProgressSpinnerModel();
  today: Date = new Date();
  public innerWidth = 0;
  showSplashModel = true;
  ngOnInit(): void {
    this.innerWidth = + window.innerWidth;
    //console.log('windows size:',this.innerWidth);
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
    this.loading.Start(pName, this.translate.instant('MESSAGE.Receiving_Information_From_The_Server'));
    this.configService.ServiceIp().subscribe({
      next: (ret) => {
        this.publicHelper.appServerVersion = ret.appVersion
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