import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreModuleSiteCreditService,
  CoreModuleSiteCreditModel,
  DataFieldInfoModel,
  CoreModuleService,
  CoreModuleModel,
  TokenInfoModel,
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
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cms-site-credit-view',
  templateUrl: './cms-site-credit-view.component.html',
  styleUrls: ['./cms-site-credit-view.component.scss'],
})
export class CmsSiteCreditViewComponent implements OnInit {
  requestLinkModuleId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CmsSiteCreditViewComponent>,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public coreModuleSiteCreditService: CoreModuleSiteCreditService,
    public coreModuleService: CoreModuleService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    private router: Router,
    public translate: TranslateService,
  ) {

    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestLinkModuleId = +data.LinkModuleId || 0;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();



  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreModuleSiteCreditModel> = new ErrorExceptionResult<CoreModuleSiteCreditModel>();
  dataModuleModelResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();
  tokenInfo = new TokenInfoModel();


  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();

  ngOnInit(): void {

    this.formInfo.FormTitle = 'اعتبار سایت   ';

    if (this.requestLinkModuleId <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.DataGetOneContent();
    this.DataModuleGetOne();
    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetOneContent(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.coreModuleSiteCreditService.setAccessLoad();
    this.coreModuleSiteCreditService.ServiceGetCredit(this.requestLinkModuleId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.LinkSiteId;
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


  DataModuleGetOne(): void {
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.coreModuleService.setAccessLoad();
    this.coreModuleService.ServiceGetOneById(this.requestLinkModuleId).subscribe(
      (next) => {
        // this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        this.dataModuleModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.Title;
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

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    // this.formInfo.FormSubmitAllow = false;
    // if (this.ComponentAction === ComponentActionEnum.add) {
    //   this.DataAddContent();
    // }
    // if (this.ComponentAction === ComponentActionEnum.edit) {
    //   this.DataEditContent();
    // }

  }
  onFormActionCreditCharge(): void {
    setTimeout(() => this.router.navigate(['/coremodule/site-credit-charge/', this.requestLinkModuleId]), 1000);
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
