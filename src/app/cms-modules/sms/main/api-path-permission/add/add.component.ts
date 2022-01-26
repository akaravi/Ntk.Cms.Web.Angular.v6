import {
  SmsEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  SmsMainApiPathPermissionService,
  SmsMainApiPathPermissionModel,
  DataFieldInfoModel,
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
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { NodeInterface, TreeModel } from 'src/filemanager-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sms-apipathpermission-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class SmsMainApiPathPermissionAddComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SmsMainApiPathPermissionAddComponent>,
    public smsEnumService: SmsEnumService,
    public smsMainApiPathPermissionService: SmsMainApiPathPermissionService,
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

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<SmsMainApiPathPermissionModel> = new ErrorExceptionResult<SmsMainApiPathPermissionModel>();
  dataModel: SmsMainApiPathPermissionModel = new SmsMainApiPathPermissionModel();


  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumApiPathPermissionAccessStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumApiPathPermissionActionResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();

  fileManagerOpenForm = false;




  ngOnInit(): void {
    this.formInfo.FormTitle = 'اضافه کردن  ';
    this.getEnumRecordStatus();
    this.getEnumApiPathPermissionAccessStatus();
    this.getEnumApiPathPermissionAction();
    this.DataGetAccess();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  getEnumApiPathPermissionAccessStatus(): void {
    this.smsEnumService.ServiceSmsApiPathPermissionAccessStatusEnum().subscribe((res) => {
      this.dataModelEnumApiPathPermissionAccessStatusResult = res;
    });
  }
  getEnumApiPathPermissionAction(): void {
    this.smsEnumService.ServiceSmsApiPathPermissionActionEnum().subscribe((res) => {
      this.dataModelEnumApiPathPermissionActionResult = res;
    });
  }

  DataGetAccess(): void {
    this.smsMainApiPathPermissionService
      .ServiceViewModel()
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            // this.dataAccessModel = next.Access;
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(next.ErrorMessage);
          }
        },
        (error) => {
          this.cmsToastrService.typeErrorGetAccess(error);
        }
      );
  }
  DataAddContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.smsMainApiPathPermissionService.ServiceAdd(this.dataModel).subscribe(
      (next) => {
        this.formInfo.FormSubmitAllow = true;
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });

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
    );
  }
  onActionSelectorCmsUser(model: CoreUserModel | null): void {
    if (!model || !model.Id || model.Id <= 0) {
      this.dataModel.LinkCoreUserId=null;
      return;
    }
    this.dataModel.LinkCoreUserId = model.Id;
  }
  onActionSelectorCmsSite(model: CoreSiteModel | null): void {
    if (!model || !model.Id || model.Id <= 0) {
      this.dataModel.LinkCoreSiteId=null;
      return;
    }
    this.dataModel.LinkCoreSiteId = model.Id;
  }
  onActionSelectorCoreUserGroup(model: CoreUserGroupModel | null): void {
    if (!model || !model.Id || model.Id <= 0) {
      this.dataModel.LinkCoreUserGroupId=null;
      return;
    }
    this.dataModel.LinkCoreUserGroupId = model.Id;
  }
  onActionSelectorCoreSiteCategory(model: CoreSiteCategoryModel | null): void {
    if (!model || !model.Id || model.Id <= 0) {
      this.dataModel.LinkCoreSiteCategoryId=null;
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

    this.DataAddContent();


  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
