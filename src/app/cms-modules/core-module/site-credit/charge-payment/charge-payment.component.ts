//**msh */
import {
  ErrorExceptionResult,
  FormInfoModel,
  BankPaymentPrivateSiteConfigModel,
  CoreModuleSiteCreditCalculateDtoModel,
  CoreModuleSiteCreditPaymentDtoModel,
  BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel,
  CoreModuleSiteCreditService,
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
  selector: 'app-coremodule-site-credit-charge-payment',
  templateUrl: './charge-payment.component.html',
  styleUrls: ['./charge-payment.component.scss'],
})
export class CoreModuleSiteCreditChargePaymentComponent implements OnInit {
  requestCredit = 0;
  requestLinkModuleId = 0;
  requestBankPrivateMaster = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: any,
    private dialogRef: MatDialogRef<CoreModuleSiteCreditChargePaymentComponent>,
    private cmsToastrService: CmsToastrService,
    private coreModuleSiteCreditService: CoreModuleSiteCreditService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      if (data.Credit && data.Credit > 0) {
        this.requestCredit = data.Credit;
      }
      if (data.linkModuleId && data.linkModuleId > 0) {
        this.requestLinkModuleId = data.linkModuleId;
      }
    }
    if (this.requestCredit === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    if (this.requestLinkModuleId === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

    this.dataModelCalculate.credit = this.requestCredit;
    this.dataModelCalculate.linkModuleId = this.requestLinkModuleId;
    this.dataModelPayment.credit = this.requestCredit;
    this.dataModelPayment.linkModuleId = this.requestLinkModuleId;
    this.dataModelPayment.lastUrlAddressInUse = this.document.location.href;
  }
  viewCalculate = false;

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<BankPaymentPrivateSiteConfigModel> = new ErrorExceptionResult<BankPaymentPrivateSiteConfigModel>();
  dataModelCalculateResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep1CalculateModel>
    = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep1CalculateModel>();
  dataModelPaymentResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>
    = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>();

  dataModelCalculate: CoreModuleSiteCreditCalculateDtoModel = new CoreModuleSiteCreditCalculateDtoModel();
  dataModelPayment: CoreModuleSiteCreditPaymentDtoModel = new CoreModuleSiteCreditPaymentDtoModel();
  formInfo: FormInfoModel = new FormInfoModel();


  ngOnInit(): void {
    this.formInfo.formTitle = 'انتخاب درگاه پرداخت';

  }

  DataCalculate(): void {
    this.viewCalculate = false;
    const pName = this.constructor.name + 'ServiceOrderCalculate';
    this.loading.Start(pName);
    this.coreModuleSiteCreditService.ServiceOrderCalculate(this.dataModelCalculate).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelCalculateResult = ret;
          this.viewCalculate = true;
        }
        else {
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.cmsToastrService.typeError(er);

        this.loading.Stop(pName);
      }
    }
    );
  }
  DataPayment(): void {
    this.formInfo.formSubmitAllow = false;
    const pName = this.constructor.name + 'ServiceOrderPayment';
    this.loading.Start(pName);
    this.coreModuleSiteCreditService.ServiceOrderPayment(this.dataModelPayment).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelPaymentResult = ret;
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Transferring_to_the_payment_gateway'));
          localStorage.setItem('TransactionId', ret.item.transactionId.toString());
          this.document.location.href = this.dataModelPaymentResult.item.urlToPay;
        }
        else {
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
          this.formInfo.formSubmitAllow = true;
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.formInfo.formSubmitAllow = true;
        this.loading.Stop(pName);
      }
    }
    );
  }
  onActionSelectCalculate(model: BankPaymentPrivateSiteConfigModel): void {
    this.dataModelCalculate.bankPaymentPrivateId = model.id;
    this.dataModelPayment.bankPaymentPrivateId = model.id;
    this.DataCalculate();
  }
  onActionSelectBankPayment(): void {

    this.DataPayment();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
