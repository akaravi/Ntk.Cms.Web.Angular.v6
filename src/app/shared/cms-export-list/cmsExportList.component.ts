import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleEntityReportFileModel, EnumExportFileType, EnumExportReceiveMethod, EnumInfoModel, ErrorExceptionResult, ErrorExceptionResultExportFile, ExportFileModel, FilterModel, FormInfoModel, IApiCmsServerBase, ReportFileTypeEnum } from 'ntk-cms-api';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-export-list',
  templateUrl: './cmsExportList.component.html',
})
export class CmsExportListComponent implements OnInit {
  static nextId = 0;
  id = ++CmsExportListComponent.nextId;
  filterModel: FilterModel = new FilterModel();
  requestTitle = '';
  requestService: IApiCmsServerBase;
  constructor(private cmsToastrService: CmsToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CmsExportListComponent>,
    public translate: TranslateService,) {

    if (data) {
      if (data.service)
        this.requestService = data.service;
      else
        this.dialogRef.close({ dialogChangedDate: true });
      if (data.filterModel)
        this.filterModel = data.filterModel;
      else
        this.dialogRef.close({ dialogChangedDate: true });
      if (data.title)
        this.requestTitle = data.title;
    } else {
      this.dialogRef.close({ dialogChangedDate: true });
    }
    this.filterModel.exportFile = new ExportFileModel();
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
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelReportFileResult: ErrorExceptionResult<CoreModuleEntityReportFileModel> = new ErrorExceptionResult<CoreModuleEntityReportFileModel>();
  dataModelSubmitResult: ErrorExceptionResultExportFile = new ErrorExceptionResultExportFile();
  dataModelFileSelect: CoreModuleEntityReportFileModel = new CoreModuleEntityReportFileModel();
  EnumExportFileTypeReport = EnumExportFileType.Report;
  EnumExportReceiveMethodNow = EnumExportReceiveMethod.Now;

  _loading: ProgressSpinnerModel = new ProgressSpinnerModel();
  get loading(): ProgressSpinnerModel {
    return this._loading;
  }
  @Input() set loading(value: ProgressSpinnerModel) {
    this._loading = value;
  }

  ngOnInit(): void {
    this.DataGetAll();
    this.formInfo.formTitle = this.translate.instant('TITLE.EXPORTFILE') + ' : ' + this.requestTitle;
    this.filterModel.exportFile.fileType = this.EnumExportFileTypeReport;
    this.filterModel.exportFile.recieveMethod = this.EnumExportReceiveMethodNow;
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
          this.dataModelReportFileResult.listItems = this.dataModelReportFileResult.listItems.filter(x => x.reportFileType == ReportFileTypeEnum.List);
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
    this.filterModel.exportFile.reportFormatFileId = model.id;
    this.dataModelSubmitResult = new ErrorExceptionResultExportFile();
  }

  fileTypeListItems: Array<EnumInfoModel> = new Array<EnumInfoModel>();
  recieveMethodListItems: Array<EnumInfoModel> = new Array<EnumInfoModel>();

  onFormSubmit(): void {
    this.dataModelSubmitResult = new ErrorExceptionResultExportFile();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.formInfo.formSubmitAllow = false;

    this.requestService.ServiceExportFile(this.filterModel).subscribe({
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
