import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreSiteCategoryCmsModuleModel,
  CoreSiteCategoryCmsModuleService,
  CoreModuleModel,
  AccessModel,
  DataFieldInfoModel,
  CoreSiteCategoryModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-core-sitecategorycmsmodule-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class CoreSiteCategoryCmsModuleAddComponent implements OnInit {
  requestLinkCmsModuleId = 0;
  requestLinkCmsSiteCategoryId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<CoreSiteCategoryCmsModuleAddComponent>,
    public coreEnumService: CoreEnumService,
    public coreSiteCategoryCmsModuleService: CoreSiteCategoryCmsModuleService,
    private cmsToastrService: CmsToastrService,
    private publicHelper: PublicHelper,
    private translate: TranslateService,
  ) {
    if (data) {
      this.requestLinkCmsSiteCategoryId = +data.LinkCmsSiteCategoryId || 0;
      this.requestLinkCmsModuleId = +data.LinkCmsModuleId || 0;
    }

    if (this.requestLinkCmsSiteCategoryId > 0) {
      this.dataModel.LinkCmsSiteCategoryId = this.requestLinkCmsSiteCategoryId;
    }
    if (this.requestLinkCmsModuleId > 0) {
      this.dataModel.LinkCmsModuleId = this.requestLinkCmsModuleId;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  dataAccessModel: AccessModel;


  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreSiteCategoryCmsModuleModel> = new ErrorExceptionResult<CoreSiteCategoryCmsModuleModel>();
  dataModel: CoreSiteCategoryCmsModuleModel = new CoreSiteCategoryCmsModuleModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  fileManagerOpenForm = false;
  

  ngOnInit(): void {
    this.getEnumRecordStatus();
    this.DataGetAccess();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult=await this.publicHelper.getEnumRecordStatus();
  }

  DataGetAccess(): void {
    this.coreSiteCategoryCmsModuleService
      .ServiceViewModel()
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.dataAccessModel = next.Access;
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
    this.loading.Start("main");
    this.coreSiteCategoryCmsModuleService.ServiceAdd(this.dataModel).subscribe(
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
        this.loading.Stop("main");
      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop("main");
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
  onActionSiteCategorySelect(model: CoreSiteCategoryModel): void {
    this.dataModel.LinkCmsSiteCategoryId = null;
    if (model && model.Id > 0) {
      this.dataModel.LinkCmsSiteCategoryId = model.Id;
    }
  }
  onActionSelectorModuleSelect(model: CoreModuleModel): void {
    this.dataModel.LinkCmsModuleId = null;
    if (model && model.Id > 0) {
      this.dataModel.LinkCmsModuleId = model.Id;
    }
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
