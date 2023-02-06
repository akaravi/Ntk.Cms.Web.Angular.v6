import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EnumRecordStatus } from 'ntk-cms-api';

@Pipe({
  name: 'statusClass'
})
export class RecordStatusClassPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: EnumRecordStatus, editable = false): SafeHtml {
    let ret = '';
    switch (value) {
      case 1:
        ret = 'fa fa-check';
        break;
      case 2:
        ret = 'fa fa-times';
        break;
      case 3:
        ret = 'fa fa-trash';
        break;
      case 4:
        ret = 'fa fa-hourglass-half';
        break;
      case 5:
        ret = 'far fa-thumbs-down';
        break;
      case 6:
        ret = 'fa fa-archive';
        break;
      default:
        ret = 'fa fa-check';
    }
    return ret;
  }

}
