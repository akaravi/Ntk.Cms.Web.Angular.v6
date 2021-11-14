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
    private translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
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

    this.formInfo.FormTitle = 'اضافه کردن  ';
    this.getEnumRecordStatus();
    this.DataGetAccess();

  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetAccess(): void {
    this.estateBillboardService
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

    this.estateBillboardService.ServiceAdd(this.dataModel).subscribe(
      (next) => {
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.dataModel = this.dataModelResult.Item;
          this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.optionReload();
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop(pName);

        this.formInfo.FormSubmitAllow = true;
      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
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

    this.estateBillboardService.ServiceEdit(this.dataModel).subscribe(
      (next) => {
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
          this.optionReload();
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop(pName);

        this.formInfo.FormSubmitAllow = true;
      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);

      }
    );
  }
  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;

  }
  onActionSelectorSelectUsage(model: string[] | null): void {

    this.dataModel.LinkPropertyTypeUsageIds = model;
  }
  onActionSelectorContarctType(model: string[] | null): void {

    this.dataModel.LinkContractTypeIds = model;
  }
  onActionSelectorSelectLanduse(model: string[] | null): void {

    this.dataModel.LinkPropertyTypeLanduseIds = model;
  }
  onActionSelectorLocation(model: number[] | null): void {

    this.dataModel.LinkLocationIds = model;
  }
  onActionSelectorProperty(model: string[] | null): void {
    this.dataModel.LinkPropertyIds = model;
  }


  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormSubmitAllow = false;

    if (this.dataModel.Id && this.dataModel.Id.length > 0) {
      this.DataEditContent();
    }
    else {
      this.DataAddContent();
    }
  }
  onFormCancel(): void {
    this.router.navigate(['/estate/customer-order/']);
  }
  optionReload = (): void => {
    this.estatePropertyList.optionloadComponent = true;
    this.estatePropertyList.DataGetAll();
  }
}
