import { Component, OnInit } from '@angular/core';
import { FileManagerService } from '../filemanager.service';




@Component({
    selector: 'app-filemanager-dir-tree',
    templateUrl: 'side.component.html'
})

export class FileManagerDirTreeComponent  implements OnInit {
    constructor(public fms: FileManagerService ) { }


    ngOnInit() { }
}
