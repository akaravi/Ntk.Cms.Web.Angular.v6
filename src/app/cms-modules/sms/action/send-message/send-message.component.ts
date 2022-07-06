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
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
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
    public coreEnumService: CoreEnumService,
    public smsMainApiPathService: SmsMainApiPathService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.loadingAction.cdr = this.cdr;

  }

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  loadingAction = new ProgressSpinnerModel();
  dataModelParentSelected: SmsMainApiPathModel = new SmsMainApiPathModel();
  dataModel: SmsApiSendMessageDtoModel = new SmsApiSendMessageDtoModel();
  dataModelResult: ErrorExceptionResult<SmsApiSendResultModel> = new ErrorExceptionResult<SmsApiSendResultModel>();
  formInfo: FormInfoModel = new FormInfoModel();
  clipboardText = '';

  ngOnInit(): void {
    if (this.requestLinkApiPathId?.length > 0) {
      this.dataModel.linkApiPathId = this.requestLinkApiPathId;
    }
    // setTimeout(async () => {
    //   navigator['clipboard'].readText().then(text => {
    //     debugger
    //     this.clipboardText = text;
    //   }).catch(err => {
    //     debugger
    //     console.error('Failed to read clipboard contents: ', err);
    //   })
    // }, 3000);
    //setTimeout(async () => this.clipboardText = await window.navigator.clipboard.readText(), 3000);
    this.readClipboardFromDevTools().then((r) => this.clipboardText = r as string);

  }

  readClipboardFromDevTools() {
    return new Promise((resolve, reject) => {
      const _asyncCopyFn = (async () => {
        try {
          const value = await navigator.clipboard.readText();
          console.log(`${value} is read!`);
          resolve(value);
        } catch (e) {
          reject(e);
        }
        window.removeEventListener("focus", _asyncCopyFn);
      });

      window.addEventListener("focus", _asyncCopyFn);
      console.log("Hit <Tab> to give focus back to document (or we will face a DOMException);");
    });
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
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
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
  onActionContactSelectChecked(model: number): void {
    if (!model || model <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
  
  }
  onActionContactSelectDisChecked(model: number): void {
    if (!model || model <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
  }
}
