
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as Leaflet from 'leaflet';
import { Map as leafletMap } from 'leaflet';
import {
  CoreCurrencyModel, CoreEnumService, CoreLocationModel, CoreUserModel, DataFieldInfoModel, EnumInfoModel, EnumInputDataType, EnumManageUserAccessUserTypes, EnumRecordStatus, ErrorExceptionResult, EstateAccountAgencyModel, EstateAccountUserModel, EstateContractModel, EstateContractTypeModel, EstateContractTypeService, EstatePropertyCompanyModel, EstatePropertyDetailGroupService, EstatePropertyDetailValueModel, EstatePropertyModel, EstatePropertyProjectModel, EstatePropertyService, EstatePropertyTypeLanduseModel, EstatePropertyTypeLanduseService, EstatePropertyTypeModel,
  EstatePropertyTypeService, EstatePropertyTypeUsageModel, FilterDataModel,
  FilterModel, FormInfoModel, TokenInfoModel
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { PoinModel } from 'src/app/core/models/pointModel';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CmsMapComponent } from 'src/app/shared/cms-map/cms-map.component';
import { EstatePropertyExpertPriceInquiryListComponent } from '../../property-expert-price/inquiry-list/inquiry-list.component';
import { EstatePropertyActionComponent } from '../action/action.component';
import { EstatePropertyQuickListComponent } from '../quick-list/quick-list.component';
@Component({
  selector: 'app-estate-property-add',
  templateUrl: './add.component.html',
})
export class EstatePropertyAddComponent implements OnInit {
  requestLinkPropertyTypeLanduseId = '';
  requestLinkPropertyTypeUsageId = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    public coreEnumService: CoreEnumService,
    public estateContractTypeService: EstateContractTypeService,
    public estatePropertyService: EstatePropertyService,
    public estatePropertyDetailGroupService: EstatePropertyDetailGroupService,
    private estatePropertyTypeService: EstatePropertyTypeService,
    private estatePropertyTypeLanduseService: EstatePropertyTypeLanduseService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.requestLinkPropertyTypeLanduseId = this.activatedRoute.snapshot.paramMap.get('LinkPropertyTypeLanduseId');

    if (this.requestLinkPropertyTypeLanduseId && this.requestLinkPropertyTypeLanduseId.length > 0) {
      this.dataModel.linkPropertyTypeLanduseId = this.requestLinkPropertyTypeLanduseId;
    }
    this.requestLinkPropertyTypeUsageId = this.activatedRoute.snapshot.paramMap.get('LinkPropertyTypeUsageId');

