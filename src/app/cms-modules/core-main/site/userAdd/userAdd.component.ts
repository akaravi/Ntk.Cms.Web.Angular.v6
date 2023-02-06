
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, CoreEnumService, CoreSiteModel,
  CoreSiteUserModel,
  CoreSiteUserService, CoreUserGroupModel, CoreUserModel, DataFieldInfoModel, EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

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
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestLinkUserId = +data.linkUserId || 0;
      this.requestLinkSiteId = +data.linkSiteId || 0;
      this.requestLinkUserGroupId = +data.linkUserGroupId || 0;
    }
    if (this.requestLinkSiteId > 0) {
      this.dataModel.linkSiteId = this.requestLinkSiteId;
    }
    if (this.requestLinkUserId > 0) {
      this.dataModel.linkUserId = this.requestLinkUserId;
    }
    if (this.requestLinkUserGroupId > 0) {
      this.dataModel.linkUserGroupId = this.requestLinkUserGroupId;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  dataAccessModel: AccessModel;
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreSiteUserModel> = new ErrorExceptionResult<CoreSiteUserModel>();
  dataModel: CoreSiteUserModel = new CoreSiteUserModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();

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
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.dataAccessModel = ret.access;
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

    this.coreSiteService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });

        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.DataAddContent();
  }

  onActionSelectorSiteSelect(model: CoreSiteModel): void {
    this.dataModel.linkSiteId = null;
    if (model && model.id > 0) {
      this.dataModel.linkSiteId = model.id;
    }
  }
  onActionSelectorUserSelect(model: CoreUserModel): void {
    this.dataModel.linkUserId = null;
    if (model && model.id > 0) {
      this.dataModel.linkUserId = model.id;
    }
  }
  onActionSelectorUserGroupSelect(model: CoreUserGroupModel): void {
    this.dataModel.linkUserGroupId = null;
    if (model && model.id > 0) {
      this.dataModel.linkUserGroupId = model.id;
    }
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
