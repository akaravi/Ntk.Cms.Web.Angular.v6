//**msh */
import {
  ErrorExceptionResult,
  FormInfoModel,
  BankPaymentPrivateSiteConfigModel,
  CoreModuleSaleHeaderCalculateDtoModel,
  CoreModuleSaleHeaderPaymentDtoModel,
  CoreModuleSaleHeaderService,
  BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel,
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
  selector: 'app-core-modulesaleheader-sale-payment',
  templateUrl: './sale-payment.component.html',
  styleUrls: ['./sale-payment.component.scss'],
})
export class CoreModuleSaleHeaderSalePaymentComponent implements OnInit {
  requestLinkHeaderId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: any,
    private dialogRef: MatDialogRef<CoreModuleSaleHeaderSalePaymentComponent>,
    public coreModuleSaleHeaderService: CoreModuleSaleHeaderService,

    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestLinkHeaderId = + data.linkHeaderId || 0;
    }
    if (this.requestLinkHeaderId === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

    this.dataModelCalculate.linkHeaderId = this.requestLinkHeaderId;
    this.dataModelPayment.linkHeaderId = this.requestLinkHeaderId;
    this.dataModelPayment.lastUrlAddressInUse = this.document.location.href;
  }
  viewCalculate = false;

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<BankPaymentPrivateSiteConfigModel> = new ErrorExceptionResult<BankPaymentPrivateSiteConfigModel>();
  dataModelCalculateResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep1CalculateModel>
    = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep1CalculateModel>();
  dataModelPaymentResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>
    = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>();
  dataModelCalculate: CoreModuleSaleHeaderCalculateDtoModel = new CoreModuleSaleHeaderCalculateDtoModel();
  dataModelPayment: CoreModuleSaleHeaderPaymentDtoModel = new CoreModuleSaleHeaderPaymentDtoModel();
  formInfo: FormInfoModel = new FormInfoModel();


  ngOnInit(): void {
    this.formInfo.formTitle = 'انتخاب درگاه پرداخت';

  }

  DataCalculate(): void {
    this.viewCalculate = false;
    const pName = this.constructor.name + 'ServiceOrderCalculate';
    this.loading.Start(pName);
    this.coreModuleSaleHeaderService.ServiceOrderCalculate(this.dataModelCalculate).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelCalculateResult = ret;
          this.viewCalculate = true;
        }
        else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
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
    const pName = this.constructor.name + 'ServiceOrderPayment';
    this.loading.Start(pName);
    this.coreModuleSaleHeaderService.ServiceOrderPayment(this.dataModelPayment).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelPaymentResult = ret;
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Transferring_to_the_payment_gateway'));
          localStorage.setItem('TransactionId', ret.item.transactionId.toString());
          this.document.location.href = this.dataModelPaymentResult.item.urlToPay;
        }
        else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
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
