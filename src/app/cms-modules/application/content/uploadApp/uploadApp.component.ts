//**msh */
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilePreviewModel } from 'ngx-awesome-uploader';
import { ApplicationAppModel, ApplicationAppService, DataFieldInfoModel, FormInfoModel, UploadApplictionDtoModel } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-upload-app',
  templateUrl: './uploadApp.component.html',
  styleUrls: ['./uploadApp.component.scss']
})
export class ApplicationAppUploadAppComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dataItemModel: ApplicationAppModel,
    private dialogRef: MatDialogRef<ApplicationAppUploadAppComponent>,
    private applicationAppService: ApplicationAppService,
    private cmsToastrService: CmsToastrService,
    private publicHelper: PublicHelper
  ) {
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  formInfo: FormInfoModel = new FormInfoModel();
  dataModel = new UploadApplictionDtoModel();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  isHovering = false;
  fieldvalue = '';
  loading = new ProgressSpinnerModel();

  ngOnInit(): void {
    this.dataModel.AppVersion = this.dataItemModel.AppVersion;
    this.dataModel.LastBuildAppKey = this.dataItemModel.LastBuildAppKey;
    this.dataModel.LinkApplicationId = this.dataItemModel.Id;
    this.formInfo.FormSubmitAllow = false;
    this.DataGetAccess();
  }
  DataGetAccess(): void {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.applicationAppService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.IsSuccess) {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.ErrorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (!this.dataModel.UploadFileGUID || this.dataModel.UploadFileGUID.length === 0) {
      this.cmsToastrService.typeErrorEdit('فایل آپلود نشده است');
      return;
    }
    if (!this.dataModel.LinkApplicationId || this.dataModel.LinkApplicationId > 0) {
      this.cmsToastrService.typeErrorEdit('اپلکیشن مشخص نیست');
      return;
    }
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.formInfo.FormSubmitAllow = false;
    this.applicationAppService.ServiceUpload(this.dataModel).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.formInfo.FormSubmitAllow = false;
          this.cmsToastrService.typeSuccessAppUpload();
        } else {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorEdit(ret.ErrorMessage);
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeErrorEdit(er);
        this.loading.Stop(pName);
      }
    });
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  toggleHover(model: any): void {
    this.isHovering = true;
  }
  onUpload(e): void {
    console.log(e);
  }
  OnActionUploadSuccess(model: FilePreviewModel): void {
    if (model.uploadResponse && model.uploadResponse.Item && model.uploadResponse.Item.FileKey) {
      this.dataModel.UploadFileGUID = model.uploadResponse.Item.FileKey;
      this.formInfo.FormSubmitAllow = true;
    }
  }
}
