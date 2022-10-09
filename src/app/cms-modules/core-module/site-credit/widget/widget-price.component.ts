
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CoreModuleSiteCreditModel,
  CoreModuleSiteCreditService,
  EnumRecordStatus,
  ErrorExceptionResult,
  FilterModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-coremodule-site-credit-widget-price',
  templateUrl: './widget-price.component.html',
  styleUrls: ['./widget-price.component.scss']
})
export class CoreModuleSiteCreditWidgetPriceComponent implements OnInit, OnDestroy {
  @Input() cssClass = '';
  @Input() widgetHeight = 'auto';
  @Input() baseColor = 'success';
  @Input() iconColor = 'success';
  textInverseCSSClass;
  svgCSSClass;
  constructor(
    private service: CoreModuleSiteCreditService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    public translate: TranslateService,

  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  dataModelResult: ErrorExceptionResult<CoreModuleSiteCreditModel> = new ErrorExceptionResult<CoreModuleSiteCreditModel>();

  filteModelContent = new FilterModel();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  @Input()
  loading = new ProgressSpinnerModel();
  ngOnInit() {
    this.widgetInfoModel.title = this.translate.instant('TITLE.Evidence_Identity');
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/core-module/site-credit/';

    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.widgetInfoModel.title = this.translate.instant('TITLE.Evidence_Identity');
      this.onActionStatist();
    });

    this.cssClass = `bg-${this.baseColor} ${this.cssClass}`;
    this.textInverseCSSClass = `text-inverse-${this.baseColor}`;
    this.svgCSSClass = `svg-icon--${this.iconColor}`;
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();

  }

  onActionStatist(): void {

    // const pName = this.constructor.name + 'ServiceClaimCheck';
    // this.loading.Start(pName, this.translate.instant('TITLE.Verification_of_documents_and_identity'));
    // this.service.ServiceGetCredit().subscribe({
    //   next: (ret) => {
    //     if (ret.isSuccess) {
    //       this.dataModelResult = ret;
    //       console.log(this.dataModelResult);
    //     } else {
    //       this.cmsToastrService.typeErrorMessage(ret.errorMessage);
    //     }
    //     this.loading.Stop(pName);
    //   },
    //   error: (er) => {
    //     this.loading.Stop(pName);
    //   }
    // }
    // );
  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
