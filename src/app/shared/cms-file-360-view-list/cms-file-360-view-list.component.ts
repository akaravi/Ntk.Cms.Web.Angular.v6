import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleEntityReportFileModel, File360ViewModel, FormInfoModel } from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-file-360-view-list',
  templateUrl: './cms-file-360-view-list.component.html'
})
export class CmsFile360ViewListComponent implements OnInit {
  static nextId = 0;
  id = ++CmsFile360ViewListComponent.nextId;
  constructor(private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
  ) {

  }
  public fileList: File360ViewModel[] = [];
  public dataDetailModel: File360ViewModel = new File360ViewModel();
  @Output() dataModelChange: EventEmitter<File360ViewModel[]> = new EventEmitter<File360ViewModel[]>();
  @Input() set dataModel(model: File360ViewModel[]) {
    if (!model) {
      model = [];
    }
    this.fileList = model;
  }
  get dataModel(): File360ViewModel[] {
    return this.fileList;
  }

  formInfo: FormInfoModel = new FormInfoModel();
  loading = new ProgressSpinnerModel();
  loadingOption = new ProgressSpinnerModel();
  optionTabledataSource = new MatTableDataSource<File360ViewModel>();
  optionTabledisplayedColumns = ['Title', 'Description', 'LinkFileId', 'Action'];

  selectFileTypeReport = ['jpeg'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  showAddOption: boolean = false;
  fileManagerOpenFormReport = false;

  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.Edit');

  }

  ngOnDestroy(): void {

  }
  // CoreModuleEntityReportFileModel
  onActionFileSelect(model: CoreModuleEntityReportFileModel): void {
    this.dataDetailModel.linkFileId = model.linkFileId;
    this.dataDetailModel.linkFileIdSrc = model.linkFileIdSrc;
  }
  onActionOptionAddToList(): void {
    if (!this.fileList) {
      this.fileList = [];
    }
    this.fileList.push(this.dataDetailModel);
    this.dataModelChange.emit(this.fileList);
    this.showAddOption = !this.showAddOption;
    console.log(this.dataDetailModel);
  }
  onFormCancel(): void {
  }
  onOpenPage(): void {
    this.dataDetailModel = new File360ViewModel();
    this.showAddOption = !this.showAddOption;
  }

  onActionOptionRemoveFromList(index: number): void {
    if (index < 0) {
      return;
    }
    if (!this.fileList || this.fileList.length === 0) {
      return;
    }
    this.fileList = this.fileList.splice(index, 1);
    this.dataModelChange.emit(this.fileList);
  }
}
