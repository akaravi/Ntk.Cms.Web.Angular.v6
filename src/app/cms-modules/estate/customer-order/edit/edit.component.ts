import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  EstateCustomerOrderService,
  EstateCustomerOrderModel,
  DataFieldInfoModel,
  EstatePropertyTypeLanduseModel,
  EstatePropertyTypeUsageModel,
  EstateContractTypeModel,
  FilterDataModel,
  FilterModel,
  EstatePropertyDetailGroupService,
  EstateAccountUserModel,
  EnumInputDataType,
  EstatePropertyDetailValueModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { TreeModel } from 'src/filemanager-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstatePropertyListComponent } from '../../property/list/list.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-estate-customer-order-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EstateCustomerOrderEditComponent implements OnInit {
  requestId = '';
  constructor(
    private router: Router,
    public coreEnumService: CoreEnumService,
    public estateCustomerOrderService: EstateCustomerOrderService,
    public estatePropertyDetailGroupService: EstatePropertyDetailGroupService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public http: HttpClient,
    private translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.requestId = this.activatedRoute.snapshot.paramMap.get('id');


  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  @ViewChild(EstatePropertyListComponent) estatePropertyList: EstatePropertyListComponent;

  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  enumInputDataType = EnumInputDataType;

  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<EstateCustomerOrderModel> = new ErrorExceptionResult<EstateCustomerOrderModel>();
  dataModel: EstateCustomerOrderModel = new EstateCustomerOrderModel();
  formInfo: FormInfoModel = new FormInfoModel();
  contractTypeSelected: EstateContractTypeModel;
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  fileManagerOpenForm = false;
  propertyDetails: Map<string, string> = new Map<string, string>();
  PropertyTypeSelected = new EstatePropertyTypeLanduseModel();
  optionloadComponent = false;
  // ** Accardon */
  step = 0;
  hidden = true;
  ngOnInit(): void {
    this.formInfo.FormTitle = 'ویرایش  ';
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      setTimeout(() => this.router.navigate(['/estate/customer-order']), 1000);
      return;
    }
    this.DataGetOneContent();
    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetOneContent(): void {

    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.estateCustomerOrderService.setAccessLoad();
    this.estateCustomerOrderService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        this.dataModel = next.Item;
        if (next.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.Title;
          this.formInfo.FormAlert = '';
          /** load Value */
          this.dataModel.PropertyDetailGroups.forEach(itemGroup => {
            itemGroup.PropertyDetails.forEach(element => {
              this.propertyDetails[element.Id] = 0;

              if (this.dataModel.PropertyDetailValues) {
                const value = this.dataModel.PropertyDetailValues.find(x => x.LinkPropertyDetailId === element.Id);
                if (value) {
                  this.propertyDetails[element.Id] = value.Value;
                }
              }
            });
          });
          /** load Value */
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
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
  DataEditContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.estateCustomerOrderService.ServiceEdit(this.dataModel).subscribe(
      (next) => {
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
          this.optionReload();
          // setTimeout(() => this.router.navigate(['/estate/customer-order']), 1000);
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop(pName);

        this.formInfo.FormSubmitAllow = true;
      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);

      }
    );
  }

  DataGetPropertyDetailGroup(id: string): void {
    const filteModelProperty = new FilterModel();
    const filter = new FilterDataModel();
    filter.PropertyName = 'LinkPropertyTypeLanduseId';
    filter.Value = id;
    filteModelProperty.Filters.push(filter);
    this.dataModel.PropertyDetailGroups = [];
    const pName = this.constructor.name + 'DataGetPropertyDetailGroup';
    this.loading.Start(pName, 'دریافت اطلاعات جزئیات');
    this.estatePropertyDetailGroupService.ServiceGetAll(filteModelProperty)
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.dataModel.PropertyDetailGroups = next.ListItems;
            /** load Value */
            this.dataModel.PropertyDetailGroups.forEach(itemGroup => {
              itemGroup.PropertyDetails.forEach(element => {
                this.propertyDetails[element.Id] = 0;

                if (this.dataModel.PropertyDetailValues) {
                  const value = this.dataModel.PropertyDetailValues.find(x => x.LinkPropertyDetailId === element.Id);
                  if (value) {
                    this.propertyDetails[element.Id] = value.Value;
                  }
                }
              });
            });
            /** load Value */
          } else {
            this.cmsToastrService.typeErrorGetAccess(next.ErrorMessage);
          }
          this.loading.Stop(pName);
        },
        (error) => {
          this.cmsToastrService.typeErrorGetAccess(error);
          this.loading.Stop(pName);
        }
      );
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }
  onActionSelectorSelectUsage(model: EstatePropertyTypeUsageModel | null): void {
    if (!model || !model.Id || model.Id.length <= 0) {
      const message = 'دسته بندی اطلاعات مشخص نیست';
      this.cmsToastrService.typeWarningSelected(message);
      return;
    }
    this.dataModel.LinkPropertyTypeUsageId = model.Id;
  }
  onActionSelectorSelectLanduse(model: EstatePropertyTypeLanduseModel | null): void {
    this.PropertyTypeSelected = null;
    this.dataModel.LinkPropertyTypeLanduseId = null;
    if (!model || !model.Id || model.Id.length <= 0) {
      const message = 'دسته بندی اطلاعات مشخص نیست';
      this.cmsToastrService.typeWarningSelected(message);
      return;
    }
    this.PropertyTypeSelected = model;
    this.dataModel.LinkPropertyTypeLanduseId = model.Id;
    this.DataGetPropertyDetailGroup(model.Id);
  }
  onActionSelectorContarctType(model: EstateContractTypeModel | null): void {
    this.contractTypeSelected = null;
    this.dataModel.LinkContractTypeId = null;
    if (!model || !model.Id || model.Id.length <= 0) {
      const message = 'نوع معامله ملک مشخص نیست';
      this.cmsToastrService.typeWarningSelected(message);
      return;
    }
    this.contractTypeSelected = model;
    this.dataModel.LinkContractTypeId = model.Id;
    this.dataModel.RentPriceMin = 0;
    this.dataModel.RentPriceMax = 0;
    this.dataModel.SalePriceMin = 0;
    this.dataModel.SalePriceMax = 0;
    this.dataModel.DepositPriceMin = 0;
    this.dataModel.DepositPriceMax = 0;
  }
  onActionSelectorEstateUser(model: EstateAccountUserModel | null): void {
    this.dataModel.LinkEstateUserId = null;
    if (!model || !model.Id || model.Id.length <= 0) {
      return;
    }
    this.dataModel.LinkEstateUserId = model.Id;
  }


  onActionSelectorLocation(model: number[] | null): void {

    this.dataModel.LinkLocationIds = model;
  }
  onActionSelectorProperty(model: string[] | null): void {
    this.dataModel.LinkPropertyIds = model;
  }

  setStep(index: number): void {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }
  // ** Accardon */
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormSubmitAllow = false;
    // ** Save Value */
    this.dataModel.PropertyDetailValues = [];
    this.dataModel.PropertyDetailGroups.forEach(itemGroup => {
      itemGroup.PropertyDetails.forEach(element => {
        const value = new EstatePropertyDetailValueModel();
        value.LinkPropertyDetailId = element.Id;
        value.Value = this.propertyDetails[element.Id];
        this.dataModel.PropertyDetailValues.push(value);
      });
    });
    // ** Save Value */
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.router.navigate(['/estate/customer-order/']);
  }
  optionReload = (): void => {
    this.estatePropertyList.optionloadComponent = true;
    this.estatePropertyList.DataGetAll();
  }
  onFormLoadResult(): void {
    this.estatePropertyList.optionloadComponent = true;
    this.estatePropertyList.DataGetAll();
  }

}
