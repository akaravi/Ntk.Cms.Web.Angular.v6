import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  LinkManagementBillboardPatternService,
  LinkManagementBillboardPatternModel,
  DataFieldInfoModel,
  LinkManagementEnumService,
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
  selector: 'app-linkmanagement-billboard-pattern-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class LinkManagementBillboardPatternEditComponent implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<LinkManagementBillboardPatternEditComponent>,
    public coreEnumService: CoreEnumService,
    public categoryService: LinkManagementBillboardPatternService,
    private linkManagementEnumService: LinkManagementEnumService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
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
  dataModelResult: ErrorExceptionResult<LinkManagementBillboardPatternModel> = new ErrorExceptionResult<LinkManagementBillboardPatternModel>();
  dataModel: LinkManagementBillboardPatternModel = new LinkManagementBillboardPatternModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumManagementContentSettingTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumSharingPriceTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();

  fileManagerOpenForm = false;


  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;

  }
  onActionFileSelectedLinkBackgroundId(model: NodeInterface): void {
    this.dataModel.LinkBackgroundId = model.id;
    this.dataModel.LinkBackgroundIdSrc = model.downloadLinksrc;

  }
  ngOnInit(): void {
    if (this.requestId > 0) {
      this.formInfo.FormTitle = 'ویرایش  دسته بندی';
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.getEnumRecordStatus();
    this.getEnumSharingPriceType();
    this.getEnumManagementContentSettingType();
  }
  getEnumManagementContentSettingType(): void {
    this.linkManagementEnumService.ServiceEnumManagementContentSettingType().subscribe((res) => {
      this.dataModelEnumManagementContentSettingTypeResult = res;
    });
  }
  getEnumSharingPriceType(): void {
    this.linkManagementEnumService.ServiceEnumSharingPriceType().subscribe((res) => {
      this.dataModelEnumSharingPriceTypeResult = res;
    });
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetOneContent(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.categoryService.setAccessLoad();
    this.categoryService.ServiceGetOneById(this.requestId).subscribe(
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
        this.loading.Stop(pName);

      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);

      }
    );
  }

  DataEditContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.categoryService.ServiceEdit(this.dataModel).subscribe(
      (next) => {
        this.formInfo.FormSubmitAllow = true;
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
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
