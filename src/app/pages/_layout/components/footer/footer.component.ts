import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LayoutService } from '../../../../_metronic/core';
import KTLayoutFooter from '../../../../../assets/js/layout/base/footer';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CoreConfigurationService } from 'ntk-cms-api';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, AfterViewInit {
  footerContainerCSSClasses: string;
  currentYear: string;
  footerLayout: string;

  constructor(
    private configService: CoreConfigurationService,
    private layout: LayoutService,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper) {
    this.loading.cdr = this.cdr;
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear().toString();
    this.publicHelper.appServerVersion
  }
  loading = new ProgressSpinnerModel();

  ngOnInit(): void {
    this.footerContainerCSSClasses = this.layout.getStringCSSClasses(
      'footer_container'
    );
    this.footerLayout = this.layout.getProp('footer.layout');
    this.GetServiceVer();
  }

  ngAfterViewInit() {
    // Init Footer
    KTLayoutFooter.init('kt_footer');
  }
  GetServiceVer(): void {
    const pName = this.constructor.name + 'ServiceIp';
    this.loading.Start(pName, 'دریافت اطلاعات سرور');
    this.configService.ServiceIp().subscribe(
      async (next) => {
        if (next.IsSuccess) {
          this.publicHelper.appServerVersion=next.AppVersion
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
