import { Pipe, PipeTransform } from '@angular/core';
import { EstatePropertyCompanyService } from 'ntk-cms-api';
import { map, Observable } from 'rxjs';

@Pipe({ name: 'estatePropertyCompanyInfo' })
export class estatePropertyCompanyInfoPipe implements PipeTransform {
  constructor(public service: EstatePropertyCompanyService) {

  }
  transform(value: string): Observable<string> {
    if (!value || value.length <= 0) {
      return new Observable<string>();
    }
    return this.service.ServiceGetOneById(value)
      .pipe(
        map((ret) => {
          var retOut = '';
          if (ret.isSuccess) {
            if (ret.item.title && ret.item.title.length > 0)
              retOut = ret.item.title
            ///** */
          }
          return retOut;
        },
          (er) => {
            return '';
          })  // needed only if you need projection
      );

  }

}
