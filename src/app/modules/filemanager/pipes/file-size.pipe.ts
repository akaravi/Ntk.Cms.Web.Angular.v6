import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
    transform(value: any): any {
        if (value === 0) {
            return '';
        }
        if (value >= 1000000) {
            return Math.round((value / 1000000)) + ' MB';
        }
        else {
            return value + ' Bytes';
        }

    }
}
