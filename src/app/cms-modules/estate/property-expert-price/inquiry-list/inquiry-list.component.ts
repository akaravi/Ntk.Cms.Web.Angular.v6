
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreCurrencyModel, CoreEnumService, CoreLocationModel, EnumInfoModel,
  ErrorExceptionResult, EstateEnumService, EstatePriceInquiryDtoModel, EstatePropertyExpertPriceModel,
  EstatePropertyExpertPriceService, EstatePropertyTypeLanduseModel, EstatePropertyTypeUsageModel, FormInfoModel
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-property-expert-price-inquiry-list',
  templateUrl: './inquiry-list.component.html',
  styleUrls: ['./inquiry-list.component.scss'],
})
export class EstatePropertyExpertPriceInquiryListComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstatePropertyExpertPriceInquiryListComponent>,
    public coreEnumService: CoreEnumService,
    public estatePropertyExpertPriceService: EstatePropertyExpertPriceService,
    private estateEnumService: EstateEnumService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.dataModel.linkLocationId = +data.linkLocationId | 0;
      this.dataModel.linkCoreCurrencyId = +data.linkCoreCurrencyId | 0;
      this.dataModel.createdYaer = +data.createdYaer | 0;
      this.dataModel.linkContractTypeId = data.linkContractTypeId;
      this.dataModel.linkPropertyTypeLanduseId = data.linkPropertyTypeLanduseId;
      this.dataModel.linkPropertyTypeUsageId = data.linkPropertyTypeUsageId;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();

  dataModel: EstatePriceInquiryDtoModel = new EstatePriceInquiryDtoModel();
  dataModelResult: ErrorExceptionResult<EstatePropertyExpertPriceModel> = new ErrorExceptionResult<EstatePropertyExpertPriceModel>();
  dataModelEstatePropertyExpertPriceTypeEnumResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();


  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  PropertyTypeSelected = new EstatePropertyTypeLanduseModel();
  dataModelCorCurrencySelector = new CoreCurrencyModel();
  fileManagerOpenForm = false;

  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.Expert_Price_Inquiry');
    this.getEnumRecordStatus();
    this.getEstatePropertyExpertPriceTypeEnum();
    if (this.dataModel.linkLocationId > 0 &&
      this.dataModel.linkCoreCurrencyId > 0 &&
      this.dataModel.createdYaer > 0 &&
      this.dataModel.linkContractTypeId && this.dataModel.linkContractTypeId.length > 0 &&
      this.dataModel.linkPropertyTypeLanduseId && this.dataModel.linkPropertyTypeLanduseId.length > 0 &&
      this.dataModel.linkPropertyTypeUsageId && this.dataModel.linkPropertyTypeUsageId.length > 0) {
      this.DataActionContent();
    }
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  getEstatePropertyExpertPriceTypeEnum(): void {
    this.estateEnumService.ServiceEstatePropertyExpertPriceTypeEnum().subscribe((next) => {
      this.dataModelEstatePropertyExpertPriceTypeEnumResult = next;
    });
  }

  DataActionContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.dataModelResult = new ErrorExceptionResult<EstatePropertyExpertPriceModel>();
    this.estatePropertyExpertPriceService.ServicePriceInquiryList(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;

        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          if (ret.listItems && ret.listItems.length > 0) {
            this.dataModelResult = ret;
          } else {
            this.cmsToastrService.typeWarningMessage(this.translate.instant('MESSAGE.PriceInquiryCalculateNotFind'));
            this.dialogRef.close({ dialogChangedDate: true });
          }
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }
  onActionSelectorSelectUsage(model: EstatePropertyTypeUsageModel | null): void {
    if (!model || !model.id || model.id.length <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeWarningSelected(message);
      return;
    }
    this.dataModel.linkPropertyTypeUsageId = model.id;
  }

  onActionSelectorSelectLanduse(model: EstatePropertyTypeLanduseModel | null): void {
    this.PropertyTypeSelected = null;
    this.dataModel.linkPropertyTypeLanduseId = null;
    if (!model || !model.id || model.id.length <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeWarningSelected(message);
      return;
    }
    this.PropertyTypeSelected = model;
    this.dataModel.linkPropertyTypeLanduseId = model.id;
  }

  onActionSelectorContarctType(model: EstatePropertyTypeLanduseModel | null): void {
    this.dataModel.linkContractTypeId = null;
    if (!model || !model.id || model.id.length <= 0) {
      const message = this.translate.instant('MESSAGE.Type_of_property_transaction_is_not_known');
      this.cmsToastrService.typeWarningSelected(message);
      return;
    }
    this.dataModel.linkContractTypeId = model.id;

  }

  onActionSelectorLocation(model: CoreLocationModel | null): void {
    this.dataModel.linkLocationId = null;
    if (model && model.id > 0) {
      this.dataModel.linkLocationId = model.id;
    }
  }

  onActionSelectCurrency(model: CoreCurrencyModel): void {
    if (!model || model.id <= 0) {
      // this.cmsToastrService.typeErrorSelected();
      this.dataModelCorCurrencySelector = null;
      this.dataModel.linkCoreCurrencyId = null;
      return;
    }
    this.dataModelCorCurrencySelector = model;
    this.dataModel.linkCoreCurrencyId = model.id;
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;

    this.DataActionContent();

  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
