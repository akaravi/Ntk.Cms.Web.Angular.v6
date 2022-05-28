//**msh */
import {
  CoreEnumService,
  ErrorExceptionResult,
  FormInfoModel,
  CoreModuleLogSiteCreditBlockedService,
  CoreModuleLogSiteCreditBlockedModel,
  TokenInfoModel,
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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-coremodulelog-site-credit-blocked-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class CoreModuleLogSiteCreditBlockedEditComponent implements OnInit, OnDestroy {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreModuleLogSiteCreditBlockedEditComponent>,
    public coreEnumService: CoreEnumService,
    public coreModuleLogSiteCreditBlockedService: CoreModuleLogSiteCreditBlockedService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    if (data) {
      this.requestId = data.id;
    }
  }
  tokenInfo = new TokenInfoModel();


  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreModuleLogSiteCreditBlockedModel> = new ErrorExceptionResult<CoreModuleLogSiteCreditBlockedModel>();
  dataModel: CoreModuleLogSiteCreditBlockedModel = new CoreModuleLogSiteCreditBlockedModel();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  formInfo: FormInfoModel = new FormInfoModel();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


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

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
    });
  }



  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }


  DataGetOneContent(): void {
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.FormAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    /*َAccess Field*/
    this.coreModuleLogSiteCreditBlockedService.setAccessLoad();

    this.coreModuleLogSiteCreditBlockedService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        /*َAccess Field*/
        // this.dataAccessModel = next.Access;
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);
        this.dataModel = ret.Item;
        if (ret.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + ret.Item.Id;
          this.formInfo.FormAlert = '';
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = ret.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
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

  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
