import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreModuleModel,
  CoreModuleService, CoreModuleSiteUserCreditModel, CoreModuleSiteUserCreditService, DataFieldInfoModel, EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel, TokenInfoModel
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-site-user-credit-view',
  templateUrl: './cms-site-user-credit-view.component.html',
  styleUrls: ['./cms-site-user-credit-view.component.scss'],
})
export class CmsSiteUserCreditViewComponent implements OnInit {
  static nextId = 0;
  id = ++CmsSiteUserCreditViewComponent.nextId;
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

    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      // this.requestLinkSiteId = +data.linkSiteId || 0;
      // this.requestLinkUserId = +data.linkUserId || 0;
      this.requestLinkModuleId = +data.linkModuleId || 0;
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
    this.formInfo.formTitle = this.translate.instant('TITLE.VALIDITY');


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

    this.formInfo.formAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.coreModuleSiteUserCreditService.setAccessLoad();
    this.coreModuleSiteUserCreditService.ServiceGetCredit(this.requestLinkModuleId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.access);

        this.dataModelResult = next;
        if (next.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + next.item.linkUserId;
          this.formInfo.formAlert = '';
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = next.errorMessage;
          this.cmsToastrService.typeErrorMessage(next.errorMessage);
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
    this.formInfo.formAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.coreModuleService.setAccessLoad();
    this.coreModuleService.ServiceGetOneById(this.requestLinkModuleId).subscribe(
      (next) => {

        this.dataModuleModelResult = next;
        if (next.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + next.item.title;
          this.formInfo.formAlert = '';
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = next.errorMessage;
          this.cmsToastrService.typeErrorMessage(next.errorMessage);
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
    // this.formInfo.formSubmitAllow = false;
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
