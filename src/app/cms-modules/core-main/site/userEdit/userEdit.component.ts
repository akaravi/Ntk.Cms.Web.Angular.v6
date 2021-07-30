import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreSiteModel,
  FilterModel,
  FilterDataModel,
  CoreSiteUserService,
  CoreSiteUserModel,
  CoreModuleModel,
  AccessModel,
  DataFieldInfoModel,
  CoreUserModel,
  CoreUserGroupModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import {
  TreeModel,
  NodeInterface,
} from 'ntk-cms-filemanager';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-core-site-user-edit',
  templateUrl: './userEdit.component.html',
  styleUrls: ['./userEdit.component.scss'],
})
export class CoreSiteUserEditComponent implements OnInit {
  requestLinkSiteId = 0;
  requestLinkUserId = 0;
  requestLinkUserGroupId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<CoreSiteUserEditComponent>,
    public coreEnumService: CoreEnumService,
    public coreSiteUserService: CoreSiteUserService,
    private cmsToastrService: CmsToastrService,
    private publicHelper: PublicHelper,
    private translate: TranslateService,
  ) {
    if (data) {
      this.requestLinkUserId = +data.LinkUserId || 0;
      this.requestLinkSiteId = +data.LinkSiteId || 0;
      this.requestLinkUserGroupId = +data.LinkUserGroupId || 0;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();



  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreSiteUserModel> = new ErrorExceptionResult<CoreSiteUserModel>();
  dataModel: CoreSiteUserModel = new CoreSiteUserModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  fileManagerOpenForm = false;
  storeSnapshot = this.cmsStoreService.getStateSnapshot();
  dataAccessModel: AccessModel;

  ngOnInit(): void {
    if (this.requestLinkUserId <= 0 || this.requestLinkSiteId <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.getEnumRecordStatus();
    this.DataGetOneContent();
  }
  getEnumRecordStatus(): void {
    if (this.storeSnapshot &&
      this.storeSnapshot.EnumRecordStatus &&
      this.storeSnapshot.EnumRecordStatus &&
      this.storeSnapshot.EnumRecordStatus.IsSuccess &&
      this.storeSnapshot.EnumRecordStatus.ListItems &&
      this.storeSnapshot.EnumRecordStatus.ListItems.length > 0) {
      this.dataModelEnumRecordStatusResult = this.storeSnapshot.EnumRecordStatus;
    }
  }

  DataGetOneContent(): void {


    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    const filteModelContent = new FilterModel();
    /*make filter*/
    let filter = new FilterDataModel();
    filter.PropertyName = 'LinkUserId';
    filter.Value = this.requestLinkUserId;
    filteModelContent.Filters.push(filter);
    /*make filter*/
    filter = new FilterDataModel();
    filter.PropertyName = 'LinkSiteId';
    filter.Value = this.requestLinkSiteId;
    filteModelContent.Filters.push(filter);

    filteModelContent.AccessLoad = true;

    this.coreSiteUserService.ServiceGetAll(filteModelContent).subscribe(
      (next) => {
        /*َAccess Field*/
        this.dataAccessModel = next.Access;
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        this.dataModel = next.Item;
        if (next.IsSuccess) {
          if (next.ListItems && next.ListItems.length > 0) {
            this.dataModel = next.ListItems[0];
            this.formInfo.FormTitle = this.formInfo.FormTitle;
            this.formInfo.FormAlert = '';
          }
          else {
            this.cmsToastrService.typeError('ماژول جهت ویرایش یافت نشد');

          }
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.display = false;
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.display = false;
      }
    );
  }

  DataEditContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    this.loading.display = true;
    this.coreSiteUserService.ServiceEdit(this.dataModel).subscribe(
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
        this.loading.display = false;
      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.display = false;
      }
    );
  }

  onActionSelectorSiteSelect(model: CoreSiteModel): void {
    this.dataModel.LinkSiteId = null;
    if (model && model.Id > 0) {
      this.dataModel.LinkSiteId = model.Id;
    }
  }
  onActionSelectorUserSelect(model: CoreUserModel): void {
    this.dataModel.LinkUserId = null;
    if (model && model.Id > 0) {
      this.dataModel.LinkUserId = model.Id;
    }
  }
  onActionSelectorUserGroupSelect(model: CoreUserGroupModel): void {
    this.dataModel.LinkUserGroupId = null;
    if (model && model.Id > 0) {
      this.dataModel.LinkUserGroupId = model.Id;
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
}
