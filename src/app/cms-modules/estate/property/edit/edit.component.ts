import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  EstatePropertyModel,
  EstatePropertyService,
  CoreEnumService,
  EnumModel,
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
} from 'ntk-cms-api';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { NodeInterface, TreeModel } from 'projects/ntk-cms-filemanager/src/public-api';
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

@Component({
  selector: 'app-estate-property-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EstatePropertyEditComponent implements OnInit {
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
    private translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.requestId = this.activatedRoute.snapshot.paramMap.get('id');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();

  }
  requestId = '';
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  enumInputDataType = EnumInputDataType;
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  formMatcher = new CmsFormsErrorStateMatcher();
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<EstatePropertyModel> = new ErrorExceptionResult<EstatePropertyModel>();
  dataModelEstateContractTypeResult: ErrorExceptionResult<EstateContractTypeModel> = new ErrorExceptionResult<EstateContractTypeModel>();
  dataModel: EstatePropertyModel = new EstatePropertyModel();

  dataFileModelImgaes = new Map<number, string>();
  dataFileModelFiles = new Map<number, string>();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  fileManagerOpenForm = false;

  contractTypeSelected: EstateContractTypeModel;
  PropertyTypeSelected = new EstatePropertyTypeLanduseModel();
  // contractSelected: EstateContractModel;
  contractDataModel = new EstateContractModel();
  optionActionTitle = 'اضافه به لیست';
  loadingOption = new ProgressSpinnerModel();
  optionTabledataSource = new MatTableDataSource<EstateContractModel>();
  optionTabledisplayedColumns = ['LinkEstateContractTypeId', 'SalePrice', 'RentPrice', 'DepositPrice', 'Action'];

  propertyDetails: Map<string, string> = new Map<string, string>();
  /** map */
  viewMap = false;
  private mapModel: leafletMap;
  mapMarker: any;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter =new PoinModel();
  // ** Accardon */
  step = 0;


  ngOnInit(): void {
    if (this.requestId.length <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      // this.dialogRef.close({ dialogChangedDate: false });
      this.router.navigate(['/estate/property']);
      return;
    }
    this.formInfo.FormTitle = 'ثبت محتوای جدید';
    this.getEnumRecordStatus();
    this.getEstateContractType();
    this.formInfo.FormTitle = 'ویرایش  ';
    this.DataGetOne();
  }
  getEstateContractType(): void {
    const pName = this.constructor.name + 'getEstateContractType';
    this.loading.Start(pName, 'دریافت انواع معامله');
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
    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';


    const pName = this.constructor.name + 'ServiceGetOneById';
    this.loading.Start(pName, 'دریافت اطلاعات ملک');
    this.estatePropertyService.setAccessLoad();
    this.estatePropertyService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        this.dataModel = next.Item;
        if (next.IsSuccess) {
          this.optionTabledataSource.data = this.dataModel.Contracts;
          this.DataGetPropertyDetailGroup(this.dataModel.LinkPropertyTypeLanduseId);


          const lat = this.dataModel.Geolocationlatitude;
          const lon = this.dataModel.Geolocationlongitude;
          if (lat > 0 && lon > 0) {
            this.mapMarkerPoints.push({ lat, lon });
          }
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.Title;
          this.formInfo.FormAlert = '';
          /*
          * check file attach list
          */
          if (this.dataModel.LinkFileIds && this.dataModel.LinkFileIds.length > 0) {
            this.dataModel.LinkFileIds.split(',').forEach((element, index) => {
              let link = '';
              if (this.dataModel.LinkFileIdsSrc.length >= this.dataModel.LinkFileIdsSrc.length) {
                link = this.dataModel.LinkFileIdsSrc[index];
              }
              this.dataFileModelFiles.set(+element, link);
            });
          }
          if (this.dataModel.LinkExtraImageIdsSrc && this.dataModel.LinkExtraImageIdsSrc.length > 0) {
            this.dataModel.LinkExtraImageIds.split(',').forEach((element, index) => {
              let link = '';
              if (this.dataModel.LinkExtraImageIdsSrc.length >= this.dataModel.LinkExtraImageIdsSrc.length) {
                link = this.dataModel.LinkExtraImageIdsSrc[index];
              }
              this.dataFileModelImgaes.set(+element, link);
            });
          }
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
  DataEdit(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    this.loading.Start(this.constructor.name + 'main');
    if (this.dataFileModelFiles) {
      const keys = Array.from(this.dataFileModelFiles.keys());
      if (keys && keys.length > 0) {
        this.dataModel.LinkFileIds = keys.join(',');
      }
    }
    if (this.dataFileModelImgaes) {
      const keys = Array.from(this.dataFileModelImgaes.keys());
      if (keys && keys.length > 0) {
        this.dataModel.LinkExtraImageIds = keys.join(',');
      }
    }
    const pName = this.constructor.name + 'ServiceEdit';
    this.loading.Start(pName, 'ثبت تغیرات اطلاعات ملک');

    this.estatePropertyService.ServiceEdit(this.dataModel).subscribe(
      (next) => {
        this.formInfo.FormSubmitAllow = true;
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
  }
  receiveMap(model: leafletMap): void {
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
      if (lat === this.dataModel.Geolocationlatitude && lon === this.dataModel.Geolocationlongitude) {
        this.dataModel.Geolocationlatitude = null;
        this.dataModel.Geolocationlongitude = null;
        return;
      }
      this.mapMarker = Leaflet.marker([lat, lon]).addTo(this.mapModel);
      this.dataModel.Geolocationlatitude = lat;
      this.dataModel.Geolocationlongitude = lon;
    });

  }
  setValueToggle(i, e) {
    if (e.checked) {
      this.propertyDetails[i] = 'true';
    } else {
      this.propertyDetails[i] = 'false';
    }
  }
  receiveZoom(zoom: number): void {
  }
  onActionSelectorSelectUsage(model: EstatePropertyTypeUsageModel | null): void {
    if (!model || !model.Id || model.Id.length <= 0) {
      const message = 'دسته بندی اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkPropertyTypeUsageId = model.Id;
  }
  onActionSelectorSelectLanduse(model: EstatePropertyTypeLanduseModel | null): void {
    if (!model || !model.Id || model.Id.length <= 0) {
      const message = 'دسته بندی اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.PropertyTypeSelected = model;
    this.dataModel.LinkPropertyTypeLanduseId = model.Id;
    this.DataGetPropertyDetailGroup(model.Id);
  }
  onActionSelectorCmsUser(model: CoreUserModel | null): void {
    if (!model || !model.Id || model.Id <= 0) {
      const message = 'کاربر اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkCmsUserId = model.Id;
  }
  onActionSelectorLocation(model: CoreLocationModel | null): void {
    if (!model || !model.Id || model.Id <= 0) {
      const message = 'منطقه اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkLocationId = model.Id;
  }
  onActionSelectorEstateUser(model: EstateAccountUserModel | null): void {
    this.dataModel.LinkEstateUserId = null;
    if (!model || !model.Id || model.Id.length <= 0) {
      return;
    }
    this.dataModel.LinkEstateUserId = 0;
  }


  onActionSelectorContractType(model: EstateContractTypeModel | null): void {
    this.contractTypeSelected = null;
    if (!model || !model.Id || model.Id.length <= 0) {
      const message = 'نوع معامله ملک مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.contractTypeSelected = model;
    this.contractDataModel = new EstateContractModel();
    this.contractDataModel.ContractType = this.contractTypeSelected;
    this.contractDataModel.LinkEstateContractTypeId = this.contractTypeSelected.Id;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormSubmitAllow = false;
    /** Save Value */
    this.dataModel.PropertyDetailValues = [];
    this.dataModel.PropertyDetailGroups.forEach(itemGroup => {
      itemGroup.PropertyDetails.forEach(element => {
        const value = new EstatePropertyDetailValueModel();
        value.LinkPropertyDetailId = element.Id;
        value.Value = this.propertyDetails[element.Id];

        this.dataModel.PropertyDetailValues.push(value);
      });
    });
    /** Save Value */
    if (!this.dataModel.Contracts || this.dataModel.Contracts.length === 0) {
      const message = 'نوع معامله ملک مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.DataEdit();

  }
  onFormCancel(): void {
    // this.dialogRef.close({ dialogChangedDate: false });
    this.router.navigate(['/estate/property']);
  }

  onActionOptionAddToList(): void {
    if (!this.contractTypeSelected || this.contractTypeSelected.Id.length === 0) {
      const message = 'نوع معامله ملک مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    if (!this.dataModel.Contracts) {
      this.dataModel.Contracts = [];
    }
    this.dataModel.Contracts.push(this.contractDataModel);
    // this.contractSelected = new EstateContractModel();
    this.contractDataModel = new EstateContractModel();
    this.optionTabledataSource.data = this.dataModel.Contracts;
  }
  onActionOptionRemoveFromList(index: number): void {
    if (index < 0) {
      return;
    }
    if (!this.dataModel.Contracts || this.dataModel.Contracts.length === 0) {
      return;
    }
    this.contractDataModel = this.dataModel.Contracts[index];
    this.dataModel.Contracts.splice(index, 1);
    // this.contractSelected = new EstateContractModel();
    this.optionTabledataSource.data = this.dataModel.Contracts;
  }


  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      if (!this.dataModel.LinkPropertyTypeUsageId || this.dataModel.LinkPropertyTypeUsageId.length === 0) {
        this.cmsToastrService.typeErrorFormInvalid('نوع کاربری ملک انتخاب شود');
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
      if (!this.dataModel.LinkPropertyTypeLanduseId || this.dataModel.LinkPropertyTypeLanduseId.length === 0) {
        this.cmsToastrService.typeErrorFormInvalid('نوع کاربری زمین انتخاب شود');
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

}

