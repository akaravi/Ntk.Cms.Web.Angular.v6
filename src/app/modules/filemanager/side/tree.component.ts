import { Component, OnInit, Input } from '@angular/core';
import { FileItem } from '../models/fileItem';
import { Pipe, PipeTransform } from '@angular/core';
import { FileManagerService } from '../filemanager.service';

@Component({
    selector: 'app-filemanage-tree-node',
    templateUrl: 'tree.component.html',
    styleUrls: ['tree.component.css']

})

export class FileManagerTreeNodeComponent implements OnInit {
    constructor(public fms: FileManagerService) { }
    @Input()
    folder: FileItem;

    setSelected(node) {
        this.fms.selected = node;
    }

    ngOnInit() { }
}

