import { Component, OnInit } from '@angular/core';
import { FileManagerService } from '../filemanager.service';
import {FileItem, ItemType} from '../models/fileItem';



@Component({
    selector: 'app-filemanager-dir-tree',
    templateUrl: 'side.html'
})

export class FileManagerDirTreeComponent  implements OnInit {
    constructor(public fms: FileManagerService ) { }


    ngOnInit() { }
}
