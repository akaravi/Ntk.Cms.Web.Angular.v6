import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreSiteModel,
  FilterModel,
  FilterDataModel,
  CoreSiteCategoryCmsModuleService,
  CoreSiteCategoryCmsModuleModel,
  CoreModuleModel,
  AccessModel,
  DataFieldInfoModel,
  CoreSiteCategoryModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import {
  TreeModel,
  NodeInterface,
} from 'src/app/modules/filemanager_api';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-core-sitecategorycmsmodule-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class CoreSiteCategoryCmsModuleEditComponent implements OnInit {
  requestLinkCmsModuleId = 0;
  requestLinkCmsSiteCategoryId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<CoreSiteCategoryCmsModuleEditComponent>,
    public coreEnumService: CoreEnumService,
    public coreSiteCategoryCmsModuleService: CoreSiteCategoryCmsModuleService,
    private cmsToastrService: CmsToastrService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private publicHelper: PublicHelper,

  ) {
    if (data) {
      this.requestLinkCmsSiteCategoryId = +data.LinkCmsSiteCategoryId || 0;
      this.requestLinkCmsModuleId = +data.LinkCmsModuleId || 0;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();




  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreSiteCategoryCmsModuleModel> = new ErrorExceptionResult<CoreSiteCategoryCmsModuleModel>();
  dataModel: CoreSiteCategoryCmsModuleModel = new CoreSiteCategoryCmsModuleModel();


  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  fileManagerOpenForm = false;
  
  dataAccessModel: AccessModel;

  ngOnInit(): void {
    if (this.requestLinkCmsSiteCategoryId <= 0 || this.requestLinkCmsModuleId <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

    this.getEnumRecordStatus();
    this.DataGetOneContent();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult=await this.publicHelper.getEnumRecordStatus();
  }

  DataGetOneContent(): void {


    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.Start('main');
    this.cdr.detectChanges();

    const filteModelContent = new FilterModel();
    /*make filter*/
    let filter = new FilterDataModel();
    filter.PropertyName = 'LinkCmsSiteCategoryId';
    filter.Value = this.requestLinkCmsSiteCategoryId;
    filteModelContent.Filters.push(filter);
    /*make filter*/
    filter = new FilterDataModel();
    filter.PropertyName = 'LinkCmsModuleId';
    filter.Value = this.requestLinkCmsModuleId;
    filteModelContent.Filters.push(filter);

    filteModelContent.AccessLoad = true;
    /*َAccess Field*/
    this.coreSiteCategoryCmsModuleService.setAccessLoad();

    this.coreSiteCategoryCmsModuleService.ServiceGetAll(filteModelContent).subscribe(
      (next) => {

        /*َAccess Field*/
        this.dataAccessModel = next.Access;
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
        this.dataModel = next.Item;
        if (next.IsSuccess) {
          if (next.ListItems && next.ListItems.length > 0) {
            this.dataModel = next.ListItems[0];
            this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.LinkCmsModuleId + '<==>' + next.Item.LinkCmsSiteCategoryId;
            this.formInfo.FormAlert = '';
          }
          else {
            this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.Module_not_found_for_editing'));
          }
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop('main');
    this.cdr.detectChanges();
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop('main');
    this.cdr.detectChanges();
      }
    );
  }

  DataEditContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    this.loading.Start('main');
    this.cdr.detectChanges();
    this.coreSiteCategoryCmsModuleService.ServiceEdit(this.dataModel).subscribe(
      (next) => {
        this.formInfo.FormSubmitAllow = true;
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });

        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop('main');
    this.cdr.detectChanges();
      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop('main');
    this.cdr.detectChanges();
      }
    );
  }
  onActionSiteCategorySelect(model: CoreSiteCategoryModel): void {
    this.dataModel.LinkCmsSiteCategoryId = null;
    if (model && model.Id > 0) {
      this.dataModel.LinkCmsSiteCategoryId = model.Id;
    }
  }
  onActionSelectorModuleSelect(model: CoreModuleModel): void {
    this.dataModel.LinkCmsModuleId = null;
    if (model && model.Id > 0) {
      this.dataModel.LinkCmsModuleId = model.Id;
    }
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
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
}
