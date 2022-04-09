import {
  EnumInfoModel,
  ErrorExceptionResult,
  DataProviderPlanSourceModel,
  DataProviderPlanSourceService,
  DataFieldInfoModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsLinkToComponent } from 'src/app/shared/cms-link-to/cms-link-to.component';
import { MatDialog } from '@angular/material/dialog';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-data-provider-plan-source-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class DataProviderPlanSourceHeaderComponent implements OnInit , OnDestroy{
  constructor(
    private headerService: DataProviderPlanSourceService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
    public dialog: MatDialog,
    public tokenHelper: TokenHelper
  ) {
    this.loading.cdr = this.cdr;
  }
  @Input() optionId = '';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<DataProviderPlanSourceModel> = new ErrorExceptionResult<DataProviderPlanSourceModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();

  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    if (this.optionId?.length > 0) {
      this.DataGetOneContent();
    }
    this.getEnumRecordStatus();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.DataGetOneContent();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  DataGetOneContent(): void {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.headerService.setAccessLoad();
    this.headerService.ServiceGetOneById(this.optionId.length).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
        if (next.IsSuccess) {
          this.dataModelResult = next;
        } else {
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);

      }
    );
  }
  onActionbuttonLinkTo(model: DataProviderPlanSourceModel=this.dataModelResult.Item): void {
    if (!model || !model.Id || model.Id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    //open popup
    const dialogRef = this.dialog.open(CmsLinkToComponent, {
      // height: "90%",
      data: {
        // Title: model.Title,
        UrlViewContentQRCodeBase64:'',
        UrlViewContent:'',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
}
