
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  ChangeDetectorRef, Component, Inject,
  OnDestroy, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, AuthUserChangePasswordModel, CoreAuthService, CoreEnumService, CoreUserModel, DataFieldInfoModel, EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel, TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-user-changepassword',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.scss'],
})
export class CoreUserChangePasswordComponent implements OnInit, OnDestroy {
  requestLinkUserId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreUserChangePasswordComponent>,
    public coreEnumService: CoreEnumService,
    public coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestLinkUserId = +data.linkUserId || 0;
    }
    this.NewPasswordRepeat = '';
  }
  tokenInfo = new TokenInfoModel();

  NewPasswordRepeat: string;
  passwordIsValid = false;


  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreUserModel> = new ErrorExceptionResult<CoreUserModel>();
  dataModel: AuthUserChangePasswordModel = new AuthUserChangePasswordModel();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  fileManagerOpenForm = false;

  dataCoreUserIds: number[] = [];
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.formInfo.formTitle = 'تغییر کلمه عبور  ';
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataEditContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    if (this.requestLinkUserId > 0) {
      this.dataModel.linkUserId = this.requestLinkUserId;
    }
    this.coreAuthService.ServiceChangePassword(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
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
  passwordValid(event): void {
    this.passwordIsValid = event;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (this.tokenInfo.userAccessAdminAllowToProfessionalData) {
      if (!this.dataModel.oldPassword || this.dataModel.oldPassword.length === 0) {
        this.dataModel.oldPassword = '000';
      }
    } else {
      if (!this.dataModel.oldPassword || this.dataModel.oldPassword.length === 0) {
        this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.Enter_the_previous_password'));

        return;
      }
    }
    if (!this.dataModel.newPassword || this.dataModel.newPassword.length === 0) {
      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.Enter_the_new_password'));



      return;
    }
    if (this.dataModel.newPassword !== this.NewPasswordRepeat) {
      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.The_new_password_is_equivalent_to_a_duplicate'));


      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      if (!this.formGroup.valid) {
        this.cmsToastrService.typeErrorFormInvalid();
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
    }
  }

}
