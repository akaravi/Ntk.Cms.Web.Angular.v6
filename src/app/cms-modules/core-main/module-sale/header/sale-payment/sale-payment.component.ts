import {
  ErrorExceptionResult,
  FormInfoModel,
  BankPaymentPrivateSiteConfigService,
  BankPaymentPrivateSiteConfigModel,
  CoreModuleSaleHeaderCalculateDtoModel,
  CoreModuleSaleHeaderPaymentDtoModel,
  CoreModuleSaleHeaderService,
  CoreModuleSaleInvoiceDetailModel,
  BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
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
    private translate: TranslateService,
    private cmsStoreService: CmsStoreService,
    public publicHelper: PublicHelper,
  ) {
    if (data) {
      this.requestLinkHeaderId = + data.LinkHeaderId || 0;
    }
    if (this.requestLinkHeaderId === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

    this.dataModelCalculate.LinkHeaderId = this.requestLinkHeaderId;
    this.dataModelPayment.LinkHeaderId = this.requestLinkHeaderId ;
    this.dataModelPayment.LastUrlAddressInUse = this.document.location.href;
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
  storeSnapshot = this.cmsStoreService.getStateSnapshot();

  ngOnInit(): void {

    this.formInfo.FormTitle = 'انتخاب درگاه پرداخت';

  }
  DataCalculate(): void {
    this.viewCalculate = false;
    this.coreModuleSaleHeaderService.ServiceOrderCalculate(this.dataModelCalculate).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelCalculateResult = next;
          this.viewCalculate = true;
        }
        else {
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.display = false;
      },
      (error) => {
        this.cmsToastrService.typeError(error);

        this.loading.display = false;
      }
    );
  }
  DataPayment(): void {
    this.coreModuleSaleHeaderService.ServiceOrderPayment(this.dataModelPayment).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelPaymentResult = next;
            this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Transferring_to_the_payment_gateway'));
            this.document.location.href = this.dataModelPaymentResult.Item.UrlToPay;
        }
        else {
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.display = false;
      },
      (error) => {
        this.cmsToastrService.typeError(error);

        this.loading.display = false;
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
