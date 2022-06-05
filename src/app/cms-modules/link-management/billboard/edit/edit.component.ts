//**msh */
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  LinkManagementBillboardModel,
  LinkManagementBillboardService,
  DataFieldInfoModel,
  AccessModel,
  LinkManagementBillboardPatternModel,
  LinkManagementMemberModel,
  LinkManagementBillboardTargetCategoryService,
  LinkManagementBillboardTargetCategoryModel,
  FilterModel,
  FilterDataModel,
  EnumClauseType,
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
  selector: 'app-linkmanagement-Billboard-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'
  ]
})
export class LinkManagementBillboardEditComponent implements OnInit, AfterViewInit {
  requestId = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    private contentCategoryService: LinkManagementBillboardTargetCategoryService,
    private linkManagementBillboardService: LinkManagementBillboardService,
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
  dataModel = new LinkManagementBillboardModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModelResult: ErrorExceptionResult<LinkManagementBillboardModel> = new ErrorExceptionResult<LinkManagementBillboardModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumManagementContentSettingTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumSharingPriceTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  optionActionTitle = this.translate.instant('ACTION.Add_To_List');
  optionActionButtomEnable = true;
  optionTabledisplayedColumns = ['Id', 'Option', 'OptionAnswer', 'IsCorrectAnswer', 'NumberOfVotes', 'ScoreOfVotes', 'Action'];
  dataContentCategoryModel: number[] = [];


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
    this.requestId = + Number(this.activatedRoute.snapshot.paramMap.get('Id'));
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }
    this.DataGetOne();
    this.DataCategoryGetAll();
    this.getEnumRecordStatus();
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
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }


    this.DataEditContent();
  }

  DataGetOne(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    /*َAccess Field*/
    this.linkManagementBillboardService.setAccessLoad();
    this.linkManagementBillboardService
      .ServiceGetOneById(this.requestId)
      .subscribe({
        next: (ret) => {

          /*َAccess Field*/
          this.dataAccessModel = ret.Access;
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);
          this.dataModelResult = ret;
          this.formInfo.FormSubmitAllow = true;

          if (ret.IsSuccess) {
            this.dataModel = ret.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.ErrorMessage);
          }
          this.loading.Stop(pName);

        },
        error: (er) => {
          this.loading.Stop(pName);
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
        }
      }
      );
  }

  DataEditContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.sending_information_to_the_server'));


    this.linkManagementBillboardService
      .ServiceEdit(this.dataModel)
      .subscribe({
        next: (ret) => {
          this.loading.Stop(pName);

          this.formInfo.FormSubmitAllow = true;
          this.dataModelResult = ret;
          if (ret.IsSuccess) {

            this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
            this.cmsToastrService.typeSuccessEdit();

            setTimeout(() => this.router.navigate(['/linkmanagement/billboard']), 1000);
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

  onActionSelectorSelectLinkManagementMemberId(model: LinkManagementMemberModel | null): void {
    if (!model || model.Id <= 0) {
      const message = 'حساب کاربری اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkBillboardPatternId = model.Id;
  }
  onActionSelectorSelectLinkBillboardPatternId(model: LinkManagementBillboardPatternModel | null): void {
    if (!model || model.Id <= 0) {
      const message = 'دسته بندی بیلبرد اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkBillboardPatternId = model.Id;
  }
  DataCategoryGetAll(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_category_information_from_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    const filteModel = new FilterModel();
    const filter = new FilterDataModel();
    filter.PropertyName = 'LinkManagementBillboardId';
    filter.Value = this.requestId;
    filter.ClauseType = EnumClauseType.And;
    filteModel.Filters.push(filter);


    this.tagIdsData = [];
    this.contentCategoryService
      .ServiceGetAll(filteModel)
      .subscribe({
        next: (ret) => {

          const itemList = [];
          ret.ListItems.forEach(element => {
            itemList.push(element.LinkTargetCategoryId);
          });
          this.dataContentCategoryModel = itemList;
          this.formInfo.FormSubmitAllow = true;
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetAll(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
  onActionCategorySelectChecked(model: number): void {

    if (!model || model <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    const entity = new LinkManagementBillboardTargetCategoryModel();
    entity.LinkTargetCategoryId = model;
    entity.LinkManagementBillboardId = this.dataModel.Id;
    this.contentCategoryService.ServiceAdd(entity).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_in_this_group_was_successful');
          this.cmsToastrService.typeSuccessEdit();
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = ret.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
      },
      error: (er) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(er);
      }
    }
    );


  }
  onActionCategorySelectDisChecked(model: number): void {

    if (!model || model <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    const entity = new LinkManagementBillboardTargetCategoryModel();
    entity.LinkTargetCategoryId = model;
    entity.LinkManagementBillboardId = this.dataModel.Id;
    this.contentCategoryService.ServiceDeleteEntity(entity).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_in_this_group_was_successful');
          this.cmsToastrService.typeSuccessEdit();
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = ret.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
      },
      error: (er) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(er);
      }
    }
    );
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
  }
  onActionBackToParent(): void {
    this.router.navigate(['/linkmanagement/billboard/']);
  }

}
