import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EnumRecordStatus } from 'ntk-cms-api';

@Pipe({
  name: 'statusClass'
})
export class RecordStatusClassPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: EnumRecordStatus): SafeHtml {
    let ret = '';
    switch (value) {
      case 1:
        ret = 'fa fa-check';
        break;
      case 2:
        ret = 'fa fa-times';
        break;
      case 3:
        ret = 'fa fa-hourglass-half';
        break;
      case 4:
        ret = 'fa fa-thumbs-up';
        break;
      case 5:
        ret = 'far fa-thumbs-down';
        break;
      case 6:
        ret = 'far fa-archive';
        break;
      default:
        ret = 'far fa-check';
    }
    return ret;
  }

}
