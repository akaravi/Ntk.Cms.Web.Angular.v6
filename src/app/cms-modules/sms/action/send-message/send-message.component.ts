import {
  CoreEnumService,
  FormInfoModel,
  ErrorExceptionResult,
  SmsApiSendMessageDtoModel,
  SmsApiSendResultModel,
  SmsMainApiPathService,
  SmsMainApiPathModel,
  SmsMainApiNumberModel,
  SmsMainMessageCategoryModel,
  SmsMainMessageContentModel,
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
export class DateByClock {
  date: Date;
  clock: string;
}

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
    if (this.requestLinkApiPathId?.length > 0) {
      this.dataModel.linkApiPathId = this.requestLinkApiPathId;
    }


  }

  @ViewChild('vform', { static: false }) formGroup: FormGroup;


  loading = new ProgressSpinnerModel();
  loadingAction = new ProgressSpinnerModel();
  dataModelParentSelected: SmsMainApiPathModel = new SmsMainApiPathModel();
  dataModel: SmsApiSendMessageDtoModel = new SmsApiSendMessageDtoModel();
  dataModelResult: ErrorExceptionResult<SmsApiSendResultModel> = new ErrorExceptionResult<SmsApiSendResultModel>();
  dataModelDateByClock: DateByClock = new DateByClock();
  formInfo: FormInfoModel = new FormInfoModel();
  clipboardText = '';

  ngOnInit(): void {
    //this.readClipboardFromDevTools().then((r) => this.clipboardText = r as string);
    this.onActionScheduleSendNow();
  }
  onActionScheduleSendNow() {
    const now = new Date();
    this.dataModel.scheduleSend = now;
    this.dataModelDateByClock.clock = now.getHours() + ':' + now.getMinutes();
    this.dataModelDateByClock.date = now;
  }
  onActionScheduleSendCheck() {
    const now = new Date();
    if (!this.dataModelDateByClock.clock)
      this.dataModelDateByClock.clock = now.getHours() + ':' + now.getMinutes();
    if (!this.dataModelDateByClock.date)
      this.dataModelDateByClock.date = now;
    this.dataModelDateByClock.date =new Date( this.dataModelDateByClock.date);
    this.dataModelDateByClock.date.setHours(+this.dataModelDateByClock.clock.split(':')[0] | 0,+this.dataModelDateByClock.clock.split(':')[1] | 0)
    
    this.dataModel.scheduleSend = this.dataModelDateByClock.date;
  }
  readClipboardFromDevTools() {
    return new Promise((resolve, reject) => {
      const _asyncCopyFn = (async () => {
        try {
          const value = await navigator.clipboard.readText();
          //console.log(`${value} is read!`);
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
  dataMessageCategoryModel: SmsMainMessageCategoryModel = new SmsMainMessageCategoryModel();
  onActionSelectMessageCategory(model: SmsMainMessageCategoryModel): void {
    if (model && model.id.length > 0) {
      this.dataMessageCategoryModel = model;
    }
    else {
      this.dataMessageCategoryModel = new SmsMainMessageCategoryModel();
    }
  }
  dataMessageContentModel: SmsMainMessageContentModel = new SmsMainMessageContentModel();
  onActionSelectMessageContent(model: SmsMainMessageContentModel): void {
    if (model && model.id.length > 0) {
      this.dataMessageContentModel = model;
    }
    else {
      this.dataMessageContentModel = new SmsMainMessageContentModel();
    }
  }


  onActionSelectApiNumber(model: SmsMainApiNumberModel): void {
    if (model && model.id.length > 0) {
      this.dataModel.linkFromNumber = model.id;
    }
  }
  onActionMessageContentAdd() {
    if (this.dataMessageContentModel?.messageBody?.length > 0) {
      if (this.dataModel.message.length > 0)
        this.dataModel.message = this.dataModel.message + ' ' + this.dataMessageContentModel.messageBody
    }
    else {
      this.dataModel.message = this.dataMessageContentModel.messageBody
    }
  }
  onActionMessageContentNew() {
    if (this.dataMessageContentModel?.messageBody?.length > 0) {
      this.dataModel.message = this.dataMessageContentModel.messageBody
    }
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (!this.dataModel.linkApiPathId || this.dataModel.linkApiPathId.length <= 0) {
      this.cmsToastrService.typeErrorFormInvalid();
    }
    this.onActionScheduleSendCheck();

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
  onActionContactCategorySelectChecked(model: string): void {
    if (!model || model.length <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    if (!this.dataModel.toContactCategories)
      this.dataModel.toContactCategories = [];
    if (!this.dataModel.toContactContents)
      this.dataModel.toContactContents = [];
    this.publicHelper.listAddIfNotExist(this.dataModel.toContactCategories, model, 0);
    if (this.dataModel.toContactCategories.length > 0 || this.dataModel.toContactContents.length > 0) {
      this.dataModel.toNumbers = '';
    }
  }
  onActionContactCategorySelectDisChecked(model: string): void {
    if (!model || model.length <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    if (!this.dataModel.toContactCategories)
      this.dataModel.toContactCategories = [];
    if (!this.dataModel.toContactContents)
      this.dataModel.toContactContents = [];
    this.publicHelper.listRemoveIfExist(this.dataModel.toContactCategories, model);
    if (this.dataModel.toContactCategories.length > 0 || this.dataModel.toContactContents.length > 0) {
      this.dataModel.toNumbers = '';
    }
  }
}
