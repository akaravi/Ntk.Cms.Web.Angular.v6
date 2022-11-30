
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
  FilterModel,
  FilterDataModel,
  EstatePropertyDetailGroupService,
  EstateAccountUserModel,
  EnumInputDataType,
  EstatePropertyDetailValueModel,
  CoreCurrencyModel,
  EnumManageUserAccessDataTypes,
  EnumRecordStatus,
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
import { TreeModel } from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstatePropertyListComponent } from '../../property/list/list.component';
import { HttpClient } from '@angular/common/http';
import { EstateCustomerOrderActionComponent } from '../action/action.component';
import { MatDialog } from '@angular/material/dialog';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';

@Component({
  selector: 'app-estate-customer-order-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class EstateCustomerOrderAddComponent implements OnInit {
  requestId = '';
  constructor(
    private router: Router,
    public coreEnumService: CoreEnumService,
    public estateCustomerOrderService: EstateCustomerOrderService,
    private cmsToastrService: CmsToastrService,
    public estatePropertyDetailGroupService: EstatePropertyDetailGroupService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public tokenHelper: TokenHelper,
    public http: HttpClient,
    public dialog: MatDialog,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
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
  // dataModelResult: ErrorExceptionResult<EstateCustomerOrderModel> = new ErrorExceptionResult<EstateCustomerOrderModel>();
  dataModel: EstateCustomerOrderModel = new EstateCustomerOrderModel();
  dataModelCorCurrencySelector = new CoreCurrencyModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  fileManagerOpenForm = false;
  PropertyTypeSelected = new EstatePropertyTypeLanduseModel();
  propertyDetails: Map<string, string> = new Map<string, string>();
  contractTypeSelected: EstateContractTypeModel;
  optionloadComponent = false;
  // ** Accardon */
  step = 0;
  hidden = true;

  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.ADD');
    this.getEnumRecordStatus();
    this.DataGetAccess();
    if (this.requestId && this.requestId.length > 0) {
      this.DataGetOneContent();
    }
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetAccess(): void {
    this.estateCustomerOrderService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.errorMessage);
          }
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
        }
      }
      );
  }
  DataAddContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.estateCustomerOrderService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.router.navigate(['/estate/customer-order/edit', ret.item.id]);

        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

        this.formInfo.formSubmitAllow = true;
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );

  }

  DataGetOneContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    // var id = '';
    // if (this.dataModelResult && this.dataModelResult.item && this.dataModelResult.item.id && this.dataModelResult.item.id.length > 0) {
    //   id = this.dataModelResult.item.id;
    // } else if (this.requestId && this.requestId.length > 0) {
    //   id = this.requestId;
    // }
    this.estateCustomerOrderService.setAccessLoad();
    this.estateCustomerOrderService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.title;
          this.formInfo.formAlert = '';
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
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
  // DataEditContent(): void {
  //   this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
  //   this.formInfo.formError = '';
  //   const pName = this.constructor.name + 'main';
  //   this.loading.Start(pName);

  //   this.estateCustomerOrderService.ServiceEdit(this.dataModel).subscribe({
  //     next: (ret) => {
  //       this.dataModelResult = ret;
  //       if (ret.isSuccess) {
  //         this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
  //         this.cmsToastrService.typeSuccessEdit();
  //         this.optionReload();
  //       } else {
  //         this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
  //         this.formInfo.formError = ret.errorMessage;
  //         this.cmsToastrService.typeErrorMessage(ret.errorMessage);
  //       }
  //       this.loading.Stop(pName);

  //       this.formInfo.formSubmitAllow = true;
  //     },
  //     error: (er) => {
  //       this.formInfo.formSubmitAllow = true;
  //       this.cmsToastrService.typeError(er);
  //       this.loading.Stop(pName);
  //     }
  //   }
  //   );
  // }
  DataGetPropertyDetailGroup(id: string): void {
    const filteModelProperty = new FilterModel();
    const filter = new FilterDataModel();
    filter.propertyName = 'LinkPropertyTypeLanduseId';
    filter.value = id;
    filteModelProperty.filters.push(filter);
    this.dataModel.propertyDetailGroups = [];
    const pName = this.constructor.name + 'DataGetPropertyDetailGroup';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Get_detailed_information'));
    this.estatePropertyDetailGroupService.ServiceGetAll(filteModelProperty)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.dataModel.propertyDetailGroups = ret.listItems;
            /** load Value */
            if (this.dataModel.propertyDetailGroups)
              this.dataModel.propertyDetailGroups.forEach(itemGroup => {
                itemGroup.propertyDetails.forEach(element => {
                  this.propertyDetails[element.id] = 0;

                  if (this.dataModel.propertyDetailValues) {
                    const value = this.dataModel.propertyDetailValues.find(x => x.linkPropertyDetailId === element.id);
                    if (value) {
                      this.propertyDetails[element.id] = value.value;
                    }
                  }
                });
              });
            /** load Value */
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.errorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
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
    this.DataGetPropertyDetailGroup(model.id);
  }
  onActionSelectorEstateUser(model: EstateAccountUserModel | null): void {
    this.dataModel.linkEstateUserId = null;
    if (!model || !model.id || model.id.length <= 0) {
      return;
    }
    this.dataModel.linkEstateUserId = model.id;
  }

  onActionSelectorContarctType(model: EstateContractTypeModel | null): void {
    this.contractTypeSelected = null;
    this.dataModel.linkContractTypeId = null;
    if (!model || !model.id || model.id.length <= 0) {
      const message = this.translate.instant('MESSAGE.Type_of_property_transaction_is_not_known');
      this.cmsToastrService.typeWarningSelected(message);
      return;
    }
    this.contractTypeSelected = model;
    this.dataModel.linkContractTypeId = model.id;

  }
  onActionSelectorLocation(model: number[] | null): void {

    this.dataModel.linkLocationIds = model;
  }
  onActionSelectorProperty(model: string[] | null): void {
    this.dataModel.linkPropertyIds = model;
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
    this.formInfo.formSubmitAllow = false;
    // ** Save Value */
    this.dataModel.propertyDetailValues = [];
    if (this.dataModel.propertyDetailGroups)
      this.dataModel.propertyDetailGroups.forEach(itemGroup => {
        itemGroup.propertyDetails.forEach(element => {
          const value = new EstatePropertyDetailValueModel();
          value.linkPropertyDetailId = element.id;
          value.value = this.propertyDetails[element.id];
          this.dataModel.propertyDetailValues.push(value);
        });
      });
    // ** Save Value */
    if (this.tokenHelper.CheckIsAdmin() && this.dataModel.recordStatus == EnumRecordStatus.Available ){
    const dialogRef = this.dialog.open(EstateCustomerOrderActionComponent, {
      // height: '90%',
      data: { model: this.dataModel }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.dataModel = result.model;
        this.DataAddContent();
      } else {
        this.formInfo.formSubmitAllow = false;
      }
    });
  }
  }

  onFormCancel(): void {
    this.router.navigate(['/estate/customer-order/']);
  }
  // optionReload = (): void => {
  //   if (this.dataModel.id && this.dataModel.id.length > 0){
  //   this.estatePropertyList.optionloadComponent = true;
  //   this.estatePropertyList.DataGetAll();
  //   }
  // }
  // onFormLoadResult(): void {
  //   if (this.dataModel.id && this.dataModel.id.length > 0){
  //   this.estatePropertyList.optionloadComponent = true;
  //   this.estatePropertyList.DataGetAll();
  //   }
  // }
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
}
