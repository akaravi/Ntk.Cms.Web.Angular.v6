import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  TicketingTemplateModel,
  TicketingTemplateService,
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  TicketingDepartemenModel,
  DataFieldInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-ticketing-template-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class TicketingTemplateAddComponent implements OnInit {
  requestParentId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TicketingTemplateAddComponent>,
    public coreEnumService: CoreEnumService,
    public ticketingTemplateService: TicketingTemplateService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestParentId = +data.parentId || 0;
    }
    if (this.requestParentId > 0) {
      this.dataModel.linkTicketingDepartemenId = this.requestParentId;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  formMatcher = new CmsFormsErrorStateMatcher();
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<TicketingTemplateModel> = new ErrorExceptionResult<TicketingTemplateModel>();
  dataModel: TicketingTemplateModel = new TicketingTemplateModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();



  ngOnInit(): void {
<<<<<<< HEAD
    this.formInfo.FormTitle = this.translate.instant('TITLE.Submit_New_Content');
=======
    this.formInfo.formTitle = 'ثبت محتوای جدید';
>>>>>>> main
    this.getEnumRecordStatus();
    this.DataGetAccess();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetAccess(): void {
    this.ticketingTemplateService
      .ServiceViewModel()
      .subscribe(
        async (next) => {
          if (next.isSuccess) {
            // this.dataAccessModel = next.access;
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(next.errorMessage);
          }
        },
        (error) => {
          this.cmsToastrService.typeErrorGetAccess(error);
        }
      );
  }
  DataAddContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.ticketingTemplateService.ServiceAdd(this.dataModel).subscribe(
      (next) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = next;
        if (next.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formError = next.errorMessage;
          this.cmsToastrService.typeerrorMessage(next.errorMessage);
        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);

      }
    );
  }
  DataEditContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.ticketingTemplateService.ServiceEdit(this.dataModel).subscribe(
      (next) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = next;
        if (next.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });

        } else {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formError = next.errorMessage;
          this.cmsToastrService.typeerrorMessage(next.errorMessage);
        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);

      }
    );
  }
  onActionSelectorSelect(model: TicketingDepartemenModel | null): void {
    if (!model || model.id <= 0) {
      const message = 'دپارتمان اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.linkTicketingDepartemenId = model.id;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;

    this.DataAddContent();

  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
