//**msh */
import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DataFieldInfoModel,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel,
  DonateTargetCategoryModel,
  DonateTargetCategoryService
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-donate-target-category-delete',
  templateUrl: './delete.component.html'
})
export class DonateTargetCategoryDeleteComponent implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DonateTargetCategoryDeleteComponent>,
    private publicHelper: PublicHelper,
    private donateTargetCategoryService: DonateTargetCategoryService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestId = +data.id || 0;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  loading = new ProgressSpinnerModel();
  dataModelResultCategory: ErrorExceptionResult<DonateTargetCategoryModel> = new ErrorExceptionResult<DonateTargetCategoryModel>();
  dataModelResultCategoryAllData: ErrorExceptionResult<DonateTargetCategoryModel> = new ErrorExceptionResult<DonateTargetCategoryModel>();
  dataModel: any = {};
  formInfo: FormInfoModel = new FormInfoModel();
  ngOnInit(): void {

    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOne();
    this.DataGetAll();
  }

  DataGetOne(): void {
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.formInfo.formAlert = 'در حال لود اطلاعات';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.donateTargetCategoryService
      .ServiceGetOneById(this.requestId)
      .subscribe({
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          this.dataModelResultCategory = ret;
          if (!ret.isSuccess) {
            this.formInfo.formAlert = 'برروز خطا';
            this.formInfo.formError = ret.errorMessage;
            this.formInfo.formErrorStatus = true;
            this.cmsToastrService.typeErrorGetOne();
          } else {
            this.formInfo.formAlert = '';
          }
          this.loading.Stop(pName);

        },
        error: (er) => {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formErrorStatus = true;
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
      );

  }
  DataGetAll(): void {
    this.formInfo.formAlert = 'در حال لود اطلاعات';
    const filterModel: FilterModel = new FilterModel();
    filterModel.rowPerPage = 100;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.donateTargetCategoryService
      .ServiceGetAll(filterModel)
      .subscribe({
        next: (ret) => {
          this.dataModelResultCategoryAllData = ret;
          if (!ret.isSuccess) {
            this.formInfo.formAlert = 'برروز خطا';
            this.formInfo.formError = ret.errorMessage;
            this.formInfo.formErrorStatus = true;
            this.cmsToastrService.typeErrorGetAll();
          } else {
            this.formInfo.formAlert = '';
          }
          this.loading.Stop(pName);

        },
        error: (er) => {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formErrorStatus = true;
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
      );

  }
  onFormMove(): void {
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = true;
    if (this.dataModel.newCatId === this.requestId) {
      this.formInfo.formAlert = 'برروز خطا';
      this.formInfo.formError =
        'شناسه دسته بندی در حال حذف با دسته بندی جایگزین یکسان است';
      this.formInfo.buttonSubmittedEnabled = true;
    }

    this.formInfo.buttonSubmittedEnabled = false;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

  }
  onFormDelete(): void {
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }

    this.formInfo.formSubmitAllow = false;
    this.formInfo.buttonSubmittedEnabled = false;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.donateTargetCategoryService
      .ServiceDelete(this.requestId)
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = !ret.isSuccess;
          if (!ret.isSuccess) {
            this.formInfo.formAlert = 'برروز خطا';
            this.formInfo.formError = ret.errorMessage;
            this.cmsToastrService.typeErrorRemove();

          } else {
            this.formInfo.formAlert = 'حذف با موفقیت انجام شد';
            this.cmsToastrService.typeSuccessRemove();
            this.dialogRef.close({ dialogChangedDate: true });
          }
          this.formInfo.buttonSubmittedEnabled = true;
          this.loading.Stop(pName);

        },
        error: (er) => {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeError(er);
          this.formInfo.buttonSubmittedEnabled = true;
          this.loading.Stop(pName);
        }
      }
      );

  }
  onFormChangeNewCatId(model: DonateTargetCategoryModel): void {
    this.formInfo.formAlert = '';
    if (this.requestId === 0 || !model || model.id <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.dataModel.newCatId = model.id;
    if (this.dataModel.newCatId === this.requestId) {
      this.formInfo.formAlert = 'برروز خطا';
      this.formInfo.formError =
        'شناسه دسته بندی در حال حذف با دسته بندی جایگزین یکسان است';
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
