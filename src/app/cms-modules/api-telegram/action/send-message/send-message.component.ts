//**msh */
import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  ApiTelegramBotConfigService,
  ApiTelegramBotConfigModel,
  DataFieldInfoModel,
  ErrorExceptionResultBase,
  ApiTelegramSendMessageTodoModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { TreeModel } from 'src/filemanager-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';
export class CompModel {
  ChatIds: string;
}
@Component({
  selector: 'app-apitelegram-action-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss'],
})
export class ApiTelegramActionSendMessageComponent implements OnInit {
  requestLinkBotConfigId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ApiTelegramActionSendMessageComponent>,
    public coreEnumService: CoreEnumService,
    public apiTelegramBotConfigService: ApiTelegramBotConfigService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  compModel: CompModel = new CompModel();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: ApiTelegramSendMessageTodoModel = new ApiTelegramSendMessageTodoModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  fileManagerOpenForm = false;


  ngOnInit(): void {
    if (this.data) {
      this.requestLinkBotConfigId = +this.data.LinkBotConfigId || 0;
      this.compModel.ChatIds = this.data.ChatId + '';
    }
    if (this.requestLinkBotConfigId > 0) {
      this.dataModel.BotId = this.requestLinkBotConfigId;
    }
    this.formInfo.FormTitle = 'ارسال پیام  ';
    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  ActionSendMessage(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.apiTelegramBotConfigService.ServiceSendMessage(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.FormSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.IsSuccess) {
          this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = ret.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }}
    );
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.dataModel.chatId = [];
    if (this.compModel.ChatIds && this.compModel.ChatIds.length > 0) {
      let listChatId = this.publicHelper.SplitAllChar(this.compModel.ChatIds);
      listChatId.forEach(element => {
        let id = +element || 0;
        if (id > 0) {
          this.dataModel.chatId.push(id);
        }
      });
    }
    if (this.dataModel.chatId.length == 0) {
      this.cmsToastrService.typeWarning('لیست گیرنده  معتبر نمی باشد');
      return;
    }
    this.formInfo.FormSubmitAllow = false;
    this.ActionSendMessage();
  }

  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onActionSelectorSelect(model: ApiTelegramBotConfigModel | null): void {
    if (!model || model.Id <= 0) {
      const message = 'ربات تلگرام را انتخاب کنید';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.BotId = model.Id;
  }
}
