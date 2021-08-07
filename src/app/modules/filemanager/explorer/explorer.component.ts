import { Component, OnInit, ViewChild } from '@angular/core';
import { FileManagerService } from '../filemanager.service';
// import { ContextMenuComponent } from 'ngx-contextmenu';

@Component({
    selector: 'explorer-view',
    templateUrl: 'explorer.html',
    styleUrls: ['explorer.css']

})

export class ExplorerComponent implements OnInit {
    constructor(public fms: FileManagerService) {

    }

    // @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
    ngOnInit() { }

    showMessage(msg) {
        alert(msg);
    }
}