    if (this.requestLinkPropertyTypeUsageId && this.requestLinkPropertyTypeUsageId.length > 0) {
      this.dataModel.linkPropertyTypeUsageId = this.requestLinkPropertyTypeUsageId;
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;

    });
  }

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  @ViewChild(CmsMapComponent) childMap: CmsMapComponent;
  currencyOptionSelectFirstItem = true;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  enumInputDataType = EnumInputDataType;
  tokenInfo = new TokenInfoModel();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  formMatcher = new CmsFormsErrorStateMatcher();
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<EstatePropertyModel> = new ErrorExceptionResult<EstatePropertyModel>();
  dataModelEstateContractTypeResult: ErrorExceptionResult<EstateContractTypeModel> = new ErrorExceptionResult<EstateContractTypeModel>();
  dataModelEstatePropertyTypeResult: ErrorExceptionResult<EstatePropertyTypeModel> = new ErrorExceptionResult<EstatePropertyTypeModel>();
  dataModelEstatePropertyTypeLanduseResult: ErrorExceptionResult<EstatePropertyTypeLanduseModel>
    = new ErrorExceptionResult<EstatePropertyTypeLanduseModel>();
  dataModel: EstatePropertyModel = new EstatePropertyModel();
  dataFileModelImgaes = new Map<number, string>();
  dataFileModelFiles = new Map<number, string>();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  fileManagerOpenForm = false;
  dataModelCorCurrencySelector = new CoreCurrencyModel();
  contractTypeSelected: EstateContractTypeModel;
  PropertyTypeSelected = new EstatePropertyTypeLanduseModel();
  contractDataModel = new EstateContractModel();
  optionActionTitle = this.translate.instant('ACTION.Add_To_List');
  loadingOption = new ProgressSpinnerModel();
  optionTabledataSource = new MatTableDataSource<EstateContractModel>();
  optionTabledisplayedColumns = ['LinkEstateContractTypeId', 'SalePrice', 'RentPrice', 'DepositPrice', 'PeriodPrice', 'Action'];
  propertyDetails: Map<string, string> = new Map<string, string>();
  step = 0;
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  /** map */
  viewMap = false;
  private mapModel: leafletMap;
  mapMarker: any;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter = new PoinModel();
  listTypeLanduse: EstatePropertyTypeLanduseModel[] = [];
  dataProfessional = false;
  hidden = true;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {


    this.formInfo.formTitle = this.translate.instant('TITLE.Submit_New_Content');

    this.getEnumRecordStatus();
    this.DataGetAccess();
    this.getEstateContractType();
    this.getEstatePropertyType();
    this.getEstatePropertyTypeLanduse();
    this.dataModel.caseCode = this.publicHelper.StringRandomGenerator(5, true);
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.getEnumRecordStatus();
      this.DataGetAccess();
      this.getEstateContractType();
      this.getEstatePropertyType();
      this.getEstatePropertyTypeLanduse();
      this.optionActionTitle = this.translate.instant('ACTION.Add_To_List');
      this.tokenInfo = next;
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
  getEstatePropertyType(): void {
    const pName = this.constructor.name + 'getEstatePropertyType';
    this.loading.Start(pName, this.translate.instant('TITLE.Get_Estate_property_Type'));
    this.estatePropertyTypeService.ServiceGetAll(null).subscribe((next) => {
      this.dataModelEstatePropertyTypeResult = next;
      this.loading.Stop(pName);
    }, () => {
      this.loading.Stop(pName);
    });
  }
  getEstatePropertyTypeLanduse(): void {
    const pName = this.constructor.name + 'getEstatePropertyType';
    this.loading.Start(pName, this.translate.instant('TITLE.Get_Estate_user_Type'));
    this.estatePropertyTypeLanduseService.ServiceGetAll(null).subscribe((next) => {
      this.dataModelEstatePropertyTypeLanduseResult = next;
      this.loading.Stop(pName);
    }, () => {
      this.loading.Stop(pName);
    });
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetAccess(): void {
    const pName = this.constructor.name + 'ServiceViewModel';
    this.loading.Start(pName, this.translate.instant('TITLE.Get_Estate_access'));
    this.estatePropertyService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
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

  DataGetPropertyDetailGroup(id: string): void {
    const filteModelProperty = new FilterModel();
    const filter = new FilterDataModel();
    filter.propertyName = 'LinkPropertyTypeLanduseId';
    filter.value = id;
    filteModelProperty.filters.push(filter);
    this.dataModel.propertyDetailGroups = [];
    const pName = this.constructor.name + 'DataGetPropertyDetailGroup';
    this.loading.Start(pName, this.translate.instant('TITLE.Get_Details'));
    this.estatePropertyDetailGroupService.ServiceGetAll(filteModelProperty)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.dataModel.propertyDetailGroups = ret.listItems;
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
  DataAdd(): void {
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
    const pName = this.constructor.name + 'ServiceAdd';
    this.loading.Start(pName, this.translate.instant('TITLE.Property_registration'));
    this.estatePropertyService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          setTimeout(() => this.router.navigate(['/estate/property']), 1000);
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
  onActionSelectorSelectUsage(model: EstatePropertyTypeUsageModel | null): void {
    if (!model || !model.id || model.id.length <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.linkPropertyTypeUsageId = model.id;
    if (this.dataModelEstatePropertyTypeResult.isSuccess && this.dataModelEstatePropertyTypeLanduseResult.isSuccess) {
      this.listTypeLanduse = [];
      this.dataModelEstatePropertyTypeResult.listItems.forEach(element => {
        if (element.linkPropertyTypeUsageId === model.id) {
          this.dataModelEstatePropertyTypeLanduseResult.listItems.forEach(elementLanduser => {
            if (elementLanduser.id === element.linkPropertyTypeLanduseId) {
              this.listTypeLanduse.push(elementLanduser);
            }
          });

        }
      });
    }
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
      //  const message = this.translate.instant('MESSAGE.Information_user_is_not_clear');
      //  this.cmsToastrService.typeErrorSelected(message);
      this.dataModel.linkCmsUserId = null;
      return;
    }
    this.dataModel.linkCmsUserId = model.id;
  }
  onActionSelectorLocation(model: CoreLocationModel | null): void {
    if (!model || !model.id || model.id <= 0) {
      const message = this.translate.instant('MESSAGE.information_area_is_not_clear');
      this.cmsToastrService.typeWarningSelected(message);
      this.dataModel.linkLocationId = null;
      return;
    }
    this.dataModel.linkLocationId = model.id;
  }
  onActionSelectorProject(model: EstatePropertyProjectModel | null): void {
    if (!model || !model.id || model.id.length <= 0) {
      //const message = this.translate.instant('MESSAGE.information_area_is_not_clear');
      //this.cmsToastrService.typeWarningSelected(message);
      this.dataModel.linkPropertyProjectId = null;
      return;
    }
    this.dataModel.linkPropertyProjectId = model.id;
  }
  onActionSelectorCompany(model: EstatePropertyCompanyModel | null): void {
    if (!model || !model.id || model.id.length <= 0) {
      //const message = this.translate.instant('MESSAGE.information_area_is_not_clear');
      //this.cmsToastrService.typeWarningSelected(message);
      this.dataModel.linkPropertyCompanyId = null;
      return;
    }
    this.dataModel.linkPropertyCompanyId = model.id;
  }
  onActionSelectorEstateUser(model: EstateAccountUserModel | null): void {
    this.dataModel.linkEstateUserId = null;
    if (!model || !model.id || model.id.length <= 0) {
      return;
    }
    this.dataModel.linkEstateUserId = model.id;
  }
  onActionSelectorEstateAgency(model: EstateAccountAgencyModel | null): void {
    this.dataModel.linkEstateAgencyId = null;
    if (!model || !model.id || model.id.length <= 0) {
      return;
    }
    this.dataModel.linkEstateAgencyId = model.id;
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
    if (!this.dataModel.contracts || this.dataModel.contracts.length === 0) {
      this.onActionOptionAddToList(false);
    }
    if (!this.dataModel.contracts || this.dataModel.contracts.length === 0) {
      const message = this.translate.instant('MESSAGE.Type_of_property_transaction_is_not_known');
      this.cmsToastrService.typeErrorSelected(message);
      this.formInfo.formSubmitAllow = true;
      return;
    }
    if ((this.tokenHelper.CheckIsAdmin() || this.tokenHelper.CheckIsSupport() || this.tokenHelper.tokenInfo.userAccessUserType == EnumManageUserAccessUserTypes.ResellerCpSite || this.tokenHelper.tokenInfo.userAccessUserType == EnumManageUserAccessUserTypes.ResellerEmployeeCpSite) && this.dataModel.recordStatus == EnumRecordStatus.Available) {
      const dialogRef = this.dialog.open(EstatePropertyActionComponent, {
        height: '90%',
        data: { model: this.dataModel }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.dialogChangedDate) {
          this.dataModel = result.model;
          this.DataAdd();
        } else {
          this.formInfo.formSubmitAllow = true;
        }
      });
    }
    else {
      this.DataAdd();
    }


  }
  onFormCancel(): void {
    // this.dialogRef.close({ dialogChangedDate: false });
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
    var accepted = false;
    if (this.contractTypeSelected.hasSalePrice) {
      if (this.contractDataModel.salePrice && this.contractDataModel.salePrice > 0)
        accepted = true;
      if (this.contractTypeSelected.salePriceAllowAgreement && this.contractDataModel.salePriceByAgreement)
        accepted = true;

      if (!accepted) {
        const message = this.translate.instant('MESSAGE.Sales_amount_is_not_entered_correctly');
        this.cmsToastrService.typeErrorSelected(message);
        return;
      }
    }
    accepted = false;
    if (this.contractTypeSelected.hasRentPrice) {
      if (this.contractDataModel.rentPrice && this.contractDataModel.rentPrice > 0)
        accepted = true;
      if (this.contractTypeSelected.rentPriceAllowAgreement && this.contractDataModel.rentPriceByAgreement)
        accepted = true;

      if (!accepted) {
        const message = this.translate.instant('MESSAGE.Rent_amount_is_not_entered_correctly');
        this.cmsToastrService.typeErrorSelected(message);
        return;
      }
    }
    accepted = false;
    if (this.contractTypeSelected.hasPeriodPrice) {
      if (this.contractDataModel.periodPrice && this.contractDataModel.periodPrice > 0)
        accepted = true;
      if (this.contractTypeSelected.periodPriceAllowAgreement && this.contractDataModel.periodPriceByAgreement)
        accepted = true;

      if (!accepted) {
        const message = this.translate.instant('MESSAGE.Period_amount_is_not_entered_correctly');
        this.cmsToastrService.typeErrorSelected(message);
        return;
      }
    }
    accepted = false;
    if (this.contractTypeSelected.hasDepositPrice) {
      if (this.contractDataModel.depositPrice && this.contractDataModel.depositPrice > 0)
        accepted = true;
      if (this.contractTypeSelected.depositPriceAllowAgreement && this.contractDataModel.depositPriceByAgreement)
        accepted = true;

      if (!accepted) {
        const message = this.translate.instant('MESSAGE.Deposit_amount_is_not_entered_correctly');
        this.cmsToastrService.typeErrorSelected(message);
        return;
      }
    }
    this.dataModel.contracts.push(this.contractDataModel);
    this.contractDataModel = new EstateContractModel();
    this.optionTabledataSource.data = this.dataModel.contracts;
    this.contractTypeSelected = null;

  }
  onActionOptionRemoveFromList(index: number): void {
    if (index < 0) {
      return;
    }
    if (!this.dataModel.contracts || this.dataModel.contracts.length === 0) {
      return;
    }
    this.contractDataModel = this.dataModel.contracts[index];
    this.dataModel.contracts.splice(index, 1);
    this.contractDataModel = new EstateContractModel();
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
    if ((!this.dataModel.contracts || this.dataModel.contracts.length == 0) && event.previouslySelectedStep.state == "contract" && event.previouslySelectedIndex < event.selectedIndex) {
      this.cmsToastrService.typeErrorFormInvalid(this.translate.instant('TITLE.Select_the_transaction_type'));

      setTimeout(() => {
        stepper.selectedIndex = event.previouslySelectedIndex;
        // stepper.previous();
      }, 10);
    }
  }
  onActionBackToParent(): void {
    this.router.navigate(['/estate/property/']);
  }
  // ** Accardon */

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

    //
    if (this.tokenHelper.CheckIsAdmin() && this.contractTypeSelected.allowPriceInquiryCalculate) {
      this.onActionPriceInquiryList()
    }
  }
  onActionPriceInquiryList(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '90%';
    dialogConfig.data = {
      linkLocationId: this.dataModel.linkLocationId,
      linkCoreCurrencyId: this.contractDataModel.linkCoreCurrencyId,
      createdYaer: this.dataModel.createdYaer,
      linkPropertyTypeUsageId: this.dataModel.linkPropertyTypeUsageId,
      linkPropertyTypeLanduseId: this.dataModel.linkPropertyTypeLanduseId,
      linkContractTypeId: this.contractDataModel.linkEstateContractTypeId,
    };


    const dialogRef = this.dialog.open(EstatePropertyExpertPriceInquiryListComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {

      }
    });
  }
  onActionbuttonQuickListSearchTitle(): void {
    if (!this.dataModel || !this.dataModel.title || this.dataModel.title.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    const dialogRef = this.dialog.open(EstatePropertyQuickListComponent, {
      height: '90%',
      data: { searchTitle: this.dataModel.title }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
      }
    });
  }
  onActionbuttonQuickListSearchCustomerTel(): void {
    if (!this.dataModel || !this.dataModel.aboutCustomerTel || this.dataModel.aboutCustomerTel.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    const dialogRef = this.dialog.open(EstatePropertyQuickListComponent, {
      height: '90%',
      data: { searchCustomerTel: this.dataModel.aboutCustomerTel }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
      }
    });
  }
  onActionbuttonQuickListSearchCustomerMobile(): void {
    if (!this.dataModel || !this.dataModel.aboutCustomerMobile || this.dataModel.aboutCustomerMobile.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    const dialogRef = this.dialog.open(EstatePropertyQuickListComponent, {
      height: '90%',
      data: { searchCustomerTel: this.dataModel.aboutCustomerMobile }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
      }
    });
  }
  onActionbuttonQuickListSearchCaseCode(): void {
    if (!this.dataModel || !this.dataModel.caseCode || this.dataModel.caseCode.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    const dialogRef = this.dialog.open(EstatePropertyQuickListComponent, {
      height: '90%',
      data: { searchCaseCode: this.dataModel.caseCode }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
      }
    });
  }
}
