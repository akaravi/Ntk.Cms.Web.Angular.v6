import {
  CoreEnumService,
  FormInfoModel,
  ErrorExceptionResult,
  SmsApiSendMessageDtoModel,
  SmsApiSendResultModel,
  SmsMainApiPathService,
  SmsMainApiPathModel,
  SmsMainApiNumberModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { DOCUMENT } from '@angular/common';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';


@Component({
  selector: 'app-sms-action-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss'],
})
export class SmsActionSendMessageComponent implements OnInit {
  requestLinkApiPathId = '';
  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // @Inject(DOCUMENT) private document: any,
    // private dialogRef: MatDialogRef<SmsActionSendMessageComponent>,
    public coreEnumService: CoreEnumService,
    public smsMainApiPathService: SmsMainApiPathService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loadingAction.cdr = this.cdr;

  }

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  loadingAction = new ProgressSpinnerModel();
  dataModelParentSelected: SmsMainApiPathModel = new SmsMainApiPathModel();
  dataModel: SmsApiSendMessageDtoModel = new SmsApiSendMessageDtoModel();
  dataModelResult: ErrorExceptionResult<SmsApiSendResultModel> = new ErrorExceptionResult<SmsApiSendResultModel>();
  formInfo: FormInfoModel = new FormInfoModel();


  ngOnInit(): void {
    if (this.requestLinkApiPathId?.length > 0) {
      this.dataModel.LinkApiPathId = this.requestLinkApiPathId;
    }
  }



  onActionSelectPrivateSiteConfig(model: SmsMainApiPathModel): void {
    this.dataModel.LinkApiPathId = this.requestLinkApiPathId;
    this.dataModelParentSelected = model;
    if (model && model.Id.length > 0) {
      this.dataModel.LinkApiPathId = model.Id;

    }
  }


  onActionSelectApiNumber(model: SmsMainApiNumberModel): void {
    if (model && model.Id.length > 0) {
      this.dataModel.LinkFromNumber = model.Id;
    }
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (!this.dataModel.LinkApiPathId || this.dataModel.LinkApiPathId.length <= 0) {
      this.cmsToastrService.typeErrorFormInvalid();
    }
    // if (!this.dataModel.Amount || this.dataModel.Amount <= 0) {
    //   this.cmsToastrService.typeErrorFormInvalid();
    // }
    this.formInfo.FormSubmitAllow = false;
    const pName = this.constructor.name + 'main';
    this.loadingAction.Start(pName);

    this.smsMainApiPathService.ServiceSendMessage(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.FormSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.IsSuccess) {
          this.formInfo.FormAlert = 'درخواست ارسال با موفقیت ثبت شد';
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Send_request_was_successfully_registered'));
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = ret.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
        this.loadingAction.Stop(pName);
      },
      error: (e) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(e);
        this.loadingAction.Stop(pName);

      },
      complete: () => {
        console.info;
      }
    }

    );
  }
  onFormCancel(): void {
    // this.dialogRef.close({ dialogChangedDate: false });
  }
}
