//**msh */
import {
  SmsEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  DataFieldInfoModel,
  SmsMainApiPathPriceServiceService,
  SmsMainApiPathPriceServiceModel,
  CoreUserModel,
  SmsMainApiPathModel,
  CoreSiteCategoryModel,
  CoreSiteModel,
  CoreUserGroupModel,
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
import { TreeModel } from 'src/filemanager-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sms-apipathpriceservice-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class SmsMainApiPathPriceServiceEditComponent implements OnInit {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SmsMainApiPathPriceServiceEditComponent>,
    public smsEnumService: SmsEnumService,
    public smsMainApiPathPriceServiceService: SmsMainApiPathPriceServiceService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data && data.id) {
      this.requestId = data.id;
    }

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<SmsMainApiPathPriceServiceModel> = new ErrorExceptionResult<SmsMainApiPathPriceServiceModel>();
  dataModel: SmsMainApiPathPriceServiceModel = new SmsMainApiPathPriceServiceModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelSmsMessageTypeEnumResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelSmsOutBoxTypeEnumResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();

  fileManagerOpenForm = false;
  dataSmsMainApiPathPriceServiceModel: SmsMainApiPathPriceServiceModel[];
  ngOnInit(): void {
    if (this.requestId.length > 0) {
      this.formInfo.FormTitle = 'ویرایش  ';

    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();
    this.getEnumRecordStatus();
    this.getSmsMessageTypeEnum();
    this.getSmsOutBoxTypeEnum();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  getSmsMessageTypeEnum(): void {
    this.smsEnumService.ServiceSmsMessageTypeEnum().subscribe((res) => {
      this.dataModelSmsMessageTypeEnumResult = res;
    });
  }
  getSmsOutBoxTypeEnum(): void {
    this.smsEnumService.ServiceSmsOutBoxTypeEnum().subscribe((res) => {
      this.dataModelSmsOutBoxTypeEnumResult = res;
    });
  }
  DataGetOneContent(): void {
    if (this.requestId.length <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.FormAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.smsMainApiPathPriceServiceService.setAccessLoad();
    this.smsMainApiPathPriceServiceService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);

        this.dataModel = ret.Item;
        if (ret.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle;
          this.formInfo.FormAlert = '';
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = ret.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }

  DataEditContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.sending_information_to_the_server'));

    this.smsMainApiPathPriceServiceService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.FormSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.IsSuccess) {
          this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
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
      }
    }
    );
  }
  onActionSelectorCmsUser(model: CoreUserModel | null): void {
    if (!model || !model.Id || model.Id <= 0) {
      this.dataModel.LinkCoreUserId = null;
      return;
    }
    this.dataModel.LinkCoreUserId = model.Id;
  }
  onActionSelectorCmsSite(model: CoreSiteModel | null): void {
    if (!model || !model.Id || model.Id <= 0) {
      this.dataModel.LinkCoreSiteId = null;
      return;
    }
    this.dataModel.LinkCoreSiteId = model.Id;
  }
  onActionSelectorCoreUserGroup(model: CoreUserGroupModel | null): void {
    if (!model || !model.Id || model.Id <= 0) {
      this.dataModel.LinkCoreUserGroupId = null;
      return;
    }
    this.dataModel.LinkCoreUserGroupId = model.Id;
  }
  onActionSelectorCoreSiteCategory(model: CoreSiteCategoryModel | null): void {
    if (!model || !model.Id || model.Id <= 0) {
      this.dataModel.LinkCoreSiteCategoryId = null;
      return;
    }
    this.dataModel.LinkCoreSiteCategoryId = model.Id;
  }
  onActionSelectorSelectLinkApiPathId(model: SmsMainApiPathModel | null): void {
    if (!model || model.Id.length <= 0) {
      const message = 'مسیر سرویس دهنده مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkApiPathId = model.Id;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
