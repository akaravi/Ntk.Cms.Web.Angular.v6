import { PipeTransform, Pipe } from '@angular/core';
import { EnumModel } from 'ntk-cms-api';

@Pipe({ name: 'valueBoolean' })
export class ValueBooleanPipe implements PipeTransform {
 // El parametro object representa, los valores de las propiedades o indice
 transform(objects :  any ) {

  return false;
}

}
