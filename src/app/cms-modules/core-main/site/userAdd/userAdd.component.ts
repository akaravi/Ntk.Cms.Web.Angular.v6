import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreSiteService,
  CoreSiteModel,
  CoreSiteUserModel,
  CoreSiteUserService,
  CoreModuleModel,
  AccessModel,
  DataFieldInfoModel,
  CoreUserModel,
  CoreUserGroupModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ChangeDetectorRef,
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
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-core-site-user-add',
  templateUrl: './userAdd.component.html',
  styleUrls: ['./userAdd.component.scss'],
})
export class CoreSiteUserAddComponent implements OnInit {
  requestLinkSiteId = 0;
  requestLinkUserId = 0;
  requestLinkUserGroupId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreSiteUserAddComponent>,
    public coreEnumService: CoreEnumService,
    public coreSiteService: CoreSiteUserService,
    private cmsToastrService: CmsToastrService,
    private publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    if (data) {
      this.requestLinkUserId = +data.LinkUserId || 0;
      this.requestLinkSiteId = +data.LinkSiteId || 0;
      this.requestLinkUserGroupId = +data.LinkUserGroupId || 0;
    }
    if (this.requestLinkSiteId > 0) {
      this.dataModel.LinkSiteId = this.requestLinkSiteId;
    }
    if (this.requestLinkUserId > 0) {
      this.dataModel.LinkUserId = this.requestLinkUserId;
    }
    if (this.requestLinkUserGroupId > 0) {
      this.dataModel.LinkUserGroupId = this.requestLinkUserGroupId;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  dataAccessModel: AccessModel;
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreSiteUserModel> = new ErrorExceptionResult<CoreSiteUserModel>();
  dataModel: CoreSiteUserModel = new CoreSiteUserModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  fileManagerOpenForm = false;


  ngOnInit(): void {
    this.getEnumRecordStatus();
    this.DataGetAccess();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetAccess(): void {
    this.coreSiteService
      .ServiceViewModel()
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.dataAccessModel = next.Access;
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
    this.loading.Start('main');
    this.cdr.detectChanges();
    this.coreSiteService.ServiceAdd(this.dataModel).subscribe(
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
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormSubmitAllow = false;
    this.DataAddContent();
  }

  onActionSelectorSiteSelect(model: CoreSiteModel): void {
    this.dataModel.LinkSiteId = null;
    if (model && model.Id > 0) {
      this.dataModel.LinkSiteId = model.Id;
    }
  }
  onActionSelectorUserSelect(model: CoreUserModel): void {
    this.dataModel.LinkUserId = null;
    if (model && model.Id > 0) {
      this.dataModel.LinkUserId = model.Id;
    }
  }
  onActionSelectorUserGroupSelect(model: CoreUserGroupModel): void {
    this.dataModel.LinkUserGroupId = null;
    if (model && model.Id > 0) {
      this.dataModel.LinkUserGroupId = model.Id;
    }
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
