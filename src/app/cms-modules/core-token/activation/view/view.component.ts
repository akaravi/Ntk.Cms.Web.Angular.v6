import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreTokenActivationService,
  CoreTokenActivationModel,
  TokenInfoModel,
  NtkCmsApiStoreService,
  DataFieldInfoModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';

@Component({
  selector: 'app-bankpayment-transactionlog-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class CoreTokenActivationViewComponent implements OnInit, OnDestroy {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreTokenActivationViewComponent>,
    public coreEnumService: CoreEnumService,
    public coreTokenActivationService: CoreTokenActivationService,
    private cmsApiStore: NtkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.loading.cdr = this.cdr;
    if (data) {
      this.requestId = data.id + '';
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreTokenActivationModel> = new ErrorExceptionResult<CoreTokenActivationModel>();
  dataModel: CoreTokenActivationModel = new CoreTokenActivationModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumSendSmsStatusTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  fileManagerOpenForm = false;

  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.formInfo.FormTitle = 'مشاهده  ';
    if (this.requestId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
    });
    this.getEnumSendSmsStatusType();
  }

  getEnumSendSmsStatusType(): void {
    this.coreEnumService.ServiceEnumSendSmsStatusType().subscribe((next) => {
      this.dataModelEnumSendSmsStatusTypeResult = next;
    });
  }

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }


  DataGetOneContent(): void {
    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    /*َAccess Field*/
    this.coreTokenActivationService.setAccessLoad();

    this.coreTokenActivationService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        /*َAccess Field*/
        // this.dataAccessModel = next.Access;
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
        this.loading.Stop(pName);

      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);

      }
    );
  }


  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
