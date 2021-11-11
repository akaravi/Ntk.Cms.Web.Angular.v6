import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { FormGroup } from '@angular/forms';
import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel,
  LinkManagementTargetModel,
  LinkManagementTargetService,
  FilterDataModel,

  DataFieldInfoModel,
  AccessModel,
  LinkManagementTargetCategoryModel,
  LinkManagementBillboardModel,
  LinkManagementBillboardPatternModel,
  LinkManagementEnumService,
} from 'ntk-cms-api';
import { ActivatedRoute, Router } from '@angular/router';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { NodeInterface, TreeModel } from 'src/filemanager-api';
import { Map as leafletMap } from 'leaflet';


import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { PoinModel } from 'src/app/core/models/pointModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-linkmanagement-target-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'
  ]
})
export class LinkManagementTargetAddComponent implements OnInit, AfterViewInit {
  requestCategoryId = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    public coreEnumService: CoreEnumService,
    private linkManagementEnumService: LinkManagementEnumService,
    public publicHelper: PublicHelper,
    private linkManagementTargetService: LinkManagementTargetService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loadingOption.cdr = this.cdr;

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  dataModel = new LinkManagementTargetModel();
  dataAccessModel: AccessModel;
  dataModelResult: ErrorExceptionResult<LinkManagementTargetModel> = new ErrorExceptionResult<LinkManagementTargetModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumManagementContentSettingTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumSharingPriceTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  optionActionTitle = 'اضافه به لیست';
  optionActionButtomEnable = true;
  optionTabledisplayedColumns = ['Id', 'Option', 'OptionAnswer', 'IsCorrectAnswer', 'NumberOfVotes', 'ScoreOfVotes', 'Action'];

  loading = new ProgressSpinnerModel();
  loadingOption = new ProgressSpinnerModel();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypePodcast = ['mp3'];
  selectFileTypeMovie = ['mp4', 'webm'];
  formInfo: FormInfoModel = new FormInfoModel();
  fileManagerOpenForm = false;
  fileManagerOpenFormPodcast = false;
  fileManagerOpenFormMovie = false;
  fileManagerTree: TreeModel;
  tagIdsData: number[];


  appLanguage = 'fa';

  viewMap = false;
  mapMarker: any;
  private mapModel: leafletMap;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter = new PoinModel();


  ngOnInit(): void {
    this.requestCategoryId = + Number(this.activatedRoute.snapshot.paramMap.get('CategoryId'));
    if (this.requestCategoryId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.dataModel.LinkTargetCategoryId = this.requestCategoryId;

    this.DataGetAccess();
    this.getEnumRecordStatus();
    this.getEnumSharingPriceType();
    this.getEnumManagementContentSettingType();
  }
  getEnumManagementContentSettingType(): void {
    this.linkManagementEnumService.ServiceEnumManagementContentSettingType().subscribe((res) => {
      this.dataModelEnumManagementContentSettingTypeResult = res;
    });
  }
  getEnumSharingPriceType(): void {
    this.linkManagementEnumService.ServiceEnumSharingPriceType().subscribe((res) => {
      this.dataModelEnumSharingPriceTypeResult = res;
    });
  }
  ngAfterViewInit(): void {

  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }
 
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }


  onFormSubmit(): void {
    if (this.requestCategoryId <= 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }

    this.DataEditContent();


  }
  DataGetAccess(): void {
    this.linkManagementTargetService
      .ServiceViewModel()
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.dataAccessModel = next.Access;
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(next.ErrorMessage);
          }
        },
        (error) => {
          this.cmsToastrService.typeErrorGetAccess(error);
        }
      );
  }
  DataGetOne(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.linkManagementTargetService
      .ServiceGetOneById(this.dataModelResult.Item.Id)
      .subscribe(
        async (next) => {
          this.loading.Stop(pName);

          this.dataModelResult = next;
          this.formInfo.FormSubmitAllow = true;

          if (next.IsSuccess) {
            this.dataModel = next.Item;

            this.loading.Stop(pName);

          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.Stop(pName);

          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
  

  DataAddContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.linkManagementTargetService
      .ServiceAdd(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.Stop(pName);

          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.cmsToastrService.typeSuccessAdd();
            this.dataModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorAdd(next.ErrorMessage);
          }
          this.formInfo.FormAlert = '';
          this.formInfo.FormSubmitAllow = true;
        },
        (error) => {
          this.loading.Stop(pName);

          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(error);
        }
      );
  }

  DataEditContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.linkManagementTargetService
      .ServiceEdit(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.Stop(pName);

          this.formInfo.FormSubmitAllow = true;
          this.dataModelResult = next;
          if (next.IsSuccess) {

            this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
            this.cmsToastrService.typeSuccessAdd();

            setTimeout(() => this.router.navigate(['/linkmanagement/target']), 1000);
          } else {
            this.cmsToastrService.typeErrorAdd(next.ErrorMessage);
          }
          this.loading.Stop(pName);

        },
        (error) => {
          this.loading.Stop(pName);

          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(error);
        }
      );
  }
  
  onActionSelectorSelect(model: LinkManagementTargetCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      const message = 'دسته بندی اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkTargetCategoryId = model.Id;
  }
  onActionSelectorSelectLinkBillboardPatternId(model: LinkManagementBillboardPatternModel | null): void {
    if (!model || model.Id <= 0) {
      const message = 'دسته بندی بیلبرد اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkBillboardPatternId = model.Id;
  }



  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      if (!this.formGroup.valid) {
        this.cmsToastrService.typeErrorFormInvalid();
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
    }
    if (!this.dataModelResult || !this.dataModelResult.Item || this.dataModelResult.Item.Id <= 0) {
      this.DataAddContent();
    }
  }
  onActionBackToParent(): void {
    this.router.navigate(['/linkmanagement/target/']);
  }
  
}
