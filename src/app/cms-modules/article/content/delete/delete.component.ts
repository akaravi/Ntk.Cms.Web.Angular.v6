//**msh */
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ErrorExceptionResult,
  FormInfoModel, ArticleContentModel,
  ArticleContentService,
  DataFieldInfoModel
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
@Component({
  selector: 'app-article-content-delete',
  templateUrl: './delete.component.html',
})
export class ArticleContentDeleteComponent implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ArticleContentDeleteComponent>,
    private publicHelper: PublicHelper,
    public contentService: ArticleContentService,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService
  ) {
    this.loading.cdr = this.cdr;
    if (data) {
      this.requestId = +data.id || 0;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  loading = new ProgressSpinnerModel();
  dataModelResultContent: ErrorExceptionResult<ArticleContentModel> = new ErrorExceptionResult<ArticleContentModel>();
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
    const pName = this.constructor.name + 'fieldInfoConvertor';
    this.loading.Start(pName);

    this.contentService
      .ServiceGetOneById(this.requestId)
      .subscribe({
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);

          this.dataModelResultContent = ret;
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
    this.contentService
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
        error:(er) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeError(er);
          this.formInfo.ButtonSubmittedEnabled = true;
          this.loading.Stop(pName);
        }
      }
      );
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}