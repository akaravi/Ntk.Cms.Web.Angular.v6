import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EnumRecordStatus } from 'ntk-cms-api';

@Pipe({
  name: 'boolclass'
})
export class BoolStatusClassPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: boolean | null): SafeHtml {
    if (value === true) {
      return 'fa fa-thumbs-up';

    } else if (value === false) {
      return 'far fa-thumbs-down';
    }
    return 'far fa-archive';

  }

}
