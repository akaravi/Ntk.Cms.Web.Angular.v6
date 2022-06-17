import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleModel, EnumManageUserAccessUserTypes, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
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
    private tokenHelper: TokenHelper,
  ) {

    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');

  }
  tokenInfo = new TokenInfoModel();
  env = environment;
  dataCoreModuleModelResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();
  loading = new ProgressSpinnerModel();
  IsAdminSite=false;
  ngOnInit(): void {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.AdminCpSite
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.AdminMainCms
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.AdminResellerCms
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.SupportCpSite
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.SupportMainCms
        || this.tokenInfo.userAccessUserType === EnumManageUserAccessUserTypes.SupportResellerCms) {
        this.IsAdminSite = true;
      }
      else {
        this.IsAdminSite = false;
      }
    });
    this.getCurrentSiteModule();
    localStorage.removeItem('siteId');
    
  }
  async getCurrentSiteModule(): Promise<void> {
    this.dataCoreModuleModelResult = await this.publicHelper.getCurrentSiteModule();
  }
  CheckModuleExist(name: string): boolean {
    if (!name || name.length === 0 || !this.dataCoreModuleModelResult.listItems || this.dataCoreModuleModelResult.listItems.length === 0) {
      return false;
    }
    const retMdule = this.dataCoreModuleModelResult.listItems.find(x => x.className.toLowerCase() === name.toLowerCase());
    if (retMdule && retMdule.id > 0) {
      return true;
    }
    return false;
  }
}
