import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  ApplicationAppModel,
  ApplicationEnumService, ApplicationLogNotificationModel, ApplicationLogNotificationService, ApplicationMemberInfoModel, EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel, SendNotificationModel
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-application-notification-action-send',
  templateUrl: './action-send.component.html',
})
export class ApplicationLogNotificationActionSendComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ApplicationLogNotificationActionSendComponent>,
    public applicationEnumService: ApplicationEnumService,
    public applicationLogNotificationService: ApplicationLogNotificationService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestLinkApplicationId = +data.linkApplicationId || 0;
      this.requestLinkApplicationMemberId = data.linkApplicationMemberId + '';
    }
    if (this.requestLinkApplicationMemberId.length > 0) {
      this.LinkMemberId = this.requestLinkApplicationMemberId;
    }
    if (this.requestLinkApplicationId > 0) {
      this.dataModel.appId = this.requestLinkApplicationId;
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  requestLinkApplicationId = 0;
  requestLinkApplicationMemberId = '';
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  LinkMemberId = '';
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<ApplicationLogNotificationModel> = new ErrorExceptionResult<ApplicationLogNotificationModel>();
  dataModel: SendNotificationModel = new SendNotificationModel();
  dataModelEnumContentTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  formInfo: FormInfoModel = new FormInfoModel();
  fileManagerOpenFormSmallFile = false;
  fileManagerOpenFormBigFile = false;
  SmallImageIdSrc = '';
  BigImageIdSrc = '';
  applicationMemberInfoModel = new ApplicationMemberInfoModel();
  onActionFileSelectedSmallImage(model: NodeInterface): void {
    this.dataModel.smallImageId = model.id;
    this.SmallImageIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedBigImage(model: NodeInterface): void {
    this.dataModel.bigImageId = model.id;
    this.BigImageIdSrc = model.downloadLinksrc;
  }
  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.Register_New_Categories');
    this.getEnumContentType();
  }
  getEnumContentType(): void {
    this.applicationEnumService.ServiceEnumNotificationType().subscribe((next) => {
      this.dataModelEnumContentTypeResult = next;
    });
  }
  DataAddContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.applicationLogNotificationService.ServiceSendNotification(this.dataModel).subscribe({
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
  onActionSelectApp(model: ApplicationAppModel | null): void {
    if (!model || model.id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_application'),
        this.translate.instant('MESSAGE.Application_information_is_not_clear')
      );
      return;
    }
    this.dataModel.appId = model.id;
  }
  onActionSelectMemberInfo(model: ApplicationMemberInfoModel | null): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_member_of_application'),
        this.translate.instant('MESSAGE.Information_application_member_is_not_clear')
      );
      return;
    }
    this.applicationMemberInfoModel = model;
    this.LinkMemberId = model.id;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (this.LinkMemberId && this.LinkMemberId.length > 0) {
      this.dataModel.linkMemberIds = [];
      this.dataModel.linkMemberIds.push(this.LinkMemberId);
      this.dataModel.appId = this.applicationMemberInfoModel.linkApplicationId;
    }
    if ((this.LinkMemberId || this.LinkMemberId.length === 0) && this.dataModel.appId <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_recipient'),
        this.translate.instant('MESSAGE.Application_or_user_to_receive_has_not_been_specified')
      );
    }
    this.formInfo.formSubmitAllow = false;
    this.DataAddContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}