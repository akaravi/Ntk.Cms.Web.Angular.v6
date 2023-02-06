import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
//
import { TranslateService } from '@ngx-translate/core';
import { CoreConfigurationService } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { LayoutService } from 'src/app/core/services/layout.service';
import KTLayoutFooter from '../../../../../assets/js/layout/base/footer';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
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
    public translate: TranslateService,
    public publicHelper: PublicHelper) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
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
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_from_the_server'));
    this.configService.ServiceIp().subscribe(
      async (next) => {
        this.publicHelper.appServerVersion = next.appVersion
        this.loading.Stop(pName);
      },
      (error) => {
        this.cmsToastrService.typeErrorGetOne(error);
        this.loading.Stop(pName);
      }
    );
  }
}
