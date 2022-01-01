import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CoreUserClaimCheckModel,
  CoreUserClaimContentService,
  EnumRecordStatus,
  ErrorExceptionResult,
  FilterModel} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CoreUserClaimContentAddComponent } from '../add/add.component';
import { CoreUserClaimContentEditComponent } from '../edit/edit.component';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService,

  ) {
    this.loading.cdr = this.cdr;
  }
  dataModelResult: ErrorExceptionResult<CoreUserClaimCheckModel> = new ErrorExceptionResult<CoreUserClaimCheckModel>();

  filteModelContent = new FilterModel();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  loading = new ProgressSpinnerModel();
  ngOnInit() {
    this.widgetInfoModel.title = this.translate.instant('TITLE.Evidence_Identity');
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/core/userclaim/checklist';

    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
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
    if (!model || !model.LinkTypeId || model.LinkTypeId === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    if (model.LinkContentId && model.LinkContentId > 0) {
      const dialogRef = this.dialog.open(CoreUserClaimContentEditComponent, {
        height: '90%',
        data: { id: model.LinkContentId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.dialogChangedDate) {
          this.onActionStatist();
        }
      });
    } else {
      const dialogRef = this.dialog.open(CoreUserClaimContentAddComponent, {
        height: '90%',
        data: { LinkUserClaimTypeId: model.LinkTypeId }
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
    this.loading.Start(pName, 'بررسی تایید مدارک و هویت');
    this.service.ServiceClaimCheckCurrent().subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          if (this.dataModelResult.ListItems.find(x => x.RecordStatus !== EnumRecordStatus.Pending && !x.IsApproved)) {
            this.baseColor = 'warnning';
            this.cssClass = `bg-${this.baseColor} ${this.cssClass}`;
            this.textInverseCSSClass = `text-inverse-${this.baseColor}`;
          }
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.loading.Stop(pName);
      }
    );
  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
