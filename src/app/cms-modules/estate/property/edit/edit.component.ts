
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  EstatePropertyModel,
  EstatePropertyService,
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  EstatePropertyTypeLanduseModel,
  DataFieldInfoModel,
  EstateAccountUserModel,
  CoreUserModel,
  CoreLocationModel,
  EstateContractTypeModel,
  EstateContractModel,
  EstateContractTypeService,
  EnumInputDataType,
  EstatePropertyDetailValueModel,
  EstatePropertyTypeUsageModel,
  FilterModel,
  FilterDataModel,
  EstatePropertyDetailGroupService,
  TokenInfoModel,
  EnumManageUserAccessUserTypes,
  CoreCurrencyModel,
  EnumManageUserAccessDataTypes,
} from 'ntk-cms-api';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { NodeInterface, TreeModel } from 'src/filemanager-api';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import * as Leaflet from 'leaflet';
import { Map as leafletMap } from 'leaflet';
import { PoinModel } from 'src/app/core/models/pointModel';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsMapComponent } from 'src/app/shared/cms-map/cms-map.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estate-property-edit',
  templateUrl: './edit.component.html',
})
export class EstatePropertyEditComponent implements OnInit, OnDestroy {
  requestId = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    public coreEnumService: CoreEnumService,
    public estateContractTypeService: EstateContractTypeService,
    public estatePropertyService: EstatePropertyService,
    public estatePropertyDetailGroupService: EstatePropertyDetailGroupService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.requestId = this.activatedRoute.snapshot.paramMap.get('id');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  @ViewChild(CmsMapComponent) childMap: CmsMapComponent;

  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  enumInputDataType = EnumInputDataType;
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  tokenInfo = new TokenInfoModel();
  formMatcher = new CmsFormsErrorStateMatcher();
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<EstatePropertyModel> = new ErrorExceptionResult<EstatePropertyModel>();
  dataModelEstateContractTypeResult: ErrorExceptionResult<EstateContractTypeModel> = new ErrorExceptionResult<EstateContractTypeModel>();
  dataModel: EstatePropertyModel = new EstatePropertyModel();
  dataModelCorCurrencySelector = new CoreCurrencyModel();
  dataFileModelImgaes = new Map<number, string>();
  dataFileModelFiles = new Map<number, string>();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  fileManagerOpenForm = false;
  currencyOptionSelectFirstItem = true;
  contractTypeSelected: EstateContractTypeModel;
  PropertyTypeSelected = new EstatePropertyTypeLanduseModel();
  contractDataModel = new EstateContractModel();
  loadingOption = new ProgressSpinnerModel();
  optionTabledataSource = new MatTableDataSource<EstateContractModel>();
  optionTabledisplayedColumns = ['LinkEstateContractTypeId', 'SalePrice', 'DepositPrice', 'RentPrice', 'PeriodPrice', 'Action'];

