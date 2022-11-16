
import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DataFieldInfoModel,
  EnumManageUserAccessDataTypes,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel,
  SmsMainMessageCategoryModel,
  SmsMainMessageCategoryService
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-sms-main-message-category-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class SmsMainMessageCategoryDeleteComponent implements OnInit {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SmsMainMessageCategoryDeleteComponent>,
    private publicHelper: PublicHelper,
    private smsMainMessageCategoryService: SmsMainMessageCategoryService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data && data.id&& data.id.length>0) {
      this.requestId = data.id ;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  loading = new ProgressSpinnerModel();
  dataModelResultCategory: ErrorExceptionResult<SmsMainMessageCategoryModel> = new ErrorExceptionResult<SmsMainMessageCategoryModel>();
  dataModelResultCategoryAllData: ErrorExceptionResult<SmsMainMessageCategoryModel> = new ErrorExceptionResult<SmsMainMessageCategoryModel>();
  dataModel: any = {};
  formInfo: FormInfoModel = new FormInfoModel();
  ngOnInit(): void {

    if (this.requestId.length== 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOne();
    this.DataGetAll();
  }

  DataGetOne(): void {
    if (this.requestId.length === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.formInfo.formAlert = this.translate.instant('TITLE.Loading_Information');
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.smsMainMessageCategoryService.setAccessLoad();
    this.smsMainMessageCategoryService.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
    this.smsMainMessageCategoryService
      .ServiceGetOneById(this.requestId)
      .subscribe({
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

          this.dataModelResultCategory = ret;
          if (!ret.isSuccess) {
            this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
            this.formInfo.formError = ret.errorMessage;
            this.formInfo.formErrorStatus = true;
            this.cmsToastrService.typeErrorGetOne();
          } else {
            this.formInfo.formAlert = '';
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formErrorStatus = true;
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
      );

  }
  DataGetAll(): void {
    this.formInfo.formAlert = this.translate.instant('TITLE.Loading_Information');
    const filterModel: FilterModel = new FilterModel();
    filterModel.rowPerPage = 100;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.smsMainMessageCategoryService
      .ServiceGetAll(filterModel)
      .subscribe({
        next: (ret) => {
          this.dataModelResultCategoryAllData = ret;
          if (!ret.isSuccess) {
            this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
            this.formInfo.formError = ret.errorMessage;
            this.formInfo.formErrorStatus = true;
            this.cmsToastrService.typeErrorGetAll();
          } else {
            this.formInfo.formAlert = '';
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formErrorStatus = true;
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
      );

  }
  onFormMove(): void {
    if (this.requestId.length === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = true;
    if (this.dataModel.newCatId === this.requestId) {
      this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
      this.formInfo.formError =
        this.translate.instant('ERRORMESSAGE.MESSAGE.The_delete_category_ID_is_the_same_as_the_alternate_category');
      this.formInfo.buttonSubmittedEnabled = true;
    }

    this.formInfo.buttonSubmittedEnabled = false;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.smsMainMessageCategoryService
      .ServiceMove(this.requestId, this.dataModel.newCatId)
      .subscribe({
        next: (ret) => {
          if (!ret.isSuccess) {
            this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
            this.formInfo.formError = ret.errorMessage;
            this.cmsToastrService.typeErrorMove();
          } else {
            this.formInfo.formAlert = this.translate.instant('MESSAGE.The_Transfer_Was_Successful');
            this.cmsToastrService.typeSuccessMove();
          }
          this.formInfo.formSubmitAllow = true;
          this.formInfo.buttonSubmittedEnabled = true;
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.cmsToastrService.typeError(er);
          this.formInfo.buttonSubmittedEnabled = true;
          this.formInfo.formSubmitAllow = true;
          this.loading.Stop(pName);
        }
      }
      );
  }
  onFormDelete(): void {
    if (this.requestId.length === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }

    this.formInfo.formSubmitAllow = false;
    this.formInfo.buttonSubmittedEnabled = false;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.smsMainMessageCategoryService
      .ServiceDelete(this.requestId)
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = !ret.isSuccess;
          if (!ret.isSuccess) {
            this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
            this.formInfo.formError = ret.errorMessage;
            this.cmsToastrService.typeErrorRemove();
          } else {
            this.formInfo.formAlert = this.translate.instant('MESSAGE.Deletion_Was_Successful');
            this.cmsToastrService.typeSuccessRemove();
            this.dialogRef.close({ dialogChangedDate: true });
          }
          this.formInfo.buttonSubmittedEnabled = true;
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeError(er);
          this.formInfo.buttonSubmittedEnabled = true;
          this.loading.Stop(pName);
        }
      }
      );

  }
  onFormChangeNewCatId(model: SmsMainMessageCategoryModel): void {
    this.formInfo.formAlert = '';
    if (this.requestId.length === 0 || !model || model.id.length <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.dataModel.newCatId = model.id;
    if (this.dataModel.newCatId === this.requestId) {
      this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
      this.formInfo.formError =
        this.translate.instant('ERRORMESSAGE.MESSAGE.The_delete_category_ID_is_the_same_as_the_alternate_category');
      this.formInfo.buttonSubmittedEnabled = false;
    } else {
      this.formInfo.buttonSubmittedEnabled = true;
      this.formInfo.formError = '';
    }
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });

  }
}
