import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreModuleSaleInvoiceService,
  CoreModuleSaleInvoiceModel,
  TokenInfoModel,
  NtkCmsApiStoreService,
  DataFieldInfoModel,
  CoreUserService,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  OnDestroy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';

@Component({
  selector: 'app-bankpayment-transactionlog-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class CoreModuleSaleInvoiceViewComponent implements OnInit, OnDestroy {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<CoreModuleSaleInvoiceViewComponent>,
    public coreEnumService: CoreEnumService,
    public coreModuleSaleInvoiceService: CoreModuleSaleInvoiceService,
    private cmsApiStore: NtkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
  ) {
    if (data) {
      this.requestId = + data.id || 0;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreModuleSaleInvoiceModel> = new ErrorExceptionResult<CoreModuleSaleInvoiceModel>();
  dataModel: CoreModuleSaleInvoiceModel = new CoreModuleSaleInvoiceModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumSendSmsStatusTypeResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  fileManagerOpenForm = false;

  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.formInfo.FormTitle = 'مشاهده  ';
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.tokenInfo = next;
    });
    this.getEnumSendSmsStatusType();
  }

  getEnumSendSmsStatusType(): void {
    this.coreEnumService.ServiceEnumSendSmsStatusType().subscribe((next) => {
      this.dataModelEnumSendSmsStatusTypeResult = next;
    });
  }

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }


  DataGetOneContent(): void {
    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.Start('main');
    this.cdr.detectChanges();
    /*َAccess Field*/
    this.coreModuleSaleInvoiceService.setAccessLoad();

    this.coreModuleSaleInvoiceService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        /*َAccess Field*/
        // this.dataAccessModel = next.Access;
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
        this.dataModel = next.Item;
        if (next.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.Id;
          this.formInfo.FormAlert = '';
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop('main');
    this.cdr.detectChanges();
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop('main');
    this.cdr.detectChanges();
      }
    );
  }


  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
