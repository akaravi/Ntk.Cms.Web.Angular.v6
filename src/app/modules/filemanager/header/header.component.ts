import { Component, OnInit } from '@angular/core';
import { FileManagerService } from '../filemanager.service';

@Component({
    selector: 'app-filemanager-header',
    templateUrl: 'header.component.html'
})

export class FilemanagerHeaderComponent implements OnInit {
    constructor(public fms: FileManagerService) { }

    ngOnInit() { }
}