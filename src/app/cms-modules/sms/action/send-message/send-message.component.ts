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
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
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
      this.dataModel.linkApiPathId = this.requestLinkApiPathId;
    }
  }



  onActionSelectPrivateSiteConfig(model: SmsMainApiPathModel): void {
    this.dataModel.linkApiPathId = this.requestLinkApiPathId;
    this.dataModelParentSelected = model;
    if (model && model.id.length > 0) {
      this.dataModel.linkApiPathId = model.id;

    }
  }


  onActionSelectApiNumber(model: SmsMainApiNumberModel): void {
    if (model && model.id.length > 0) {
      this.dataModel.linkFromNumber = model.id;
    }
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (!this.dataModel.linkApiPathId || this.dataModel.linkApiPathId.length <= 0) {
      this.cmsToastrService.typeErrorFormInvalid();
    }
    // if (!this.dataModel.amount || this.dataModel.amount <= 0) {
    //   this.cmsToastrService.typeErrorFormInvalid();
    // }
    this.formInfo.formSubmitAllow = false;
    const pName = this.constructor.name + 'main';
    this.loadingAction.Start(pName);

    this.smsMainApiPathService.ServiceSendMessage(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = 'درخواست ارسال با موفقیت ثبت شد';
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Send_request_was_successfully_registered'));
        } else {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
        }
        this.loadingAction.Stop(pName);
      },
      error: (e) => {
        this.formInfo.formSubmitAllow = true;
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
