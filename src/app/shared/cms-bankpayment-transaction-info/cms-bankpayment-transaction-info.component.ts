import {
  ChangeDetectorRef, Component, Inject, Input, OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  BankPaymentEnumService, BankPaymentTransactionModel, BankPaymentTransactionService, EnumInfoModel, EnumTransactionRecordStatus, ErrorExceptionResult
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-bankpayment-transaction-info',
  templateUrl: './cms-bankpayment-transaction-info.component.html',
  styleUrls: ['./cms-bankpayment-transaction-info.component.scss'],
})
export class CmsBankpaymentTransactionInfoComponent implements OnInit {
  static nextId = 0;
  id = ++CmsBankpaymentTransactionInfoComponent.nextId;
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public bankPaymentTransactionService: BankPaymentTransactionService,
    private dialogRef: MatDialogRef<CmsBankpaymentTransactionInfoComponent>,
    private bankPaymentEnumService: BankPaymentEnumService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestId = + data.id || 0;
    }

  }
  @Input() loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<BankPaymentTransactionModel> = new ErrorExceptionResult<BankPaymentTransactionModel>();
  dataModelEnumTransactionRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();

  ngOnInit(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGeOne();
    this.getEnumTransactionRecordStatus();
  }
  getEnumTransactionRecordStatus(): void {
    this.bankPaymentEnumService.ServiceEnumTransactionRecordStatus().subscribe((next) => {
      this.dataModelEnumTransactionRecordStatusResult = next;
    });
  }
  TransactionSuccessful = EnumTransactionRecordStatus.TransactionSuccessful;
  DataGeOne(): void {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.bankPaymentTransactionService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        if (next.isSuccess) {
          this.dataModelResult = next;

        }
        else {
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
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: true });
  }
}
