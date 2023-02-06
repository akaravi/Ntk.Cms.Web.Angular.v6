
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreModuleEntityModel, CoreUserSupportAccessModel, CoreUserSupportAccessService, DataFieldInfoModel, EnumInfoModel, EnumManageUserAccessDataTypes, ErrorExceptionResult, FilterDataModel,
  FilterModel, FormInfoModel
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-user-support-access-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class CoreUserSupportAccessEditComponent implements OnInit {
  requestLinkSiteId = 0;
  requestLinkUserId = 0;
  requestModuleName = '';
  requestModuleEntityName = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreUserSupportAccessEditComponent>,
    public coreEnumService: CoreEnumService,
    public coreUserSupportAccessService: CoreUserSupportAccessService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');

    if (data) {
      this.requestLinkSiteId = +data.linkSiteId || 0;
      this.requestLinkUserId = +data.linkUserId || 0;
      this.requestModuleName = data.moduleName;
      this.requestModuleEntityName = data.moduleEntityName;
    }

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreUserSupportAccessModel> = new ErrorExceptionResult<CoreUserSupportAccessModel>();
  dataModel: CoreUserSupportAccessModel = new CoreUserSupportAccessModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumManageUserAccessUserTypesResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  fileManagerOpenForm = false;

  ngOnInit(): void {
    if (this.requestLinkSiteId > 0 && this.requestLinkUserId > 0 && this.requestModuleName && this.requestModuleName.length > 0 && this.requestModuleEntityName && this.requestModuleEntityName.length > 0) {
      this.formInfo.formTitle = this.translate.instant('TITLE.Edit');
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.getEnumManageUserAccessUserTypes();
    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  getEnumManageUserAccessUserTypes(): void {
    this.coreEnumService.ServiceEnumManageUserAccessUserTypes().subscribe((next) => {
      this.dataModelEnumManageUserAccessUserTypesResult = next;
    });
  }
  DataGetOneContent(): void {
    if (this.requestLinkSiteId <= 0 || this.requestLinkUserId <= 0 || !this.requestModuleName || this.requestModuleName.length == 0 || !this.requestModuleEntityName || this.requestModuleEntityName.length <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.formAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    const filteModelContent = new FilterModel();
    /*make filter*/
    let filter = new FilterDataModel();
    filter.propertyName = 'LinkSiteId';
    filter.value = this.requestLinkSiteId;
    filteModelContent.filters.push(filter);
    /*make filter*/
    filter = new FilterDataModel();
    filter.propertyName = 'LinkUserId';
    filter.value = this.requestLinkUserId;
    filteModelContent.filters.push(filter);
    /*make filter*/
    filter = new FilterDataModel();
    filter.propertyName = 'ModuleName';
    filter.value = this.requestModuleName;
    filteModelContent.filters.push(filter);
    /*make filter*/
    filter = new FilterDataModel();
    filter.propertyName = 'ModuleEntityName';
    filter.value = this.requestModuleEntityName;
    filteModelContent.filters.push(filter);

    this.coreUserSupportAccessService.setAccessLoad();
    this.coreUserSupportAccessService.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
    this.coreUserSupportAccessService.ServiceGetAll(filteModelContent).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          if (ret.listItems && ret.listItems.length > 0) {
            this.dataModel = ret.listItems[0];
            this.formInfo.formAlert = '';
          }
          else {
            this.cmsToastrService.typeError(this.translate.instant('MESSAGE.Module_not_found_for_editing'));
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

  DataEditContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.sending_information_to_the_server'));

    this.coreUserSupportAccessService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });

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
  onActionSelectorModuleEntitySelect(model: CoreModuleEntityModel): void {
    this.dataModel.moduleName = '';
    this.dataModel.moduleEntityName = '';
    if (model && model.id > 0) {
      this.dataModel.moduleName = model.moduleName;
      this.dataModel.moduleEntityName = model.moduleEntityName;
    }
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
