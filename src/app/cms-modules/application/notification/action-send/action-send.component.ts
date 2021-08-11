import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  ApplicationLogNotificationService,
  ApplicationLogNotificationModel,
  SendNotificationModel,
  ApplicationAppModel,
  ApplicationEnumService,
  ApplicationMemberInfoModel,
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
import { NodeInterface, TreeModel } from 'projects/ntk-cms-filemanager/src/public-api';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-application-notification-action-send',
  templateUrl: './action-send.component.html',
  styleUrls: ['./action-send.component.scss']
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
    private translate: TranslateService,
  ) {
    if (data) {
      this.requestLinkApplicationId = +data.LinkApplicationId || 0;
      this.requestLinkApplicationMemberId = data.LinkApplicationMemberId + '';
    }
    if (this.requestLinkApplicationMemberId.length > 0) {
      this.LinkMemberId = this.requestLinkApplicationMemberId;
    }
    if (this.requestLinkApplicationId > 0) {
      this.dataModel.AppId = this.requestLinkApplicationId;
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
  dataModelEnumContentTypeResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  formInfo: FormInfoModel = new FormInfoModel();
  fileManagerOpenFormSmallFile = false;
  fileManagerOpenFormBigFile = false;

  SmallImageIdSrc = '';
  BigImageIdSrc = '';
  applicationMemberInfoModel = new ApplicationMemberInfoModel();
  onActionFileSelectedSmallImage(model: NodeInterface): void {
    this.dataModel.SmallImageId = model.id;
    this.SmallImageIdSrc = model.downloadLinksrc;

  }
  onActionFileSelectedBigImage(model: NodeInterface): void {
    this.dataModel.BigImageId = model.id;
    this.BigImageIdSrc = model.downloadLinksrc;

  }

  ngOnInit(): void {
    this.formInfo.FormTitle = 'ثبت دسته بندی جدید';
    this.getEnumContentType();
  }
  getEnumContentType(): void {
    this.applicationEnumService.ServiceEnumNotificationType().subscribe((next) => {
      this.dataModelEnumContentTypeResult = next;
    });
  }

  DataAddContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    this.loading.Start('main');
    this.cdr.detectChanges();

    this.applicationLogNotificationService.ServiceSendNotification(this.dataModel).subscribe(
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
  onActionSelectApp(model: ApplicationAppModel | null): void {
    if (!model || model.Id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        'اپلیکیشن را مشخص کنید',
        'اپلیکیشن اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.AppId = model.Id;
  }
  onActionSelectMemberInfo(model: ApplicationMemberInfoModel | null): void {
    if (!model || !model.Id || model.Id.length === 0) {
      this.cmsToastrService.typeErrorMessage(
        'عضو اپلیکیشن را مشخص کنید',
        'عضو اپلیکیشن اطلاعات مشخص نیست'
      );
      return;
    }
    this.applicationMemberInfoModel = model;
    this.LinkMemberId = model.Id;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (this.LinkMemberId && this.LinkMemberId.length > 0) {
      this.dataModel.LinkMemberIds = [];
      this.dataModel.LinkMemberIds.push(this.LinkMemberId);
      this.dataModel.AppId = this.applicationMemberInfoModel.LinkApplicationId;
    }

    if ((this.LinkMemberId || this.LinkMemberId.length === 0) && this.dataModel.AppId <= 0) {
      this.cmsToastrService.typeErrorMessage(
        'گیرنده را مشخص کنید',
        'اپلیکیشن و یا کاربری جهت دریافت مشخص نشده است'
      );
    }

    this.formInfo.FormSubmitAllow = false;

    this.DataAddContent();

  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
