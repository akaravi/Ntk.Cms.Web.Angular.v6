//**msh */
import {
  SmsEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  SmsMainCustomerCreditModel,
  SmsMainCustomerCreditService,
  DataFieldInfoModel,
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

@Component({
  selector: 'app-sms-customercredit-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class SmsMainCustomerCreditAddComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SmsMainCustomerCreditAddComponent>,
    public smsEnumService: SmsEnumService,
    public SmsMainCustomerCreditService: SmsMainCustomerCreditService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<SmsMainCustomerCreditModel> = new ErrorExceptionResult<SmsMainCustomerCreditModel>();
  dataModel: SmsMainCustomerCreditModel = new SmsMainCustomerCreditModel();


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
    this.SmsMainCustomerCreditService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.IsSuccess) {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.ErrorMessage);
          }
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
        }
      }
      );
  }
  DataAddContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.SmsMainCustomerCreditService.ServiceAdd(this.dataModel).subscribe({
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
      error: (er)  => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
      }
    );
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
