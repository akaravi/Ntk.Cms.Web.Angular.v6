//**msh */
import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreSiteCategoryService,
  CoreSiteCategoryModel,
  DataFieldInfoModel,
  CoreModuleModel,
  CoreSiteCategoryCmsModuleService,
  CoreSiteCategoryCmsModuleModel,
  FilterModel,
  FilterDataModel,
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
  selector: 'app-core-sitecategory-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class CoreSiteCategoryEditComponent implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreSiteCategoryEditComponent>,
    public coreEnumService: CoreEnumService,
    public coreSiteCategoryService: CoreSiteCategoryService,
    public coreSiteCategoryCmsModuleService: CoreSiteCategoryCmsModuleService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestId = +data.id || 0;
    }

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreSiteCategoryModel> = new ErrorExceptionResult<CoreSiteCategoryModel>();
  dataModel: CoreSiteCategoryModel = new CoreSiteCategoryModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();

  fileManagerOpenForm = false;

  dataCoreCpMainMenuModel: CoreModuleModel[];
  dataCoreCpMainMenuIds: number[] = [];
  dataCoreSiteCategoryCmsModuleModel: CoreSiteCategoryCmsModuleModel[];
  ngOnInit(): void {
    if (this.requestId > 0) {
      this.formInfo.FormTitle = 'ویرایش  ';

    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();
    this.DataGetAllSiteCategoryCmsModule();
    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  DataGetOneContent(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.FormAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.coreSiteCategoryService.setAccessLoad();
    this.coreSiteCategoryService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);

        this.dataModel = ret.Item;
        if (ret.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + ret.Item.Title;
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
  DataGetAllSiteCategoryCmsModule(): void {

    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.FormAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    const filteModelContent = new FilterModel();
    const filter = new FilterDataModel();
    filter.PropertyName = 'LinkCmsSiteCategoryId';
    filter.Value = this.requestId;
    filteModelContent.Filters.push(filter);

    this.coreSiteCategoryCmsModuleService.ServiceGetAll(filteModelContent).subscribe({
      next: (ret) => {
        this.dataCoreSiteCategoryCmsModuleModel = ret.ListItems;
        const listG: number[] = [];
        this.dataCoreSiteCategoryCmsModuleModel.forEach(element => {
          listG.push(element.LinkCmsModuleId);
        });
        this.dataCoreCpMainMenuIds = listG;
        if (ret.IsSuccess) {
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

    this.coreSiteCategoryService.ServiceEdit(this.dataModel).subscribe({
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
  onActionSelectorUserCategorySelect(model: CoreModuleModel[]): void {
    this.dataCoreCpMainMenuModel = model;
  }
  onActionSelectorUserCategorySelectAdded(model: CoreModuleModel): void {
    const entity = new CoreSiteCategoryCmsModuleModel();
    entity.LinkCmsModuleId = model.Id;
    entity.LinkCmsSiteCategoryId = this.dataModel.Id;

    this.coreSiteCategoryCmsModuleService.ServiceAdd(entity).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_in_this_group_was_successful');
          this.cmsToastrService.typeSuccessEdit();
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = ret.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }

      },
      error: (er) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(er);
      }
    }
    );
  }
  onActionSelectorUserCategorySelectRemoved(model: CoreModuleModel): void {
    const entity = new CoreSiteCategoryCmsModuleModel();
    entity.LinkCmsModuleId = model.Id;
    entity.LinkCmsSiteCategoryId = this.dataModel.Id;

    this.coreSiteCategoryCmsModuleService.ServiceDeleteEntity(entity).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.formInfo.FormAlert = 'حذف از این گروه با موفقیت انجام شد';
          this.cmsToastrService.typeSuccessEdit();
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = ret.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
      },
      error: (er) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(er);
      }
    }
    );
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
