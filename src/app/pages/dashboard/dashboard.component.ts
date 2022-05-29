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
  styleUrls: ['./dashboard.component.scss']
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
      if (this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.AdminCpSite
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.AdminMainCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.AdminResellerCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.SupportCpSite
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.SupportMainCms
        || this.tokenInfo.UserAccessUserType === EnumManageUserAccessUserTypes.SupportResellerCms) {
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
    if (!name || name.length === 0 || !this.dataCoreModuleModelResult.ListItems || this.dataCoreModuleModelResult.ListItems.length === 0) {
      return false;
    }
    const retMdule = this.dataCoreModuleModelResult.ListItems.find(x => x.ClassName.toLowerCase() === name.toLowerCase());
    if (retMdule && retMdule.Id > 0) {
      return true;
    }
    return false;
  }
}
