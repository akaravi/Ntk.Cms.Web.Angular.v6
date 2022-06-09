//**msh */
import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  SmsMainApiPathService,
  SmsMainApiPathModel,
  DataFieldInfoModel,
  SmsMainApiPathCompanyModel,
  SmsMainApiPathPublicConfigModel,
  SmsMainApiPathAliasJsonModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { TreeModel } from 'src/filemanager-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-sms-log-inbox-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class SmsMainApiLogInBoxEditComponent implements OnInit {
  requestId = '';
  constructor(
    public coreEnumService: CoreEnumService,
    public smsMainApiPathService: SmsMainApiPathService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (this.activatedRoute.snapshot.paramMap.get('Id')) {
      this.requestId = this.activatedRoute.snapshot.paramMap.get('Id');
    }

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();

  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<SmsMainApiPathModel> = new ErrorExceptionResult<SmsMainApiPathModel>();
  dataModel: SmsMainApiPathAliasJsonModel = new SmsMainApiPathAliasJsonModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();

  fileManagerOpenForm = false;

  ngOnInit(): void {
    if (this.requestId.length > 0) {
      this.formInfo.formTitle = 'ویرایش  ';
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.router.navigate(['/sms/main/api-path/list']);
      return;
    }

    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetOneContent(): void {
    if (this.requestId.length <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.formAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.smsMainApiPathService.setAccessLoad();
    this.smsMainApiPathService.ServiceGetOneWithJsonFormatter(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (!ret.item.perriodStartWorkTime) {
          ret.item.perriodStartWorkTime = '';
        }
        else {
          ret.item.perriodStartWorkTime = ret.item.perriodStartWorkTime.substring(0, ret.item.perriodStartWorkTime.indexOf(':', ret.item.perriodStartWorkTime.indexOf(':') + 1))
        }
        if (!ret.item.perriodEndWorkTime) {
          ret.item.perriodEndWorkTime = '';
        }
        else {
          ret.item.perriodEndWorkTime = ret.item.perriodEndWorkTime.substring(0, ret.item.perriodEndWorkTime.indexOf(':', ret.item.perriodEndWorkTime.indexOf(':') + 1))
        }
        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.title;
          this.formInfo.formAlert = '';

        } else {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
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

  DataEditContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.sending_information_to_the_server'));

    this.smsMainApiPathService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
          setTimeout(() => this.router.navigate(['/sms/main/api-path/list']), 1000);
        } else {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
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

  onActionSelectorSelectLinkApiPathCompanyId(model: SmsMainApiPathCompanyModel | null): void {
    if (!model || model.id.length <= 0) {
      const message = 'کمپانی اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.linkApiPathCompanyId = model.id;
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
  onActionBackToParent(): void {
    this.router.navigate(['/sms/main/api-path/list']);
  }
  onActionSelectSource(model: SmsMainApiPathPublicConfigModel): void {
    this.dataModel.linkPublicConfigId = null;
    if (model && model.id.length > 0) {
      this.dataModel.linkPublicConfigId = model.id;
    }
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (!this.dataModel.linkApiPathCompanyId || this.dataModel.linkApiPathCompanyId.length == 0) {
      const message = 'کمپانی سرویس دهنده مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    if (!this.dataModel.linkPublicConfigId || this.dataModel.linkPublicConfigId.length == 0) {
      const message = 'نوع سرویس دهنده مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.router.navigate(['/sms/main/api-path/list']);
  }
}
