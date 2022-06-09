import { PipeTransform, Pipe } from '@angular/core';
import { EnumInfoModel } from 'ntk-cms-api';

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
