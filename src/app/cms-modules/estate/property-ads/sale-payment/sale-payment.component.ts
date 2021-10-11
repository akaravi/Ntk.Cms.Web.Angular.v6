import {
  ErrorExceptionResult,
  FormInfoModel,
  BankPaymentPrivateSiteConfigModel,
  EstateModuleSalePropertyAdsCalculateDtoModel,
  EstateModuleSalePropertyAdsPaymentDtoModel,
  BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel,
  EstateAdsTypeService,
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
  selector: 'app-estate-propertyads-salepayment',
  templateUrl: './sale-payment.component.html',
  styleUrls: ['./sale-payment.component.scss'],
})
export class EstatePropertyAdsSalePaymentComponent implements OnInit {
  requestLinkPropertyId = '';
  requestLinkAdsTypeId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: any,
    private dialogRef: MatDialogRef<EstatePropertyAdsSalePaymentComponent>,
    public estateAdsTypeService: EstateAdsTypeService,
    private cmsToastrService: CmsToastrService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.loading.cdr = this.cdr;
    if (data) {
      if (data.LinkPropertyId && data.LinkPropertyId.length > 0) {
        this.requestLinkPropertyId = data.LinkPropertyId;
      }
      if (data.LinkAdsTypeId && data.LinkAdsTypeId.length > 0) {
        this.requestLinkAdsTypeId = data.LinkAdsTypeId;
      }
    }
    if (this.requestLinkPropertyId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    if (this.requestLinkAdsTypeId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

    this.dataModelCalculate.LinkAdsTypeId = this.requestLinkAdsTypeId;
    this.dataModelCalculate.LinkPropertyId = this.requestLinkPropertyId;
    this.dataModelPayment.LinkAdsTypeId = this.requestLinkAdsTypeId;
    this.dataModelPayment.LinkPropertyId = this.requestLinkPropertyId;
    this.dataModelPayment.LastUrlAddressInUse = this.document.location.href;
  }
  viewCalculate = false;
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<BankPaymentPrivateSiteConfigModel> = new ErrorExceptionResult<BankPaymentPrivateSiteConfigModel>();
  dataModelCalculateResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep1CalculateModel>
    = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep1CalculateModel>();
  dataModelPaymentResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>
    = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>();
  dataModelCalculate: EstateModuleSalePropertyAdsCalculateDtoModel = new EstateModuleSalePropertyAdsCalculateDtoModel();
  dataModelPayment: EstateModuleSalePropertyAdsPaymentDtoModel = new EstateModuleSalePropertyAdsPaymentDtoModel();
  formInfo: FormInfoModel = new FormInfoModel();


  ngOnInit(): void {

    this.formInfo.FormTitle = 'انتخاب درگاه پرداخت';

  }
  DataCalculate(): void {
    this.viewCalculate = false;
    const pName = this.constructor.name + 'ServiceOrderCalculate';
    this.loading.Start(pName);
    this.estateAdsTypeService.ServiceOrderCalculate(this.dataModelCalculate).subscribe(
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
    const pName = this.constructor.name + 'ServiceOrderPayment';
    this.loading.Start(pName);
    this.estateAdsTypeService.ServiceOrderPayment(this.dataModelPayment).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelPaymentResult = next;
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Transferring_to_the_payment_gateway'));
          this.document.location.href = this.dataModelPaymentResult.Item.UrlToPay;
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
