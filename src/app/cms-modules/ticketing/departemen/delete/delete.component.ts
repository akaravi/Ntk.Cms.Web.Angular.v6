import { Component, OnInit, ViewChild, Inject } from '@angular/core';
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
    private cmsToastrService: CmsToastrService
  ) {
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
    this.formInfo.FormAlert = 'در حال لود اطلاعات';
    this.loading.display = true;
    this.ticketingDepartemenService.setAccessLoad();
    this.ticketingDepartemenService
      .ServiceGetOneById(this.requestId)
      .subscribe(
        (next) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

          this.dataModelResultCategory = next;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.cmsToastrService.typeErrorGetOne();
          } else {
            this.formInfo.FormAlert = '';
          }
          this.formInfo.FormErrorStatus = true;
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormErrorStatus = true;
          this.cmsToastrService.typeError(error);
          this.loading.display = false;
        }
      );
  }
  DataGetAll(): void {
    this.formInfo.FormAlert = 'در حال لود اطلاعات';
    const filterModel: FilterModel = new FilterModel();
    filterModel.RowPerPage = 100;
    this.loading.display = true;
    this.ticketingDepartemenService
      .ServiceGetAll(filterModel)
      .subscribe(
        (next) => {
          this.dataModelResultCategoryAllData = next;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.formInfo.FormErrorStatus = true;
            this.cmsToastrService.typeErrorGetAll();
          } else {
            this.formInfo.FormAlert = '';
          }
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormErrorStatus = true;
          this.cmsToastrService.typeError(error);
          this.loading.display = false;
        }
      );

  }
  onFormDelete(): void {
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }

    this.formInfo.FormSubmitAllow = false;
    this.formInfo.ButtonSubmittedEnabled = false;
    this.loading.display = true;
    this.ticketingDepartemenService
      .ServiceDelete(this.requestId)
      .subscribe(
        (next) => {
          this.formInfo.FormSubmitAllow = !next.IsSuccess;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.cmsToastrService.typeErrorRemove();

          } else {
            this.formInfo.FormAlert = 'حذف با موفقیت انجام شد';
            this.cmsToastrService.typeSuccessRemove();
            this.dialogRef.close({ dialogChangedDate: true });
          }
          this.formInfo.ButtonSubmittedEnabled = true;
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeError(error);
          this.formInfo.ButtonSubmittedEnabled = true;
          this.loading.display = false;
        }
      );

  }
  onFormChangeNewCatId(model: TicketingDepartemenModel): void {
    this.formInfo.FormAlert = '';
    if (this.requestId === 0 || !model || model.Id <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.dataModel.NewCatId = model.Id;
    if (this.dataModel.NewCatId === this.requestId) {
      this.formInfo.FormAlert = 'برروز خطا';
      this.formInfo.FormError =
        'شناسه دسته بندی در حال حذف با دسته بندی جایگزین یکسان است';
      this.formInfo.ButtonSubmittedEnabled = false;
    } else {
      this.formInfo.ButtonSubmittedEnabled = true;
      this.formInfo.FormError = '';
    }
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
    this.loading.display = false;
  }
}
