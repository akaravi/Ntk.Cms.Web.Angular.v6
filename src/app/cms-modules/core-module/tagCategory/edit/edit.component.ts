import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreModuleTagCategoryService,
  CoreModuleTagCategoryModel,
  DataFieldInfoModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ComponentActionEnum } from 'src/app/core/models/component-action-enum';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import {
  TreeModel,
  NodeInterface,
} from 'ntk-cms-filemanager';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tag-category-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class CoreModuleTagCategoryEditComponent implements OnInit {
  requestId = 0;
  requestParentId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<CoreModuleTagCategoryEditComponent>,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public coreModuleTagCategoryService: CoreModuleTagCategoryService,
    private cmsToastrService: CmsToastrService,
    private translate: TranslateService,

  ) {
    if (data) {
      this.requestId = +data.id || 0;
      this.requestParentId = +data.parentId || 0;
    }
    if (this.requestParentId > 0) {
       this.dataModel.LinkParentId = this.requestParentId;
    }

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreModuleTagCategoryModel> = new ErrorExceptionResult<CoreModuleTagCategoryModel>();
  dataModel: CoreModuleTagCategoryModel = new CoreModuleTagCategoryModel();

  ComponentAction = ComponentActionEnum.none;

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  fileManagerOpenForm = false;

  
  onActionFileSelected(model: NodeInterface): void {
    // this.dataModel.LinkMainImageId = model.id;
    // this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }

  ngOnInit(): void {
    if (this.requestId > 0) {
      this.ComponentAction = ComponentActionEnum.edit;
      this.formInfo.FormTitle = 'ویرایش  دسته بندی';
      this.DataGetOneContent();
    } else if (this.requestId === 0) {
      this.ComponentAction = ComponentActionEnum.add;
      this.formInfo.FormTitle = 'ثبت دسته بندی جدید';
    }

    if (this.ComponentAction === ComponentActionEnum.none) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult=await this.publicHelper.getEnumRecordStatus();
  }

  DataGetOneContent(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.Start("main");
    this.coreModuleTagCategoryService.setAccessLoad();
    this.coreModuleTagCategoryService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        this.dataModel = next.Item;
        if (next.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.Title;
          this.formInfo.FormAlert = '';
              } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage( next.ErrorMessage);
        }
        this.loading.Stop("main");
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop("main");
      }
    );
  }
  DataAddContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    this.loading.Start("main");

    this.coreModuleTagCategoryService.ServiceAdd(this.dataModel).subscribe(
      (next) => {
        this.formInfo.FormSubmitAllow = true;
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert =  this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });
              } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage( next.ErrorMessage);
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
  DataEditContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    this.loading.Start("main");
    this.coreModuleTagCategoryService.ServiceEdit(this.dataModel).subscribe(
      (next) => {
        this.formInfo.FormSubmitAllow = true;
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert =  this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });

              } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage( next.ErrorMessage);
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
  onActionSelectorSelect(model: CoreModuleTagCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      const message = 'دسته بندی اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkParentId = model.Id;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormSubmitAllow = false;
    if (this.ComponentAction === ComponentActionEnum.add) {
      this.DataAddContent();
    }
    if (this.ComponentAction === ComponentActionEnum.edit) {
      this.DataEditContent();
    }

  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
