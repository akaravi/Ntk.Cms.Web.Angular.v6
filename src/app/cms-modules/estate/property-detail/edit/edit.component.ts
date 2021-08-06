import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  EstatePropertyDetailService,
  EstatePropertyDetailModel,
  DataFieldInfoModel,
  CoreLocationModel,
  EstatePropertyTypeLanduseModel,
  EstatePropertyDetailGroupModel,
  EstateEnumService,
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
  selector: 'app-ticketing-departemen-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EstatePropertyDetailEditComponent implements OnInit {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<EstatePropertyDetailEditComponent>,
    public coreEnumService: CoreEnumService,
    public estatePropertyDetailService: EstatePropertyDetailService,
    private estateEnumService: EstateEnumService,
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
  dataModelResult: ErrorExceptionResult<EstatePropertyDetailModel> = new ErrorExceptionResult<EstatePropertyDetailModel>();
  dataModel: EstatePropertyDetailModel = new EstatePropertyDetailModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelEnumInputDataTypeResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  keywordDataModel = [];

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
    this.getEnumInputDataType();
  }
  getEnumInputDataType(): void {
    this.estateEnumService.ServiceEnumInputDataType().subscribe((next) => {
      this.dataModelEnumInputDataTypeResult = next;
    });
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult=await this.publicHelper.getEnumRecordStatus();
  }

  DataGetOneContent(): void {

    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.Start('main');
    this.cdr.detectChanges();
    this.estatePropertyDetailService.setAccessLoad();
    this.estatePropertyDetailService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        this.dataModel = next.Item;
        if (next.IsSuccess) {
          this.dataModel.ConfigValueDefaultValueJson = this.dataModel.ConfigValueDefaultValueJson + '';
          this.keywordDataModel = this.dataModel.ConfigValueDefaultValueJson.split(',');
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
  DataEditContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    this.loading.Start('main');
    this.cdr.detectChanges();
    this.estatePropertyDetailService.ServiceEdit(this.dataModel).subscribe(
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
  onActionSelectorSelect(model: EstatePropertyTypeLanduseModel | null): void {
    if (!model || !model.Id || model.Id.length <= 0) {
      const message = 'دسته بندی اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkPropertyTypeLanduseId = model.Id;
  }
  onActionSelectorDetailGroup(model: EstatePropertyDetailGroupModel | null): void {
    if (!model || !model.Id || model.Id.length <= 0) {
      const message = 'دسته بندی اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkPropertyDetailGroupId = model.Id;
  }
  onIconPickerSelect(model: any): void {
    this.dataModel.IconFont = model;
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.dataModel.ConfigValueDefaultValueJson = '';
    if (this.keywordDataModel && this.keywordDataModel.length > 0) {
      const listKeyword = [];
      this.keywordDataModel.forEach(element => {
        if (element.display) {
          listKeyword.push(element.display);
        } else {
          listKeyword.push(element);
        }
      });
      if (listKeyword && listKeyword.length > 0) {
        this.dataModel.ConfigValueDefaultValueJson = listKeyword.join(',');
      }
    }
    this.formInfo.FormSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
