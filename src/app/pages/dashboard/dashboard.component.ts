import { Component, OnInit } from '@angular/core';
import { CoreModuleModel, ErrorExceptionResult } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    public publicHelper: PublicHelper
  ) {
  }
  env = environment;
  dataCoreModuleModelResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();

  ngOnInit(): void {
    this.getCurrentSiteModule();
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
