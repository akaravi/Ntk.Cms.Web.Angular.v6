import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { File360ViewModel, FormInfoModel } from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
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
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();

  }
  public fileView360List: File360ViewModel[] = [];
  public dataDetailModel: File360ViewModel = new File360ViewModel();
  @Output() dataModelChange: EventEmitter<File360ViewModel[]> = new EventEmitter<File360ViewModel[]>();
  @Input() set dataModel(model: File360ViewModel[]) {
    if (!model) {
      model = [];
    }
    this.fileView360List = model;
    this.optionTabledataSource.data = this.fileView360List;
  }
  get dataModel(): File360ViewModel[] {
    return this.fileView360List;
  }

  formInfo: FormInfoModel = new FormInfoModel();
  loading = new ProgressSpinnerModel();
  loadingOption = new ProgressSpinnerModel();
  optionTabledataSource = new MatTableDataSource<File360ViewModel>();
  optionTabledisplayedColumns = ['LinkFileIdThumbnailSrc', 'Title', 'Description', 'Action'];

  selectFileTypeReport = ['jpeg', 'jpg'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  showAddView360 = false;
  fileManagerOpenFormReport = false;

  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.Edit');

  }


  onActionFileSelect(model: NodeInterface): void {
    if (!model || !model.id || model.id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.dataDetailModel.linkFileId = model.id;
    this.dataDetailModel.linkFileIdThumbnailSrc = model.downloadLinksrc;
  }

  onActionSubmitView360(): void {
    if (!this.dataDetailModel.linkFileId || this.dataDetailModel.linkFileId <= 0) {
      this.cmsToastrService.typeErrorMessage('فایل انتخاب نشده');
    }
    if (!this.fileView360List) {
      this.fileView360List = [];
    }
    if (this.selectIndex >= 0) {
      this.fileView360List[this.selectIndex] = this.dataDetailModel;
    }
    else {
      this.fileView360List.push(this.dataDetailModel);
    }
    this.dataModel = this.fileView360List;
    this.dataModelChange.emit(this.fileView360List);
    this.showAddView360 = !this.showAddView360;
    this.selectIndex = -1;
  }

  onActionShowView360Add(): void {
    this.dataDetailModel = new File360ViewModel();
    this.showAddView360 = !this.showAddView360;
  }

  onActionOptionRemoveView360(index: number): void {

    if (index < 0) {
      return;
    }
    if (!this.fileView360List || this.fileView360List.length === 0) {
      return;
    }
    this.fileView360List.splice(index, 1);
    this.dataModel = this.fileView360List;
    this.dataModelChange.emit(this.fileView360List);
  }
  selectIndex = -1;
  onActionOptionEditView360(index: number): void {

    if (index < 0) {
      return;
    }
    if (!this.fileView360List || this.fileView360List.length === 0) {
      return;
    }
    this.dataDetailModel = this.fileView360List[index];
    //this.fileView360List.splice(index, 1);
    this.selectIndex = index;
    this.dataModel = this.fileView360List;
    this.showAddView360 = !this.showAddView360;
    //this.dataModelChange.emit(this.fileView360List);

  }
}
