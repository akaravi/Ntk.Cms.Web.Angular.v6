import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreTokenUserService,
  CoreTokenUserModel,
  CoreSiteModel,
  TokenInfoModel,
  NtkCmsApiStoreService,
  CoreUserModel,
  MemberUserModel,
  DataFieldInfoModel,
  CoreUserService,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import {
  TreeModel,
  NodeInterface,
} from 'ntk-cms-filemanager';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';

@Component({
  selector: 'app-core-site-domainalias-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class CoreTokenUserEditComponent implements OnInit, OnDestroy {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreTokenUserEditComponent>,
    public coreEnumService: CoreEnumService,
    public coreTokenUserService: CoreTokenUserService,
    private cmsApiStore: NtkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    private translate: TranslateService,
  ) {
    if (data) {
      this.requestId = data.id;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  tokenInfo = new TokenInfoModel();


  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreTokenUserModel> = new ErrorExceptionResult<CoreTokenUserModel>();
  dataModel: CoreTokenUserModel = new CoreTokenUserModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelEnumManageUserAccessAreaTypesResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelEnumManageUserAccessControllerTypesResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();


  fileManagerOpenForm = false;

  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    if (this.requestId && this.requestId.length > 0) {
      this.formInfo.FormTitle = 'ویرایش  ';
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.tokenInfo = next;
    });
    this.getEnumRecordStatus();
    this.getEnumManageUserAccessAreaTypes();
    this.getEnumManageUserAccessControllerTypes();
  }

  getEnumManageUserAccessAreaTypes(): void {
    this.coreEnumService.ServiceEnumManageUserAccessAreaTypes().subscribe((next) => {
      this.dataModelEnumManageUserAccessAreaTypesResult = next;
    });
  }
  getEnumManageUserAccessControllerTypes(): void {
    this.coreEnumService.ServiceEnumManageUserAccessControllerTypes().subscribe((next) => {
      this.dataModelEnumManageUserAccessControllerTypesResult = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetOneContent(): void {
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.Start('main');
    this.cdr.detectChanges();
    /*َAccess Field*/
    this.coreTokenUserService.setAccessLoad();
    this.coreTokenUserService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        /*َAccess Field*/
        //  this.dataAccessModel = next.Access;
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        this.dataModel = next.Item;
        if (next.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.Id;
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
    this.coreTokenUserService.ServiceEdit(this.dataModel).subscribe(
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
          this.cmsToastrService.typeErrorEdit(next.ErrorMessage);

        }
        this.loading.Stop('main');
    this.cdr.detectChanges();
      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop('main');
    this.cdr.detectChanges();
      }
    );
  }
  onActionSiteSelect(model: CoreSiteModel): void {
    if (model && model.Id > 0) {
      this.dataModel.LinkSiteId = model.Id;
    }
  }
  onActionUserSelect(model: CoreUserModel): void {
    if (model && model.Id > 0) {
      this.dataModel.LinkUserId = model.Id;
    }
  }
  onActionMemberSelect(model: MemberUserModel): void {
    if (model && model.Id > 0) {
      this.dataModel.LinkMemberUserId = model.Id;
    }
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
