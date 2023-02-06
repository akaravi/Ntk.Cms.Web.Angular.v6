
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationAppService, FilterModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
@Component({
  selector: 'app-application-app-widget-create',
  templateUrl: './widget-create.component.html',
})
export class ApplicationAppWidgetCreateComponent implements OnInit, OnDestroy {
  @Input() cssClass = '';
  constructor(
    private service: ApplicationAppService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  filteModelContent = new FilterModel();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  @Input()
  loading = new ProgressSpinnerModel();
  rowExist = false;
  ngOnInit() {
    this.widgetInfoModel.title = this.translate.instant('TITLE.Check_applications');
    this.widgetInfoModel.description = this.translate.instant('TITLE.Software_Introduce');
    this.widgetInfoModel.link = '/application/app';
    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.widgetInfoModel.description = this.translate.instant('TITLE.Software_Introduce');
      this.onActionStatist();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionStatist(): void {
    this.loading.Start(this.constructor.name + 'All', this.translate.instant('MESSAGE.Receiving_application_management_information'));
    this.service.ServiceGetExist(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.rowExist = true;
          this.widgetInfoModel.title = this.translate.instant('TITLE.Manage_Application');
          this.widgetInfoModel.link = '/application/app';
        }
        else {
          this.widgetInfoModel.title = this.translate.instant('TITLE.Build_Your_own_Application');
          this.widgetInfoModel.link = '/application/app/add';
        }
        this.loading.Stop(this.constructor.name + 'All');
      },
      error: (er) => {
        this.widgetInfoModel.title = this.translate.instant('TITLE.Build_Your_own_Application');
        this.widgetInfoModel.link = '/application/app';
        this.loading.Stop(this.constructor.name + 'All');
      }
    }
    );
  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
