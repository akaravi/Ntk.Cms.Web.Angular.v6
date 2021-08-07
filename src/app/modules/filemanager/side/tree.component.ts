import { Component, OnInit, Input } from '@angular/core';
import { FileItem, ItemType } from '../models/fileItem';
import { Pipe, PipeTransform } from '@angular/core';
import { FileManagerService } from '../filemanager.service';

@Component({
    selector: 'tree-node',
    templateUrl: 'tree.component.html',
    styleUrls: ['tree.css']

})

export class TreeNodeComponent implements OnInit {
    constructor(public fms: FileManagerService) { }
    @Input()
    folder: FileItem

    setSelected(node) {
        this.fms.selected = node;
    }

    ngOnInit() { }
}


@Pipe({
    name: 'treeFolderFilter',
    pure: false
})
export class TreeFolderFilterPipe implements PipeTransform {
    transform(items: FileItem[]): any {
        //debugger
        if (!items) {
            return items;
        }

        return items.filter(item => (item.type.toString() == 'dir'));
    }
}