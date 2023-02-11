import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataFieldInfoModel, EnumManageUserAccessDataTypes, ErrorExceptionResult, TokenInfoModel, WebDesignerMainPageModel, WebDesignerMainPageService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { HtmlBuilderModel } from 'src/app/core/models/htmlBuilderModel';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-web-designer-builder',
  //template: '<router-outlet></router-outlet>',
  templateUrl: './web-designer-builder.component.html',
  styleUrls: ['./web-designer-builder.component.scss'],
})
export class WebDesignerBuilderComponent implements OnInit, OnDestroy {
  requestId = '';
  constructor(
    public tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    public webDesignerMainPageService: WebDesignerMainPageService,

  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModel: HtmlBuilderModel = new HtmlBuilderModel();
  dataPageModel: WebDesignerMainPageModel = new WebDesignerMainPageModel();
  dataModelResult: ErrorExceptionResult<WebDesignerMainPageModel> = new ErrorExceptionResult<WebDesignerMainPageModel>();

  ngOnInit(): void {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetOneContent();
      this.tokenHelper.CheckIsAdmin();
    });


    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.DataGetOneContent();
      this.tokenHelper.CheckIsAdmin();
    });
  }

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetOneContent(): void {
    const pName = this.constructor.name + 'webDesignerMainPageService.ServiceGetOneById';
    this.loading.Start(pName);
    this.webDesignerMainPageService.setAccessLoad();
    this.webDesignerMainPageService.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
    this.webDesignerMainPageService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.access);
        this.dataPageModel = next.item;
        if (next.isSuccess) {

        } else {
          this.cmsToastrService.typeErrorMessage(next.errorMessage);
        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
  }
  // DataEditContent(): void {
  //   const pName = this.constructor.name + 'main';
  //   this.loading.Start(pName, this.translate.instant('MESSAGE.sending_information_to_the_server'));
  //   this.webDesignerMainPageService.ServiceEdit(this.dataModel).subscribe(
  //     (next) => {

  //       this.dataModelResult = next;
  //       if (next.isSuccess) {
  //         this.cmsToastrService.typeSuccessEdit();
  //       } else {
  //         this.cmsToastrService.typeErrorMessage(next.errorMessage);
  //       }
  //       this.loading.Stop(pName);
  //     },
  //     (error) => {

  //       this.cmsToastrService.typeError(error);
  //       this.loading.Stop(pName);
  //     }
  //   );
  // }
  onActionAdd() {

  }


}
