import { Pipe, PipeTransform } from '@angular/core';
import { FileItem } from '../models/fileItem';

@Pipe({
    name: 'treeFolderFilter',
    pure: false
})
export class TreeFolderFilterPipe implements PipeTransform {
    transform(items: FileItem[]): any {
        // debugger
        if (!items) {
            return items;
        }

        return items.filter(item => (item.type + '' === 'dir'));
    }
}
