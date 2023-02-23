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
  public fileList: File360ViewModel[] = [];
  public dataDetailModel: File360ViewModel = new File360ViewModel();
  @Output() dataModelChange: EventEmitter<File360ViewModel[]> = new EventEmitter<File360ViewModel[]>();
  @Input() set dataModel(model: File360ViewModel[]) {
    if (!model) {
      model = [];
    }
    this.fileList = model;
    this.optionTabledataSource.data = this.fileList;
  }
  get dataModel(): File360ViewModel[] {
    return this.fileList;
  }

  formInfo: FormInfoModel = new FormInfoModel();
  loading = new ProgressSpinnerModel();
  loadingOption = new ProgressSpinnerModel();
  optionTabledataSource = new MatTableDataSource<File360ViewModel>();
  optionTabledisplayedColumns = ['LinkFileIdThumbnailSrc', 'Title', 'Description', 'Action'];

  selectFileTypeReport = ['jpeg', 'jpg'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  showAddOption: boolean = false;
  fileManagerOpenFormReport = false;

  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.Edit');

  }

  ngOnDestroy(): void {

  }
  onActionFileSelect(model: NodeInterface): void {
    if (!model || !model.id || model.id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.dataDetailModel.linkFileId = model.id;
    this.dataDetailModel.linkFileIdThumbnailSrc = model.downloadLinksrc;
  }

  onActionSubmitList(): void {
    if (!this.fileList) {
      this.fileList = [];
    }
    this.fileList.push(this.dataDetailModel);
    this.dataModel = this.fileList;
    this.dataModelChange.emit(this.fileList);
    this.showAddOption = !this.showAddOption;
  }

  onActionViewAdd(): void {
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
    this.fileList.splice(index, 1);
    this.dataModel = this.fileList;
    this.dataModelChange.emit(this.fileList);
  }
}
