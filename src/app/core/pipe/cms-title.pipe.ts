import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cmstitle' })
export class CmsTitlePipe implements PipeTransform {
  transform(value, args: any[]): any {
    if (!value || !args || args.length === 0) {
      return '';
    }
    const find = args.find(x => x.id === value);
    if (!find) {
      return value;
    }
    if (!find.titleML || find.titleML.length === 0) {
      return find.title;
    }
    return find.titleML;
  }
}
