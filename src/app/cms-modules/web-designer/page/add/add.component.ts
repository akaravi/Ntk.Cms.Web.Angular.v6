import {
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  WebDesignerMainPageService,
  WebDesignerMainPageModel,
  DataFieldInfoModel,
  WebDesignerEnumService,
  WebDesignerMainPageDependencyModel,
  WebDesignerMainPageTemplateModel,
  CoreSiteCategoryModel,
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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
@Component({
  selector: 'app-webdesigner-page-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class WebDesignerMainPageAddComponent implements OnInit {
  requestLinkPageDependencyGuId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<WebDesignerMainPageAddComponent>,
    public webDesignerEnumService: WebDesignerEnumService,
    public webDesignerMainPageService: WebDesignerMainPageService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestLinkPageDependencyGuId = data.linkPageDependencyGuId + '';
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    if (this.requestLinkPageDependencyGuId.length > 0) {
      this.dataModel.linkPageDependencyGuId = this.requestLinkPageDependencyGuId;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  keywordDataModel = [];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<WebDesignerMainPageModel> = new ErrorExceptionResult<WebDesignerMainPageModel>();
  dataModel: WebDesignerMainPageModel = new WebDesignerMainPageModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumPageAbilityTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  fileManagerOpenForm = false;
  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.ADD');
    this.getEnumRecordStatus();
    this.DataGetAccess();
    this.getEnumPageAbilityType();
  }
  getEnumPageAbilityType(): void {
    this.webDesignerEnumService.ServiceEnumPageAbilityType().subscribe((next) => {
      this.dataModelEnumPageAbilityTypeResult = next;
    });
  }
  DataGetAccess(): void {
    this.webDesignerMainPageService
      .ServiceViewModel()
      .subscribe(
        async (next) => {
          if (next.isSuccess) {
            // this.dataAccessModel = next.access;
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(next.errorMessage);
          }
        },
        (error) => {
          this.cmsToastrService.typeErrorGetAccess(error);
        }
      );
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  DataAddContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'webDesignerMainPageService.ServiceAdd';
    this.loading.Start(pName);
    this.webDesignerMainPageService.ServiceAdd(this.dataModel).subscribe(
      (next) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = next;
        if (next.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = next.errorMessage;
          this.cmsToastrService.typeErrorMessage(next.errorMessage);
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
  }
  onActionSelectDependency(model: WebDesignerMainPageDependencyModel | null): void {
    if (!model || model.id?.length <= 0) {
      this.cmsToastrService.typeErrorMessage(
        'محل نمایش را مشخص کنید',
        'صفحه نمایش  اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.linkPageDependencyGuId = model.id;
  }
  onActionSelectTemplate(model: WebDesignerMainPageTemplateModel | null): void {
    if (!model || model.id?.length <= 0) {
      this.cmsToastrService.typeErrorMessage(
        'قالب را مشخص کنید',
        'قالب صفحه مشخص نیست'
      );
      return;
    }
    this.dataModel.linkPageTemplateGuId = model.id;
  }
  onActionSelectParent(model: WebDesignerMainPageModel): void {
    this.dataModel.linkPageParentGuId = '';
    if (model && model.id && model.id.length > 0) {
      this.dataModel.linkPageParentGuId = model.id;
    }
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.dataModel.keyword = '';
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
        this.dataModel.keyword = listKeyword.join(',');
      }
    }
    this.DataAddContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onActionSelectCategory(model: CoreSiteCategoryModel | null): void {
    if (!model || model.id <= 0) {
      const message = 'دسته بندی سایت مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.pageDependencyIsDefaultPageLinkSiteCategoryId = model.id;
  }
  
		
		 /**
   * tag
   */
      addOnBlurTag = true;
      readonly separatorKeysCodes = [ENTER, COMMA] as const;
      addTag(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        // Add our item
        if (value) {
          this.keywordDataModel.push( value);
        }
        // Clear the input value
        event.chipInput!.clear();
      }
    
      removeTag(item: string): void {
        const index = this.keywordDataModel.indexOf(item);
    
        if (index >= 0) {
          this.keywordDataModel.splice(index, 1);
        }
      }
      /**
       * tag
       */
}