import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploaderPickerAdapter } from './fileUploaderPickerAdapter';
import { FilePreviewModel } from 'ngx-awesome-uploader/lib/file-preview.model';

@Component({
  selector: 'app-cms-file-uploader',
  templateUrl: './cms-file-uploader.component.html',
  styleUrls: ['./cms-file-uploader.component.scss'],
})
export class CmsFileUploaderComponent implements OnInit {

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
