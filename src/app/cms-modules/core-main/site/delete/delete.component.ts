//**msh */
import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DataFieldInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreSiteModel,
  CoreSiteService
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-core-site-delete',
  templateUrl: './delete.component.html',
})
export class CoreSiteDeleteComponent implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreSiteDeleteComponent>,
    private publicHelper: PublicHelper,
    private coreSiteService: CoreSiteService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestId = +data.id || 0;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreSiteModel> = new ErrorExceptionResult<CoreSiteModel>();
  dataModel: any = {};
  formInfo: FormInfoModel = new FormInfoModel();
  ngOnInit(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOne();
  }
  DataGetOne(): void {
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.formInfo.FormAlert = 'در حال لود اطلاعات';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.coreSiteService.setAccessLoad();
    this.coreSiteService
      .ServiceGetOneById(this.requestId)
      .subscribe({
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);
          this.dataModelResult = ret;
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
        error: (er) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormErrorStatus = true;
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
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
    this.coreSiteService
      .ServiceDelete(this.requestId)
      .subscribe({
        next: (ret) => {
          this.formInfo.FormSubmitAllow = !ret.IsSuccess;
          if (!ret.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = ret.ErrorMessage;
            this.cmsToastrService.typeErrorRemove();
          } else {
            this.formInfo.FormAlert = 'حذف با موفقیت انجام شد';
            this.cmsToastrService.typeSuccessRemove();
            this.dialogRef.close({ dialogChangedDate: true });
          }
          this.formInfo.ButtonSubmittedEnabled = true;
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeError(er);
          this.formInfo.ButtonSubmittedEnabled = true;
          this.loading.Stop(pName);
        }
      }
      );
  }
  onFormChangeNewCatId(model: CoreSiteModel): void {
    this.formInfo.FormAlert = '';
    if (this.requestId === 0 || !model || model.Id <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.dataModel.NewCatId = model.Id;
    if (this.dataModel.NewCatId === this.requestId) {
      this.formInfo.FormAlert = 'برروز خطا';
      this.formInfo.FormError =
        'شناسه دسته بندی در حال حذف با دسته بندی جایگزین یکسان است';
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