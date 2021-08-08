import { Component, OnInit, ViewChild } from '@angular/core';
import { FileManagerService } from '../filemanager.service';
import { ContextMenuComponent } from 'ngx-contextmenu';

@Component({
    selector: 'app-filemanager-explorer-view',
    templateUrl: 'explorer.component.html',
    styleUrls: ['explorer.component.css']

})

export class FileManagerExplorerComponent implements OnInit {
    constructor(
        public fms: FileManagerService
        ) {

    }

    @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
    ngOnInit() { }

    showMessage(msg) {
        alert(msg);
    }
    close(){
        
    }
}