import { Pipe, PipeTransform } from '@angular/core';
import { EnumInfoModel } from 'ntk-cms-api';

@Pipe({ name: 'enums' })
export class EnumsPipe implements PipeTransform {
  transform(value, args: EnumInfoModel[]): any {

    if (!args || args.length === 0) {
      return '';
    }
    const find = args.find(x => x.key === value || x.value === value);
    if (!find) {
      return '';
    }
    return find.description;
  }
}
