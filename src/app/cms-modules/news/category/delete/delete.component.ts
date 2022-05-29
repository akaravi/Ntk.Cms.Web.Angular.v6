//**msh */
import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataFieldInfoModel, ErrorExceptionResult, FilterModel, FormInfoModel, NewsCategoryModel, NewsCategoryService } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-news-category-delete',
  templateUrl: './delete.component.html',
})
export class NewsCategoryDeleteComponent implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewsCategoryDeleteComponent>,
    private publicHelper: PublicHelper,
    private categoryService: NewsCategoryService,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestId = +data.Id || 0;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  loading = new ProgressSpinnerModel();
  dataModelResultCategory: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();
  dataModelResultCategoryAllData: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();
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
    this.formInfo.FormAlert = this.translate.instant('TITLE.Loading_Information');
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.categoryService
      .ServiceGetOneById(this.requestId)
      .subscribe({
        next:(ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);
          this.dataModelResultCategory = ret;
          if (!ret.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = ret.ErrorMessage;
            this.formInfo.FormErrorStatus = true;
            this.cmsToastrService.typeErrorGetOne();
          } else {
            this.formInfo.FormAlert = '';
          }
          this.loading.Stop(pName);
        },
        error:(er) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormErrorStatus = true;
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }}
      );
  }
  DataGetAll(): void {
    this.formInfo.FormAlert = this.translate.instant('TITLE.Loading_Information');
    const filterModel: FilterModel = new FilterModel();
    filterModel.RowPerPage = 100;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.categoryService
      .ServiceGetAll(filterModel)
      .subscribe({
        next:(ret) => {
          this.dataModelResultCategoryAllData = ret;
          if (!ret.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = ret.ErrorMessage;
            this.formInfo.FormErrorStatus = true;
            this.cmsToastrService.typeErrorGetAll();
          } else {
            this.formInfo.FormAlert = '';
          }
          this.loading.Stop(pName);
        },
        error:(er) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormErrorStatus = true;
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }}
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
    this.formInfo.FormSubmitAllow = true;
    if (this.dataModel.NewCatId === this.requestId) {
      this.formInfo.FormAlert = 'برروز خطا';
      this.formInfo.FormError =
      this.translate.instant('ERRORMESSAGE.MESSAGE.The_delete_category_ID_is_the_same_as_the_alternate_category');
      this.formInfo.ButtonSubmittedEnabled = true;
    }
    this.formInfo.ButtonSubmittedEnabled = false;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.categoryService
      .ServiceMove(this.requestId, this.dataModel.NewCatId)
      .subscribe({
        next:(ret) => {
          if (!ret.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = ret.ErrorMessage;
            this.cmsToastrService.typeErrorMove();
          } else {
            this.formInfo.FormAlert = this.translate.instant('MESSAGE.The_Transfer_Was_Successful');
            this.cmsToastrService.typeSuccessMove();
          }
          this.formInfo.FormSubmitAllow = true;
          this.formInfo.ButtonSubmittedEnabled = true;
          this.loading.Stop(pName);
        },
        error:(er) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.cmsToastrService.typeError(er);
          this.formInfo.ButtonSubmittedEnabled = true;
          this.formInfo.FormSubmitAllow = true;
          this.loading.Stop(pName);
        }}
      );
  }
  onFormDelete(): void {
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.ButtonSubmittedEnabled = false;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.categoryService
      .ServiceDelete(this.requestId)
      .subscribe({
        next:(ret) => {
          this.formInfo.FormSubmitAllow = !ret.IsSuccess;
          if (!ret.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = ret.ErrorMessage;
            this.cmsToastrService.typeErrorRemove();
          } else {
            this.formInfo.FormAlert = this.translate.instant('MESSAGE.Deletion_Was_Successful');
            this.cmsToastrService.typeSuccessRemove();
            this.dialogRef.close({ dialogChangedDate: true });
          }
          this.formInfo.ButtonSubmittedEnabled = true;
          this.loading.Stop(pName);
        },
        error:(er) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeError(er);
          this.formInfo.ButtonSubmittedEnabled = true;
          this.loading.Stop(pName);
        }}
      );
  }
  onFormChangeNewCatId(model: NewsCategoryModel): void {
    this.formInfo.FormAlert = '';
    if (this.requestId === 0 || !model || model.Id <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.dataModel.NewCatId = model.Id;
    if (this.dataModel.NewCatId === this.requestId) {
      this.formInfo.FormAlert = 'برروز خطا';
      this.formInfo.FormError =
      this.translate.instant('ERRORMESSAGE.MESSAGE.The_delete_category_ID_is_the_same_as_the_alternate_category');
      this.formInfo.ButtonSubmittedEnabled = false;
    } else {
      this.formInfo.ButtonSubmittedEnabled = true;
      this.formInfo.FormError = '';
    }
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
