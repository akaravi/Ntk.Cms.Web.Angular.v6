
import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  EstateContractTypeService,
  EstateContractTypeModel,
  DataFieldInfoModel,
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
  selector: 'app-estate-contracttype-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class EstateContractTypeAddComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstateContractTypeAddComponent>,
    public coreEnumService: CoreEnumService,
    public estateContractTypeService: EstateContractTypeService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();

  }

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<EstateContractTypeModel> = new ErrorExceptionResult<EstateContractTypeModel>();
  dataModel: EstateContractTypeModel = new EstateContractTypeModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  fileManagerOpenForm = false;

  ngOnInit(): void {

    this.formInfo.formTitle = this.translate.instant('TITLE.ADD');
    this.getEnumRecordStatus();
    this.DataGetAccess();

  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetAccess(): void {
    this.estateContractTypeService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.errorMessage);
          }
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
        }
      }
      );
  }
  DataAddContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.estateContractTypeService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

        this.formInfo.formSubmitAllow = true;
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
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
    this.formInfo.formSubmitAllow = false;
    this.DataAddContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
