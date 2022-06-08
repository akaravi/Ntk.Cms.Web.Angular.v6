import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DataFieldInfoModel,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel,
  TicketingDepartemenModel,
  TicketingDepartemenService
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-ticketing-departemen-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class TicketingDepartemenDeleteComponent implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TicketingDepartemenDeleteComponent>,
    private publicHelper: PublicHelper,
    private ticketingDepartemenService: TicketingDepartemenService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestId = +data.id || 0;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  loading = new ProgressSpinnerModel();
  dataModelResultCategory: ErrorExceptionResult<TicketingDepartemenModel> = new ErrorExceptionResult<TicketingDepartemenModel>();
  dataModelResultCategoryAllData: ErrorExceptionResult<TicketingDepartemenModel> = new ErrorExceptionResult<TicketingDepartemenModel>();
  dataModel: any = {};
  formInfo: FormInfoModel = new FormInfoModel();
  ngOnInit(): void {

    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOne();
    this.DataGetAll();
  }
  DataGetOne(): void {
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.formInfo.formAlert = 'در حال لود اطلاعات';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.ticketingDepartemenService.setAccessLoad();
    this.ticketingDepartemenService
      .ServiceGetOneById(this.requestId)
      .subscribe(
        (next) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.access);

          this.dataModelResultCategory = next;
          if (!next.isSuccess) {
            this.formInfo.formAlert = 'برروز خطا';
            this.formInfo.formError = next.errorMessage;
            this.cmsToastrService.typeErrorGetOne();
          } else {
            this.formInfo.formAlert = '';
          }
          this.formInfo.formErrorStatus = true;
          this.loading.Stop(pName);

        },
        (error) => {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formErrorStatus = true;
          this.cmsToastrService.typeError(error);
          this.loading.Stop(pName);

        }
      );
  }
  DataGetAll(): void {
    this.formInfo.formAlert = 'در حال لود اطلاعات';
    const filterModel: FilterModel = new FilterModel();
    filterModel.rowPerPage = 100;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.ticketingDepartemenService
      .ServiceGetAll(filterModel)
      .subscribe(
        (next) => {
          this.dataModelResultCategoryAllData = next;
          if (!next.isSuccess) {
            this.formInfo.formAlert = 'برروز خطا';
            this.formInfo.formError = next.errorMessage;
            this.formInfo.formErrorStatus = true;
            this.cmsToastrService.typeErrorGetAll();
          } else {
            this.formInfo.formAlert = '';
          }
          this.loading.Stop(pName);

        },
        (error) => {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formErrorStatus = true;
          this.cmsToastrService.typeError(error);
          this.loading.Stop(pName);

        }
      );

  }
  onFormDelete(): void {
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }

    this.formInfo.formSubmitAllow = false;
    this.formInfo.buttonSubmittedEnabled = false;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.ticketingDepartemenService
      .ServiceDelete(this.requestId)
      .subscribe(
        (next) => {
          this.formInfo.formSubmitAllow = !next.isSuccess;
          if (!next.isSuccess) {
            this.formInfo.formAlert = 'برروز خطا';
            this.formInfo.formError = next.errorMessage;
            this.cmsToastrService.typeErrorRemove();

          } else {
            this.formInfo.formAlert = 'حذف با موفقیت انجام شد';
            this.cmsToastrService.typeSuccessRemove();
            this.dialogRef.close({ dialogChangedDate: true });
          }
          this.formInfo.buttonSubmittedEnabled = true;
          this.loading.Stop(pName);

        },
        (error) => {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeError(error);
          this.formInfo.buttonSubmittedEnabled = true;
          this.loading.Stop(pName);

        }
      );

  }
  onFormChangeNewCatId(model: TicketingDepartemenModel): void {
    this.formInfo.formAlert = '';
    if (this.requestId === 0 || !model || model.id <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.dataModel.newCatId = model.id;
    if (this.dataModel.newCatId === this.requestId) {
      this.formInfo.formAlert = 'برروز خطا';
      this.formInfo.formError =
        'شناسه دسته بندی در حال حذف با دسته بندی جایگزین یکسان است';
      this.formInfo.buttonSubmittedEnabled = false;
    } else {
      this.formInfo.buttonSubmittedEnabled = true;
      this.formInfo.formError = '';
    }
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
   
  }
}
