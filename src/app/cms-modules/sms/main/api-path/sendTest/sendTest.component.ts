import {
  CoreEnumService,
  FormInfoModel,
  ErrorExceptionResult,
  SmsApiSendTestDtoModel,
  SmsApiSendResultModel,
  SmsMainApiPathService,
  SmsMainApiPathModel,
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


@Component({
  selector: 'app-sms-privateconfig-sendtest',
  templateUrl: './sendTest.component.html',
  styleUrls: ['./sendTest.component.scss'],
})
export class SmsMainApiPathSendTestComponent implements OnInit {
  requestLinkConfigId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: any,
    private dialogRef: MatDialogRef<SmsMainApiPathSendTestComponent>,
    public coreEnumService: CoreEnumService,
    public smsMainApiPathService: SmsMainApiPathService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    if (data && data.LinkConfigId) {
      this.requestLinkConfigId = data.LinkConfigId ;
    }
    // this.dataModel.LastUrlAddressInUse = this.document.location.href;
  }
  
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  dataModelParentSelected: SmsMainApiPathModel = new SmsMainApiPathModel();
  dataModel: SmsApiSendTestDtoModel = new SmsApiSendTestDtoModel();
  dataModelResult: ErrorExceptionResult<SmsApiSendResultModel>    = new ErrorExceptionResult<SmsApiSendResultModel>();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelResultGotoBank = false;

  ngOnInit(): void {
    if (this.requestLinkConfigId.length <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    // this.dataModel.SmsMainApiPathPrivateId = this.requestLinkConfigId;
  }



  onActionSelectConfig(model: SmsMainApiPathModel): void {
    // this.dataModel.SmsMainApiPathPrivateId = null;
    this.dataModelParentSelected = model;
    if (model && model.Id.length > 0) {
      // this.dataModel.SmsMainApiPathPrivateId = model.Id;
    }
  }
  onGotoBank(): void {
    if (this.dataModelResultGotoBank && this.dataModelResult.IsSuccess) {
      this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Transferring_to_the_send_gateway'));

      // this.document.location.href = this.dataModelResult.Item.UrlToPay;
    }
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    // if (!this.dataModel.SmsMainApiPathPrivateId || this.dataModel.SmsMainApiPathPrivateId <= 0) {
    //   this.cmsToastrService.typeErrorFormInvalid();
    // }
    // if (!this.dataModel.Amount || this.dataModel.Amount <= 0) {
    //   this.cmsToastrService.typeErrorFormInvalid();
    // }
    this.formInfo.FormSubmitAllow = false;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.smsMainApiPathService.ServiceTestSend(this.dataModel).pipe(
      map((next) => {
        this.formInfo.FormSubmitAllow = true;
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'درخواست پرداخت با موفقیت ثبت شد';

          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Send_request_was_successfully_registered'));

          this.dataModelResultGotoBank = true;


        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop(pName);

      },
        (error) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeError(error);
          this.loading.Stop(pName);

        }
      )).toPromise();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
