//**msh */
import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  EstateAccountAgencyTypeUserService,
  EstateAccountAgencyTypeUserModel,
  DataFieldInfoModel,
  EstateEnumService,
  EstateAccountUserModel,
  EstateAccountAgencyModel,
  EstatePropertyModel,
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
  selector: 'app-estate-accountagencytypeuser-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EstateAccountAgencyTypeUserEditComponent implements OnInit {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstateAccountAgencyTypeUserEditComponent>,
    public coreEnumService: CoreEnumService,
    public estateEnumService: EstateEnumService,
    public estateAccountAgencyTypeUserService: EstateAccountAgencyTypeUserService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
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
  dataModelResult: ErrorExceptionResult<EstateAccountAgencyTypeUserModel> = new ErrorExceptionResult<EstateAccountAgencyTypeUserModel>();
  dataModel: EstateAccountAgencyTypeUserModel = new EstateAccountAgencyTypeUserModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumEstateUserTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();

  fileManagerOpenForm = false;

  ngOnInit(): void {
    this.formInfo.FormTitle = 'ویرایش  ';
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();
    this.getEnumRecordStatus();
    this.getEnumEstateUserType();

  }
  getEnumEstateUserType(): void {
    this.estateEnumService.ServiceEnumEstateUserType().subscribe((next) => {
      this.dataModelEnumEstateUserTypeResult = next;
    });
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetOneContent(): void {

    this.formInfo.FormAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.estateAccountAgencyTypeUserService.setAccessLoad();
    this.estateAccountAgencyTypeUserService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);

        this.dataModel = ret.Item;
        if (ret.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + ret.Item.Id;
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

    this.estateAccountAgencyTypeUserService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
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

        this.formInfo.FormSubmitAllow = true;
      },
      error: (er) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }
  onActionSelectorAccountUser(model: EstateAccountUserModel | null): void {
    this.dataModel.LinkAccountUserId = null;
    if (model && model.Id.length > 0) {
      this.dataModel.LinkAccountUserId = model.Id;
    }
  }
  onActionSelectorAccountAgency(model: EstateAccountAgencyModel | null): void {
    this.dataModel.LinkAccountAgencyId = null;
    if (model && model.Id.length > 0) {
      this.dataModel.LinkAccountAgencyId = model.Id;
    }
  }
  onActionSelectorProperty(model: EstatePropertyModel | null): void {
    this.dataModel.LinkPropertyId = null;
    if (model && model.Id.length > 0) {
      this.dataModel.LinkPropertyId = model.Id;
    }
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
