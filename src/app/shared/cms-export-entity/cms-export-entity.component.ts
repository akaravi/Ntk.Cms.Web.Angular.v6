import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleEntityReportFileModel, EnumExportFileType, EnumExportReceiveMethod, EnumInfoModel, ErrorExceptionResult, ErrorExceptionResultExportFile, ExportFileModel, FormInfoModel, IApiCmsServerBase, ReportFileTypeEnum } from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-export-entity',
  templateUrl: './cms-export-entity.component.html'
})
export class CmsExportEntityComponent implements OnInit {
  static nextId = 0;
  id = ++CmsExportEntityComponent.nextId;
  requestId = '';
  requestTitle = '';
  requestService: IApiCmsServerBase;
  constructor(private cmsToastrService: CmsToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CmsExportEntityComponent>,
    public translate: TranslateService,
  ) {
    if (data) {
      if (data.service)
        this.requestService = data.service;
      else
        this.dialogRef.close({ dialogChangedDate: true });
      if (data.id)
        this.requestId = data.id;
      else
        this.dialogRef.close({ dialogChangedDate: true });
      if (data.title)
        this.requestTitle = data.title;
    } else {
      this.dialogRef.close({ dialogChangedDate: true });
    }
    let eum = new EnumInfoModel();
    eum.value = 1;
    eum.key = 'Excel';
    eum.description = 'Excel';
    this.fileTypeListItems.push(eum);

    eum = new EnumInfoModel();
    eum.value = 3;
    eum.key = 'Json';
    eum.description = 'Json';
    this.fileTypeListItems.push(eum);

    eum = new EnumInfoModel();
    eum.value = 4;
    eum.key = 'Report';
    eum.description = 'Report';
    this.fileTypeListItems.push(eum);

    eum = new EnumInfoModel();
    eum.value = 0;
    eum.key = 'Now';
    eum.description = 'Now';
    this.recieveMethodListItems.push(eum);

    eum = new EnumInfoModel();
    eum.value = 1;
    eum.key = 'Email';
    eum.description = 'Email';
    this.recieveMethodListItems.push(eum);

    eum = new EnumInfoModel();
    eum.value = 2;
    eum.key = 'FileManager';
    eum.description = 'FileManager';
    this.recieveMethodListItems.push(eum);
  }
  dataModelReportFileResult: ErrorExceptionResult<CoreModuleEntityReportFileModel> = new ErrorExceptionResult<CoreModuleEntityReportFileModel>();
  dataModelSubmitResult: ErrorExceptionResultExportFile = new ErrorExceptionResultExportFile();
  fileTypeListItems: Array<EnumInfoModel> = new Array<EnumInfoModel>();
  recieveMethodListItems: Array<EnumInfoModel> = new Array<EnumInfoModel>();

  _loading: ProgressSpinnerModel = new ProgressSpinnerModel();
  get loading(): ProgressSpinnerModel {
    return this._loading;
  }
  @Input() set loading(value: ProgressSpinnerModel) {
    this._loading = value;
  }


  formControl = new FormControl();
  filteredOptions: Observable<CoreModuleEntityReportFileModel[]>;
  dataModelFileSelect: CoreModuleEntityReportFileModel = new CoreModuleEntityReportFileModel();
  dataModel: ExportFileModel = new ExportFileModel();
  EnumExportFileTypeReport = EnumExportFileType.Report;
  EnumExportReceiveMethodNow = EnumExportReceiveMethod.Now;

  formInfo: FormInfoModel = new FormInfoModel();


  ngOnInit(): void {
    this.DataGetAll();
    this.formInfo.formTitle = this.translate.instant('TITLE.EXPORTFILE') + ' : ' + this.requestTitle;
    this.dataModel.fileType = this.EnumExportFileTypeReport;
    this.dataModel.recieveMethod = this.EnumExportReceiveMethodNow;
  }

  ngOnDestroy(): void {

  }

  DataGetAll(): void {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.dataModelSubmitResult = new ErrorExceptionResultExportFile();
    this.formInfo.formSubmitAllow = false;
    this.requestService.ServiceReportFileGetAll().subscribe({
      next: (ret) => {
        this.dataModelReportFileResult = ret;
        if (ret.isSuccess) {
          this.dataModelReportFileResult.listItems = this.dataModelReportFileResult.listItems.filter(x => x.reportFileType == ReportFileTypeEnum.Item);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);
        this.formInfo.formSubmitAllow = true;
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);

        this.loading.Stop(pName);
        this.formInfo.formSubmitAllow = true;
      }
    }
    );
  }
  onActionFileSelect(model: CoreModuleEntityReportFileModel): void {
    this.dataModelFileSelect = model;
    this.dataModel.reportFormatFileId = model.id;
    this.dataModelSubmitResult = new ErrorExceptionResultExportFile();
  }
  onFormSubmit(): void {
    this.dataModelSubmitResult = new ErrorExceptionResultExportFile();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.formInfo.formSubmitAllow = false;

    this.requestService.ServiceExportFileGetOne(this.requestId, this.dataModel).subscribe({
      next: (ret) => {
        this.dataModelSubmitResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);
        this.formInfo.formSubmitAllow = true;
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);

        this.loading.Stop(pName);
        this.formInfo.formSubmitAllow = true;
      }
    }
    );
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onOpenPage(): void {
    if (this.dataModelSubmitResult && this.dataModelSubmitResult.isSuccess && this.dataModelSubmitResult.linkFile.length > 0)
      window.open(this.dataModelSubmitResult.linkFile, "_blank");
  }
}
