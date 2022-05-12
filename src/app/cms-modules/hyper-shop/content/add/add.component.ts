import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  HyperShopContentModel,
  HyperShopContentService,
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  HyperShopCategoryModel,
  DataFieldInfoModel,
} from 'ntk-cms-api';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TreeModel } from 'src/filemanager-api';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-ticketing-faq-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class HyperShopContentAddComponent implements OnInit {
  requestParentId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<HyperShopContentAddComponent>,
    public coreEnumService: CoreEnumService,
    public hyperShopContentService: HyperShopContentService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    if (data) {
      this.requestParentId = data.parentId + '';
    }
    if (this.requestParentId.length > 0) {
      this.dataModel.CategoryCode = this.requestParentId;
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  formMatcher = new CmsFormsErrorStateMatcher();
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<HyperShopContentModel> = new ErrorExceptionResult<HyperShopContentModel>();
  dataModel: HyperShopContentModel = new HyperShopContentModel();
  dataFileModel = new Map<number, string>();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  fileManagerOpenForm = false;


  ngOnInit(): void {

    this.formInfo.FormTitle = 'ثبت محتوای جدید';
    this.getEnumRecordStatus();
    this.DataGetAccess();

  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetAccess(): void {
    this.hyperShopContentService
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


    this.hyperShopContentService.ServiceAdd(this.dataModel).subscribe(
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
  onActionSelectorSelect(model: HyperShopCategoryModel | null): void {
    if (!model || !model.Code || model.Code.length <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.CategoryCode = model.Code;
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
