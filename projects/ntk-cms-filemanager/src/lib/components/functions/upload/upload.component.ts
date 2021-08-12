import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FineUploader } from 'fine-uploader';
import { NodeService } from '../../../services/node.service';
import { ErrorExceptionResult, FileContentModel, FileContentService, FileUploadModel } from 'ntk-cms-api';
import { FilePreviewModel } from 'ngx-awesome-uploader';
import { FileUploaderPickerAdapter } from './fileUploaderPickerAdapter';

@Component({
  selector: 'lib-filemanager-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss', './fine-uploader/fine-uploader.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadComponent implements OnInit, AfterViewInit {
  @Output() createFile = new EventEmitter();
  @Input() openDialog;

  @Output() closeDialog = new EventEmitter();

  uploader: FineUploader;
  counter = 0;
  constructor(
    private http: HttpClient,
    private nodeService: NodeService) {
    this.adapter.baseUploadURL = this.nodeService.serviceTree.config.baseUploadURL;
    this.adapter.routeUpload = this.nodeService.serviceTree.config.api.uploadFile;
  }

  ngAfterViewInit() {
    this.uploader = new FineUploader({
      debug: false,
      autoUpload: false,
      maxConnections: 1, // todo configurable
      element: document.getElementById('fine-uploader'),
      template: document.getElementById('fine-uploader-template'),
      request: {
        endpoint: this.nodeService.serviceTree.config.baseUploadURL + this.nodeService.serviceTree.config.api.uploadFile,
        // forceMultipart: false,
        paramsInBody: false,
        params: {
          // parentPath: this.getCurrentPath
        }
      },
      retry: {
        enableAuto: false
      },
      callbacks: {
        onSubmitted: () => {
          debugger
          this.counter++;
        },
        onCancel: () => {
          debugger
          this.counter < 0 ? console.warn('wtf?') : this.counter--;
        },
        onAllComplete: (succ: any, fail: any) => {
          debugger
          if (succ.length > 0) {
            this.counter = 0;
            this.nodeService.refreshCurrentPath();
          }
        },

      }
    })
      ;
  }

  ngOnInit() {
  }

  get getCurrentPath() {
    const parentPath = this.nodeService.findNodeByPath(this.nodeService.currentPath).id;
    return parentPath === 0 ? '' : parentPath;
  }

  uploadFiles() {
    this.uploader.uploadStoredFiles();
  }


  newClickedAction() {
    this.uploader.cancelAll();
    this.closeDialog.emit();
  }
  adapter = new FileUploaderPickerAdapter(this.http);
  fileType: string | string[];
  @Output() optionUploadSuccess = new EventEmitter<FilePreviewModel>();

  uploadSuccess(event: any): void {
    this.optionUploadSuccess.emit(event);
  }

  onFileAdded(model: FilePreviewModel): void {
    console.log('onFileAdded', model);
  }
  onUploadSuccess(model: FilePreviewModel): void {
    if (!model.uploadResponse) {
    }
    const ret = model.uploadResponse as ErrorExceptionResult<FileUploadModel>;
    if (!ret.IsSuccess) {

    }
    this.createFile.emit({ fileName: model.fileName, uploadFileGUID: ret.Item.FileKey });
    // const fileModel = new FileContentModel();
    // fileModel.FileName = model.fileName;
    // fileModel.UploadFileGUID = ret.Item.FileKey;
    // const parentId = +this.getCurrentPath | 0;
    // if (parentId > 0) {
    //   fileModel.LinkCategoryId = parentId;
    // }
    // this.fileContentService.ServiceAdd(fileModel).subscribe(
    //   (next) => { },
    //   (error) => { });
  }
}
