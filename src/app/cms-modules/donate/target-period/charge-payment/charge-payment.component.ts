import {
  ErrorExceptionResult,
  FormInfoModel,
  BankPaymentPrivateSiteConfigModel,
  DonateModuleCalculateDtoModel,
  DonateModulePaymentDtoModel,
  BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel,
  DonateTransactionService,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { BankPaymentInjectPaymentGotoBankStep1CalculateModel } from 'ntk-cms-api/lib/models/dto/bankPayment/bankPaymentInjectPaymentGotoBankStep1CalculateModel';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-donate-target-period-charge-payment',
  templateUrl: './charge-payment.component.html',
  styleUrls: ['./charge-payment.component.scss'],
})
export class DonateTargetPeriodChargePaymentComponent implements OnInit {
  requestSupportPayment = 0;
  requestLinkTargetPeriodId = 0;
  requestBankPrivateMaster = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: any,
    private dialogRef: MatDialogRef<DonateTargetPeriodChargePaymentComponent>,
    private cmsToastrService: CmsToastrService,
    private donateTransactionService: DonateTransactionService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.loading.cdr = this.cdr;
    if (data) {
      if (data.requestSupport && data.requestSupport > 0) {
        this.requestSupportPayment = data.requestSupport;
      }
      if (data.LinkModuleId && data.LinkModuleId > 0) {
        this.requestLinkTargetPeriodId = data.LinkModuleId;
      }
    }
    if (this.requestSupportPayment === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    if (this.requestLinkTargetPeriodId === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

    this.dataModelCalculate.SupportPayment = this.requestSupportPayment;
    this.dataModelCalculate.LinkTargetPeriodId = this.requestLinkTargetPeriodId;
    this.dataModelPayment.SupportPayment = this.requestSupportPayment;
    this.dataModelPayment.LinkTargetPeriodId = this.requestLinkTargetPeriodId;
    this.dataModelPayment.LastUrlAddressInUse = this.document.location.href;
  }
  viewCalculate = false;

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<BankPaymentPrivateSiteConfigModel> = new ErrorExceptionResult<BankPaymentPrivateSiteConfigModel>();
  dataModelCalculateResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep1CalculateModel>
    = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep1CalculateModel>();
  dataModelPaymentResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>
    = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>();

  dataModelCalculate: DonateModuleCalculateDtoModel = new DonateModuleCalculateDtoModel();
  dataModelPayment: DonateModulePaymentDtoModel = new DonateModulePaymentDtoModel();
  formInfo: FormInfoModel = new FormInfoModel();


  ngOnInit(): void {
    this.formInfo.FormTitle = 'انتخاب درگاه پرداخت';

  }

  DataCalculate(): void {
    this.viewCalculate = false;
    const pName = this.constructor.name + 'ServiceOrderCalculate';
    this.loading.Start(pName);
    this.donateTransactionService.ServiceOrderCalculate(this.dataModelCalculate).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelCalculateResult = next;
          this.viewCalculate = true;
        }
        else {
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
  DataPayment(): void {
    this.formInfo.FormSubmitAllow = false;
    const pName = this.constructor.name + 'ServiceOrderPayment';
    this.loading.Start(pName);
    this.donateTransactionService.ServiceOrderPayment(this.dataModelPayment).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelPaymentResult = next;
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Transferring_to_the_payment_gateway'));
          localStorage.setItem('TransactionId', next.Item.TransactionId.toString());
          this.document.location.href = this.dataModelPaymentResult.Item.UrlToPay;
        }
        else {
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
          this.formInfo.FormSubmitAllow = true;
        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.formInfo.FormSubmitAllow = true;
        this.loading.Stop(pName);

      }
    );
  }
  onActionSelectCalculate(model: BankPaymentPrivateSiteConfigModel): void {
    this.dataModelCalculate.BankPaymentPrivateId = model.Id;
    this.dataModelPayment.BankPaymentPrivateId = model.Id;
    this.DataCalculate();
  }
  onActionSelectBankPayment(): void {

    this.DataPayment();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
