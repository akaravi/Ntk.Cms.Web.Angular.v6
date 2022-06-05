//**msh */
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  LinkManagementTargetModel,
  LinkManagementTargetService,
  DataFieldInfoModel,
  AccessModel,
  LinkManagementTargetCategoryModel,
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
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
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
  optionActionTitle = this.translate.instant('ACTION.Add_To_List');
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
      .subscribe({
        next: (ret) => {
          if (ret.IsSuccess) {
            this.dataAccessModel = ret.Access;
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.ErrorMessage);
          }
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
        }
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
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);

          this.dataModelResult = ret;
          this.formInfo.FormSubmitAllow = true;

          if (ret.IsSuccess) {
            this.dataModel = ret.Item;
            this.loading.Stop(pName);

          } else {
            this.cmsToastrService.typeErrorGetOne(ret.ErrorMessage);
          }
        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
        }
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
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);

          this.dataModelResult = ret;
          if (ret.IsSuccess) {
            this.cmsToastrService.typeSuccessAdd();
            this.dataModel = ret.Item;
          } else {
            this.cmsToastrService.typeErrorAdd(ret.ErrorMessage);
          }
          this.formInfo.FormAlert = '';
          this.formInfo.FormSubmitAllow = true;
        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(er);
        }
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
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);

          this.formInfo.FormSubmitAllow = true;
          this.dataModelResult = ret;
          if (ret.IsSuccess) {

            this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
            this.cmsToastrService.typeSuccessEdit();

            setTimeout(() => this.router.navigate(['/linkmanagement/target']), 1000);
          } else {
            this.cmsToastrService.typeErrorEdit(ret.ErrorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeError(er);;
        }
      }
      );
  }

  onActionSelectorSelect(model: LinkManagementTargetCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
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
