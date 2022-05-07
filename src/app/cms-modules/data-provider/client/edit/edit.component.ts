import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  DataProviderClientModel,
  DataProviderClientService,
  DataFieldInfoModel,
  DataProviderPlanModel,
  DataProviderPlanClientModel,
  DataProviderPlanClientService,
  FilterModel,
  FilterDataModel,
  TokenInfoModel,
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
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { Router } from '@angular/router';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';

@Component({
  selector: 'app-data-provider-client-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class DataProviderClientEditComponent implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DataProviderClientEditComponent>,
    public coreEnumService: CoreEnumService,
    public dataProviderClientService: DataProviderClientService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private dataProviderPlanClientService: DataProviderPlanClientService,
    private translate: TranslateService,
    private tokenHelper: TokenHelper
  ) {
    this.loading.cdr = this.cdr;
    if (data) {
      this.requestId = +data.id || 0;
    }

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();

    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
    });
  }
  cmsApiStoreSubscribe: Subscription;

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  tokenInfo = new TokenInfoModel();

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<DataProviderClientModel> = new ErrorExceptionResult<DataProviderClientModel>();
  dataModel: DataProviderClientModel = new DataProviderClientModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();

  fileManagerOpenForm = false;

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
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetOneContent(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.FormAlert = this.translate.instant('MESSAGE.Receiving_Information _From_The_Server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.dataProviderClientService.setAccessLoad();
    this.dataProviderClientService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        this.dataModel = next.Item;
        if (next.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.Title;
          this.formInfo.FormAlert = '';
          this.DataGetAllPlanClient();
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
    this.loading.Start(pName, this.translate.instant('MESSAGE.sending_information_to_the_server'));

    this.dataProviderClientService.ServiceEdit(this.dataModel).subscribe(
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
  DataGetAllPlanClient(): void {

    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.FormAlert = 'در دریافت دسته بندی دسترسی های از سرور';
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    const filteModelContent = new FilterModel();
    const filter = new FilterDataModel();
    filter.PropertyName = 'LinkClientId';
    filter.Value = this.requestId;
    filteModelContent.Filters.push(filter);

    this.dataProviderPlanClientService.ServiceGetAll(filteModelContent).subscribe(
      (next) => {
        this.dataCoreCpMainMenuCmsUserGroupModel = next.ListItems;
        const listG: number[] = [];
        this.dataCoreCpMainMenuCmsUserGroupModel.forEach(element => {
          listG.push(element.LinkPlanId);
        });
        this.dataCoreCpMainMenuIds = listG;
        if (next.IsSuccess) {
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
  dataCoreCpMainMenuModel: DataProviderPlanModel[];
  dataCoreCpMainMenuIds: number[] = [];
  dataCoreCpMainMenuCmsUserGroupModel: DataProviderPlanClientModel[];

  onActionSelectorPlanSelect(model: DataProviderPlanModel[]): void {
    this.dataCoreCpMainMenuModel = model;
  }
  onActionSelectorPlanSelectAdded(model: DataProviderPlanModel): void {
    if (!this.tokenInfo.UserAccessAdminAllowToProfessionalData) {
      /** */
      const listG: number[] = [];
      this.dataCoreCpMainMenuIds.forEach(element => {
        if (element != model.Id)
          listG.push(element);
      });
      setTimeout(() => this.dataCoreCpMainMenuIds = listG, 1000);
      /** */

      const title = this.translate.instant('MESSAGE.Please_Confirm');
      const message = 'آیا مایل به خرید این محتوا می باشید ' + '؟';
      this.cmsConfirmationDialogService.confirm(title, message)
        .then((confirmed) => {
          if (confirmed) {
            const pName = this.constructor.name + 'main';
            //منتقل شود به صفحه خرید
            this.router.navigate(['/data-provider/client-charge/', model.Id]);
            this.dialogRef.close({ dialogChangedDate: false });
          }
        }
        )
      return;

    }
    const entity = new DataProviderPlanClientModel();
    entity.LinkPlanId = model.Id;
    entity.LinkClientId = this.dataModel.Id;

    this.dataProviderPlanClientService.ServiceAdd(entity).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'ثبت در این گروه با موفقیت انجام شد';
          this.cmsToastrService.typeSuccessEdit();
          // this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
          /** */
          const listG: number[] = [];
          this.dataCoreCpMainMenuIds.forEach(element => {
            if (element != model.Id)
              listG.push(element);
          });
          setTimeout(() => this.dataCoreCpMainMenuIds = listG, 1000);
          /** */

        }

      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);

      }
    );
  }
  onActionSelectorPlanSelectRemoved(model: DataProviderPlanModel): void {

    if (!this.tokenInfo.UserAccessAdminAllowToProfessionalData) {
      /** */
      const listG: number[] = [];
      this.dataCoreCpMainMenuIds.forEach(element => {
        listG.push(element);
      });
      if (listG.indexOf(model.Id) < 0)
        listG.push(model.Id);
      setTimeout(() => this.dataCoreCpMainMenuIds = listG, 1000);
      /** */
      this.cmsToastrService.typeErrorAccessDelete();

      return;
    }
    const entity = new DataProviderPlanClientModel();
    entity.LinkPlanId = model.Id;
    entity.LinkClientId = this.dataModel.Id;

    this.dataProviderPlanClientService.ServiceDeleteEntity(entity).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'حذف از این گروه با موفقیت انجام شد';
          this.cmsToastrService.typeSuccessEdit();
          // this.dialogRef.close({ dialogChangedDate: true });
        } else {

          /** */
          const listG: number[] = [];
          this.dataCoreCpMainMenuIds.forEach(element => {
            listG.push(element);
          });
          if (listG.indexOf(model.Id) < 0)
            listG.push(model.Id);

          setTimeout(() => this.dataCoreCpMainMenuIds = listG, 1000);
          /** */

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
}
