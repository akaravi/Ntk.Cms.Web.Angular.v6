import { Component, OnInit } from '@angular/core';

// import {  BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'file-upload-modal',
    templateUrl: './upload.modal.html',
    styleUrls: ['./upload.modal.css']
})
export class FileUploadModalComponent implements OnInit {
    options;
    onUploadOutput;
    uploadInput;
    currentpath: string;
    startUpload;
    files;
    // constructor(public bsModalRef: BsModalRef ) { }

    ngOnInit() { }
}