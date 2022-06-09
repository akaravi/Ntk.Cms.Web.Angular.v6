//**msh */
import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  EstateBillboardService,
  EstateBillboardModel,
  DataFieldInfoModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { NodeInterface, TreeModel } from 'src/filemanager-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { EstatePropertyListComponent } from '../../property/list/list.component';

@Component({
  selector: 'app-estate-billboard-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class EstateBillboardAddComponent implements OnInit {
  constructor(
    private router: Router,
    public coreEnumService: CoreEnumService,
    public estateBillboardService: EstateBillboardService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();

  }

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  @ViewChild(EstatePropertyListComponent) estatePropertyList: EstatePropertyListComponent;

  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  optionloadComponent = false;

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<EstateBillboardModel> = new ErrorExceptionResult<EstateBillboardModel>();
  dataModel: EstateBillboardModel = new EstateBillboardModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  fileManagerOpenForm = false;
  ngOnInit(): void {

    this.formInfo.formTitle = 'اضافه کردن  ';
    this.getEnumRecordStatus();
    this.DataGetAccess();

  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetAccess(): void {
    this.estateBillboardService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            // this.dataAccessModel = next.access;
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

    this.estateBillboardService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.DataGetOneContent();
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.optionReload();
        } else {
          this.formInfo.formAlert = 'برروز خطا';
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
  DataGetOneContent(): void {

    this.formInfo.formAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.estateBillboardService.setAccessLoad();
    this.estateBillboardService.ServiceGetOneById(this.dataModelResult.item.id).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.title;
          this.formInfo.formAlert = '';
        } else {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
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
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.estateBillboardService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
          this.optionReload();
        } else {
          this.formInfo.formAlert = 'برروز خطا';
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
  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;

  }
  onActionSelectorSelectUsage(model: string[] | null): void {

    this.dataModel.linkPropertyTypeUsageIds = model;
  }
  onActionSelectorContarctType(model: string[] | null): void {

    this.dataModel.linkContractTypeIds = model;
  }
  onActionSelectorSelectLanduse(model: string[] | null): void {

    this.dataModel.linkPropertyTypeLanduseIds = model;
  }
  onActionSelectorLocation(model: number[] | null): void {

    this.dataModel.linkLocationIds = model;
  }
  onActionSelectorProperty(model: string[] | null): void {
    this.dataModel.linkPropertyIds = model;
    if (this.dataModel.linkPropertyIds && this.dataModel.linkPropertyIds.length > 0) {
      this.LinkPropertyIdsInUse = true;
      this.dataModel.linkPropertyTypeUsageIds = null;
      this.dataModel.linkContractTypeIds = null;
      this.dataModel.linkPropertyTypeLanduseIds = null;
      this.dataModel.linkLocationIds = null;
    }
    else {
      this.LinkPropertyIdsInUse = false;
    }
  }
  LinkPropertyIdsInUse = false;

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;

    if (this.dataModel.id && this.dataModel.id.length > 0) {
      this.DataEditContent();
    }
    else {
      this.DataAddContent();
    }
  }
  onFormCancel(): void {
    this.router.navigate(['/estate/billboard/']);
  }
  optionReload = (): void => {
    this.estatePropertyList.optionloadComponent = true;
    this.estatePropertyList.DataGetAll();
  }
  onFormLoadResult(): void {
    this.estatePropertyList.optionloadComponent = true;
    this.estatePropertyList.DataGetAll();
  }
}
