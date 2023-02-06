import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilePreviewModel } from 'ngx-awesome-uploader/lib/file-preview.model';
import { FileUploaderPickerAdapter } from './fileUploaderPickerAdapter';

@Component({
  selector: 'app-cms-file-uploader',
  templateUrl: './cms-file-uploader.component.html',
  styleUrls: ['./cms-file-uploader.component.scss'],
})
export class CmsFileUploaderComponent implements OnInit {
  static nextId = 0;
  id = ++CmsFileUploaderComponent.nextId;
  constructor(private http: HttpClient) { }
  adapter = new FileUploaderPickerAdapter(this.http);
  fileType: string | string[];
  @Output() optionUploadSuccess = new EventEmitter<FilePreviewModel>();
  @Input() set optionFileType(x: string | string[]) {
    if (x && x.length > 0) {
      this.fileType = x;
    }
  }
  ngOnInit(): void {

  }
  uploadSuccess(event: FilePreviewModel): void {
    this.optionUploadSuccess.emit(event);
  }
}
