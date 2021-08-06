import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  EstatePropertyTypeLanduseService,
  EstatePropertyTypeLanduseModel,
  DataFieldInfoModel,
  CoreLocationModel,
  EstatePropertyTypeUsageService,
  FilterModel,
  FilterDataModel,
  EstatePropertyTypeService,
  EstatePropertyTypeModel,
  EstatePropertyTypeUsageModel,
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
import {
  TreeModel,
  NodeInterface,
} from 'ntk-cms-filemanager';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-estate-propertytypelanduse-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EstatePropertyTypeLanduseEditComponent implements OnInit {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<EstatePropertyTypeLanduseEditComponent>,
    public coreEnumService: CoreEnumService,
    public estatePropertyTypeLanduseService: EstatePropertyTypeLanduseService,
    public estatePropertyTypeService: EstatePropertyTypeService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private translate: TranslateService,
  ) {
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
  dataModelResult: ErrorExceptionResult<EstatePropertyTypeLanduseModel> = new ErrorExceptionResult<EstatePropertyTypeLanduseModel>();
  dataModel: EstatePropertyTypeLanduseModel = new EstatePropertyTypeLanduseModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  fileManagerOpenForm = false;
  
  dataEstatePropertyTypeUsageModel: EstatePropertyTypeUsageModel[];
  dataEstatePropertyTypeUsageIds: string[] = [];
  dataEstatePropertyTypeModel: EstatePropertyTypeModel[];

  ngOnInit(): void {
    this.formInfo.FormTitle = 'ویرایش  ';
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();
    this.getEnumRecordStatus();
    this.DataGetAllEstateProprtyUsage();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult=await this.publicHelper.getEnumRecordStatus();
  }
  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id ;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }
  DataGetOneContent(): void {

    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.Start('main');
    this.cdr.detectChanges();
    this.estatePropertyTypeLanduseService.setAccessLoad();
    this.estatePropertyTypeLanduseService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        this.dataModel = next.Item;
        if (next.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.Title;
          this.formInfo.FormAlert = '';
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop('main');
    this.cdr.detectChanges();
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop('main');
    this.cdr.detectChanges();
      }
    );
  }
  DataGetAllEstateProprtyUsage(): void {
    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.Start('main');
    this.cdr.detectChanges();
    const filteModelContent = new FilterModel();
    const filter = new FilterDataModel();
    filter.PropertyName = 'LinkPropertyTypeLanduseId';
    filter.Value = this.requestId;
    filteModelContent.Filters.push(filter);

    this.estatePropertyTypeService.ServiceGetAll(filteModelContent).subscribe(
      (next) => {
         this.dataEstatePropertyTypeModel = next.ListItems;
        const listG: string[] = [];
        this.dataEstatePropertyTypeModel.forEach(element => {
          listG.push(element.LinkPropertyTypeUsageId);
        });
        this.dataEstatePropertyTypeUsageIds = listG;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = '';
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop('main');
    this.cdr.detectChanges();
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop('main');
    this.cdr.detectChanges();
      }
    );
  }
  DataEditContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    this.loading.Start('main');
    this.cdr.detectChanges();
    this.estatePropertyTypeLanduseService.ServiceEdit(this.dataModel).subscribe(
      (next) => {
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert =  this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop('main');
    this.cdr.detectChanges();
        this.formInfo.FormSubmitAllow = true;
      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop('main');
    this.cdr.detectChanges();
      }
    );
  }
  onActionSelectorUserCategorySelect(model: EstatePropertyTypeUsageModel[]): void {
    this.dataEstatePropertyTypeUsageModel = model;
  }
  onActionSelectorUserCategorySelectAdded(model: EstatePropertyTypeUsageModel): void {
    const entity = new EstatePropertyTypeModel();
    entity.LinkPropertyTypeUsageId = model.Id;
    entity.LinkPropertyTypeLanduseId = this.dataModel.Id;

    this.estatePropertyTypeService.ServiceAdd(entity).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'ثبت در این گروه با موفقیت انجام شد';
          this.cmsToastrService.typeSuccessEdit();
          // this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }

      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);

      }
    );
  }
  onActionSelectorUserCategorySelectRemoved(model: EstatePropertyTypeUsageModel): void {
    const entity = new EstatePropertyTypeModel();
    entity.LinkPropertyTypeUsageId = model.Id;
    entity.LinkPropertyTypeLanduseId = this.dataModel.Id;

    this.estatePropertyTypeService.ServiceDeleteEntity(entity).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'حذف از این گروه با موفقیت انجام شد';
          this.cmsToastrService.typeSuccessEdit();
          // this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);
      }
    );
  }
  onIconPickerSelect(model: any): void {
    this.dataModel.IconFont = model;
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
