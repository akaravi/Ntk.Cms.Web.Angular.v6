import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Pipe({
  name: 'boolclass'
})
export class BoolStatusClassPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: boolean | null): SafeHtml {
    if (value === true) {
      return 'fa fa-thumbs-up';

    } else if (value === false) {
      return 'fa fa-thumbs-down';
    }
    return 'fa fa-archive';

  }

}
