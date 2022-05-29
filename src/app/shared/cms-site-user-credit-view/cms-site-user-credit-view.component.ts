import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreModuleSiteUserCreditService,
  CoreModuleSiteUserCreditModel,
  DataFieldInfoModel,
  CoreModuleModel,
  CoreModuleService,
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
  selector: 'app-cms-site-user-credit-view',
  templateUrl: './cms-site-user-credit-view.component.html',
  styleUrls: ['./cms-site-user-credit-view.component.scss'],
})
export class CmsSiteUserCreditViewComponent implements OnInit {
  // requestLinkSiteId = 0;
  // requestLinkUserId = 0;
  requestLinkModuleId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CmsSiteUserCreditViewComponent>,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public coreModuleSiteUserCreditService: CoreModuleSiteUserCreditService,
    public coreModuleService: CoreModuleService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    private router: Router,
    public translate: TranslateService,
  ) {

    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      // this.requestLinkSiteId = +data.LinkSiteId || 0;
      // this.requestLinkUserId = +data.LinkUserId || 0;
      this.requestLinkModuleId = +data.LinkModuleId || 0;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreModuleSiteUserCreditModel> = new ErrorExceptionResult<CoreModuleSiteUserCreditModel>();
  dataModuleModelResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();
  tokenInfo = new TokenInfoModel();


  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();


  ngOnInit(): void {
    this.formInfo.FormTitle = 'اعتبار  ';


    if (this.requestLinkModuleId <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.getEnumRecordStatus();
    this.DataGetOneContent();
    this.DataModuleGetOne();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetOneContent(): void {

    this.formInfo.FormAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.coreModuleSiteUserCreditService.setAccessLoad();
    this.coreModuleSiteUserCreditService.ServiceGetCredit(this.requestLinkModuleId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.LinkUserId;
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
    setTimeout(() => this.router.navigate(['/coremodule/site-user-credit-charge/', this.requestLinkModuleId]), 1000);
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
