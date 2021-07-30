import { PipeTransform, Pipe } from '@angular/core';
import { EnumModel } from 'ntk-cms-api';

@Pipe({ name: 'enums' })
export class EnumsPipe implements PipeTransform {
  transform(value, args: EnumModel[]): any {

    if (!args || args.length === 0) {
      return '';
    }
    const find = args.find(x => x.Key === value || x.Value === value);
    if (!find) {
      return '';
    }
    return find.Description;
  }
}
