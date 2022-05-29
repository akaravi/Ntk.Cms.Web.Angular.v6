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
  DataFieldInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  LinkManagementTargetBillboardLogModel,
  LinkManagementTargetBillboardLogService
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-linkmanagement-target-billboard-log-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class LinkManagementTargetBillboardLogDeleteComponent implements OnInit {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<LinkManagementTargetBillboardLogDeleteComponent>,
    private publicHelper: PublicHelper,
    private linkManagementTargetBillboardLogService: LinkManagementTargetBillboardLogService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data && data.id) {
      this.requestId = data.id;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  loading = new ProgressSpinnerModel();
  dataModelResultContent: ErrorExceptionResult<LinkManagementTargetBillboardLogModel> = new ErrorExceptionResult<LinkManagementTargetBillboardLogModel>();
  formInfo: FormInfoModel = new FormInfoModel();
  ngOnInit(): void {
    if (this.requestId.length <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOne();
  }

  DataGetOne(): void {
    if (this.requestId.length === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.formInfo.FormAlert = 'در حال لود اطلاعات';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.linkManagementTargetBillboardLogService.setAccessLoad();
    this.linkManagementTargetBillboardLogService
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
    if (this.requestId.length === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }

    this.formInfo.FormSubmitAllow = false;
    this.formInfo.ButtonSubmittedEnabled = false;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.linkManagementTargetBillboardLogService
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
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });

  }
}
