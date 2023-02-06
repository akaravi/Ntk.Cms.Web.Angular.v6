
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreUserClaimCheckModel,
  CoreUserClaimContentService,
  EnumRecordStatus,
  ErrorExceptionResult,
  FilterModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CoreUserClaimContentAddComponent } from '../add/add.component';
import { CoreUserClaimContentEditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-core-userclaimcontent-widget-status',
  templateUrl: './widget-status.component.html',
  styleUrls: ['./widget-status.component.scss']
})
export class CoreUserClaimContentWidgetStatusComponent implements OnInit, OnDestroy {
  @Input() cssClass = '';
  @Input() widgetHeight = 'auto';
  @Input() baseColor = 'success';
  @Input() iconColor = 'success';
  textInverseCSSClass;
  svgCSSClass;
  constructor(
    private service: CoreUserClaimContentService,
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
  dataModelResult: ErrorExceptionResult<CoreUserClaimCheckModel> = new ErrorExceptionResult<CoreUserClaimCheckModel>();

  filteModelContent = new FilterModel();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  @Input()
  loading = new ProgressSpinnerModel();
  ngOnInit() {
    this.widgetInfoModel.title = this.translate.instant('TITLE.Evidence_Identity');
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/core/userclaim/checklist';

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

  onActionbuttonEditRow(model: CoreUserClaimCheckModel): void {
    if (!model || !model.linkTypeId || model.linkTypeId === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    if (model.linkContentId && model.linkContentId > 0) {
      const dialogRef = this.dialog.open(CoreUserClaimContentEditComponent, {
        height: '90%',
        data: { id: model.linkContentId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.dialogChangedDate) {
          this.onActionStatist();
        }
      });
    } else {
      const dialogRef = this.dialog.open(CoreUserClaimContentAddComponent, {
        height: '90%',
        data: { linkUserClaimTypeId: model.linkTypeId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.dialogChangedDate) {
          this.onActionStatist();
        }
      });
    }
  }
  onActionStatist(): void {

    const pName = this.constructor.name + 'ServiceClaimCheck';
    this.loading.Start(pName, this.translate.instant('TITLE.Verification_of_documents_and_identity'));
    this.service.ServiceClaimCheckCurrent().subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
          if (this.dataModelResult.listItems.find(x => x.recordStatus !== EnumRecordStatus.Pending && !x.isApproved)) {
            this.baseColor = 'warnning';
            this.cssClass = `bg-${this.baseColor} ${this.cssClass}`;
            this.textInverseCSSClass = `text-inverse-${this.baseColor}`;
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.loading.Stop(pName);
      }
    }
    );
  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