  propertyDetails: Map<string, string> = new Map<string, string>();
  /** map */
  viewMap = false;
  private mapModel: leafletMap;
  mapMarker: any;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter = new PoinModel();
  // ** Accardon */
  step = 0;
  hidden = true;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    if (this.requestId.length <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.router.navigate(['/estate/property']);
      return;
    }
    this.formInfo.formTitle = this.translate.instant('TITLE.Edit');
    this.DataGetOne();
    this.getEnumRecordStatus();
    this.getEstateContractType();


    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.DataGetOne();
      this.getEnumRecordStatus();
      this.getEstateContractType();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  getEstateContractType(): void {
    const pName = this.constructor.name + 'getEstateContractType';
    this.loading.Start(pName, this.translate.instant('TITLE.Get_Estate_Contract_Type'));
    this.estateContractTypeService.ServiceGetAll(null).subscribe((next) => {
      this.dataModelEstateContractTypeResult = next;
      this.loading.Stop(pName);
    }, () => {
      this.loading.Stop(pName);
    });

  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetOne(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.formError = '';


    const pName = this.constructor.name + 'ServiceGetOneById';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_state_information'));
    this.estatePropertyService.setAccessLoad();
    this.estatePropertyService.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
    this.estatePropertyService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.optionTabledataSource.data = this.dataModel.contracts;
          this.DataGetPropertyDetailGroup(this.dataModel.linkPropertyTypeLanduseId);


          const lat = this.dataModel.geolocationlatitude;
          const lon = this.dataModel.geolocationlongitude;
          if (lat > 0 && lon > 0) {
            this.mapMarkerPoints = [];
            this.mapMarkerPoints.push({ lat, lon });
            this.receiveMap();
          }
          this.formInfo.formTitle = ret.item.title;
          this.formInfo.formAlert = '';
          /*
          * check file attach list
          */
          if (this.dataModel.linkFileIds && this.dataModel.linkFileIds.length > 0) {
            this.dataModel.linkFileIds.split(',').forEach((element, index) => {
              let link = '';
              if (this.dataModel.linkFileIdsSrc.length >= this.dataModel.linkFileIdsSrc.length) {
                link = this.dataModel.linkFileIdsSrc[index];
              }
              this.dataFileModelFiles.set(+element, link);
            });
          }
          if (this.dataModel.linkExtraImageIdsSrc && this.dataModel.linkExtraImageIdsSrc.length > 0) {
            this.dataModel.linkExtraImageIds.split(',').forEach((element, index) => {
              let link = '';
              if (this.dataModel.linkExtraImageIdsSrc.length >= this.dataModel.linkExtraImageIdsSrc.length) {
                link = this.dataModel.linkExtraImageIdsSrc[index];
              }
              this.dataFileModelImgaes.set(+element, link);
            });
          }
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
  DataEdit(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    if (this.dataFileModelFiles) {
      const keys = Array.from(this.dataFileModelFiles.keys());
      if (keys && keys.length > 0) {
        this.dataModel.linkFileIds = keys.join(',');
      }
    }
    if (this.dataFileModelImgaes) {
      const keys = Array.from(this.dataFileModelImgaes.keys());
      if (keys && keys.length > 0) {
        this.dataModel.linkExtraImageIds = keys.join(',');
      }
    }
    const pName = this.constructor.name + 'ServiceEdit';
    this.loading.Start(pName, this.translate.instant('MESSAGE.registration_chaneges_in_property_information'));

    this.estatePropertyService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
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
  receiveMap(model: leafletMap = this.mapModel): void {
    if (!model) {
      return;
    }
    this.mapModel = model;

    if (this.mapMarkerPoints && this.mapMarkerPoints.length > 0) {
      this.mapMarkerPoints.forEach(item => {
        this.mapMarker = Leaflet.marker([item.lat, item.lon]).addTo(this.mapModel);
      });
      this.mapOptonCenter = this.mapMarkerPoints[0];
      this.mapMarkerPoints = [];
    }

    this.mapModel.on('click', (e) => {
      // @ts-ignore
      const lat = e.latlng.lat;
      // @ts-ignore
      const lon = e.latlng.lng;
      if (this.mapMarker !== undefined) {
        this.mapModel.removeLayer(this.mapMarker);
      }
      if (lat === this.dataModel.geolocationlatitude && lon === this.dataModel.geolocationlongitude) {
        this.dataModel.geolocationlatitude = null;
        this.dataModel.geolocationlongitude = null;
        return;
      }
      this.mapMarker = Leaflet.marker([lat, lon]).addTo(this.mapModel);
      this.dataModel.geolocationlatitude = lat;
      this.dataModel.geolocationlongitude = lon;
    });

  }

  receiveZoom(zoom: number): void {
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }
  onActionSelectorSelectUsage(model: EstatePropertyTypeUsageModel | null): void {
    if (!model || !model.id || model.id.length <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.linkPropertyTypeUsageId = model.id;
  }
  onActionSelectorSelectLanduse(model: EstatePropertyTypeLanduseModel | null): void {
    if (!model || !model.id || model.id.length <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.PropertyTypeSelected = model;
    this.dataModel.linkPropertyTypeLanduseId = model.id;
    this.DataGetPropertyDetailGroup(model.id);
  }
  onActionSelectorCmsUser(model: CoreUserModel | null): void {
    if (!model || !model.id || model.id <= 0) {
      this.dataModel.linkCmsUserId = null;
      return;
    }
    this.dataModel.linkCmsUserId = model.id;
  }
  onActionSelectorLocation(model: CoreLocationModel | null): void {
    if (!model || !model.id || model.id <= 0) {
      const message = this.translate.instant('MESSAGE.Information_area_deleted');
      this.cmsToastrService.typeWarningSelected(message);
      this.dataModel.linkLocationId = null;
      return;
    }
    this.dataModel.linkLocationId = model.id;
  }
  onActionSelectorEstateUser(model: EstateAccountUserModel | null): void {
    this.dataModel.linkEstateUserId = null;
    if (!model || !model.id || model.id.length <= 0) {
      return;
    }
    this.dataModel.linkEstateUserId = model.id;
  }


  onActionSelectorContractType(model: EstateContractTypeModel | null): void {
    this.contractTypeSelected = null;
    if (!model || !model.id || model.id.length <= 0) {
      const message = this.translate.instant('MESSAGE.Type_of_property_transaction_is_not_known');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.currencyOptionSelectFirstItem = true;
    this.contractTypeSelected = model;
    this.contractDataModel = new EstateContractModel();
    this.contractDataModel.contractType = this.contractTypeSelected;
    this.contractDataModel.linkEstateContractTypeId = this.contractTypeSelected.id;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    /** Save Value */
    this.dataModel.propertyDetailValues = [];
    this.dataModel.propertyDetailGroups.forEach(itemGroup => {
      itemGroup.propertyDetails.forEach(element => {
        const value = new EstatePropertyDetailValueModel();
        value.linkPropertyDetailId = element.id;
        value.value = this.propertyDetails[element.id];

        this.dataModel.propertyDetailValues.push(value);
      });
    });
    /** Save Value */
    if (!this.dataModel.contracts || this.dataModel.contracts.length === 0) {
      this.onActionOptionAddToList();
    }
    if (!this.dataModel.contracts || this.dataModel.contracts.length === 0) {
      const message = this.translate.instant('MESSAGE.Type_of_property_transaction_is_not_known');
      this.cmsToastrService.typeErrorSelected(message);
      this.formInfo.formSubmitAllow = true;
      return;
    }
    this.DataEdit();

  }
  onFormCancel(): void {
    this.router.navigate(['/estate/property']);
  }

  onActionOptionAddToList(viewAlert: boolean = true): void {
    if (!this.contractTypeSelected || this.contractTypeSelected.id.length === 0) {
      const message = this.translate.instant('MESSAGE.Type_of_property_transaction_is_not_known');
      if (viewAlert) {
        this.cmsToastrService.typeErrorSelected(message);
      }
      return;
    }
    if (!this.dataModel.contracts) {
      this.dataModel.contracts = [];
    }
    this.dataModel.contracts.push(this.contractDataModel);
    this.contractDataModel = new EstateContractModel();
    this.optionTabledataSource.data = this.dataModel.contracts;
  }
  onActionOptionRemoveFromList(index: number): void {
    if (index < 0) {
      return;
    }
    if (!this.dataModel.contracts || this.dataModel.contracts.length === 0) {
      return;
    }
    let contracts: any
    this.contractDataModel = this.dataModel.contracts[index];
    contracts = this.dataModel.contracts.splice(index, 1);
    this.contractDataModel = contracts;
    this.optionTabledataSource.data = this.dataModel.contracts;
  }


  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;
  }
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {

      if (!this.dataModel.linkPropertyTypeUsageId || this.dataModel.linkPropertyTypeUsageId.length === 0) {
        this.cmsToastrService.typeErrorFormInvalid(this.translate.instant('TITLE.Select_the_Property_Type_Usage'));

        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }

      if (!this.dataModel.linkPropertyTypeLanduseId || this.dataModel.linkPropertyTypeLanduseId.length === 0) {
        this.cmsToastrService.typeErrorFormInvalid(this.translate.instant('TITLE.Select_the_Property_Type_Landuse'));

        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
      if (!this.formGroup.valid) {
        this.cmsToastrService.typeErrorFormInvalid();
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
    }
  }
  onActionBackToParent(): void {
    this.router.navigate(['/estate/property/']);
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
  onActionClickSalePriceAllowAgreement(): void {
    if (this.contractDataModel.salePriceByAgreement) {
      this.contractDataModel.salePrice = 0;
    }
  }
  onActionClickRentPriceAllowAgreement(): void {
    if (this.contractDataModel.rentPriceByAgreement) {
      this.contractDataModel.rentPrice = 0;
    }
  }
  onActionClickPeriodPriceAllowAgreement(): void {
    if (this.contractDataModel.periodPriceByAgreement) {
      this.contractDataModel.periodPrice = 0;
    }
  }
  onActionClickDepositPriceByAgreement(): void {
    if (this.contractDataModel.depositPriceByAgreement) {
      this.contractDataModel.depositPrice = 0;
    }
  }
  ActionCurrentPoint(): void {
    this.childMap.getPosition().then(pos => {
      const lat = pos.lat;
      const lon = pos.lon;
      if (lat > 0 && lon > 0) {

        if (this.mapMarker !== undefined) {
          this.mapModel.removeLayer(this.mapMarker);
        }
        this.mapMarkerPoints = [];
        this.mapMarkerPoints.push({ lat, lon });
        this.dataModel.geolocationlatitude = lat;
        this.dataModel.geolocationlongitude = lon;
        this.receiveMap();
      }
    });
  }
  onActionSelectCurrency(model: CoreCurrencyModel): void {
    if (!model || model.id <= 0) {
      this.cmsToastrService.typeErrorSelected();
      this.dataModelCorCurrencySelector = null;
      this.contractDataModel.linkCoreCurrencyId = null;
      return;
    }
    this.dataModelCorCurrencySelector = model;
    this.contractDataModel.linkCoreCurrencyId = model.id;
  }
}

