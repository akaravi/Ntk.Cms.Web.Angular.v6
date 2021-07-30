import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FilePreviewModel } from 'ngx-awesome-uploader/lib/file-preview.model';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-files-selector',
  templateUrl: './cms-files-selector.component.html',
  styleUrls: ['./cms-files-selector.component.scss'],
})
export class CmsFilesSelectorComponent implements OnInit {
  fileManagerOpenForm = false;
  appLanguage = 'fa';
  selectFileTypeMainImage = [];
  fileManagerTree: TreeModel;


  constructor(private publicHelper: PublicHelper, public cmsToastrService: CmsToastrService) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @Output() optionUploadSuccess = new EventEmitter<FilePreviewModel>();
  @Input() set optionFileType(x: string | string[]) {
    if (x && x.length > 0) {
      // this.selectFileTypeMainImage.push(x);
    }
  }
  @Output() dataFileModelChange: EventEmitter<Map<number, string>> = new EventEmitter<Map<number, string>>();
  @Input() set dataFileModel(model: Map<number, string>) {
    this.optionsData = model;
    this.dataFileModelChange.emit(model);
  }
  get dataFileModel(): Map<number, string> {

    return this.optionsData;
  }
  private optionsData: Map<number, string>;
  ngOnInit(): void {

  }
  onActionFileSelected(model: NodeInterface): void {
    this.dataFileModel.set(model.id, model.downloadLinksrc);
  }
  onActionFileSelectedRemove(key: number): void {
    if (this.dataFileModel.has(key)) {
      this.dataFileModel.delete(key);

    }
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();

  }
}
