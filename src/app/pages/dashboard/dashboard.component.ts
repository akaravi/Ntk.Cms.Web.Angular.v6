import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleModel, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  constructor(
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public tokenHelper: TokenHelper,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  tokenInfo = new TokenInfoModel();
  cmsApiStoreSubscribe: Subscription;
  env = environment;
  dataCoreModuleModelResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();
  loading = new ProgressSpinnerModel();
  checkModuleExist: Map<string, CoreModuleModel> = new Map<string, CoreModuleModel>();
  ngOnInit(): void {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.getCurrentSiteModule();
      this.cdr.detectChanges();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper
      .getCurrentTokenOnChange()
      .subscribe((next) => {
        this.tokenInfo = next;
        this.getCurrentSiteModule();
        this.cdr.detectChanges();
      });
    localStorage.removeItem('siteId');
  }
  async getCurrentSiteModule(): Promise<void> {
    this.dataCoreModuleModelResult = await this.publicHelper.getCurrentSiteModule();
    this.checkModuleExist = new Map<string, CoreModuleModel>();
    if (this.dataCoreModuleModelResult && this.dataCoreModuleModelResult.listItems)
      this.dataCoreModuleModelResult.listItems.forEach((el) => this.checkModuleExist[el.className.toLowerCase()] = el);
  }


  //   CheckModuleExist(name: string): boolean {
  //     if (!name || name.length === 0 || !this.dataCoreModuleModelResult.listItems || this.dataCoreModuleModelResult.listItems.length === 0) {
  //       return false;
  //     }
  //     const retMdule = this.dataCoreModuleModelResult.listItems.find(x => x.className.toLowerCase() === name.toLowerCase());
  //     if (retMdule && retMdule.id > 0) {
  //       return true;
  //     }
  //     return false;
  //   }
}
