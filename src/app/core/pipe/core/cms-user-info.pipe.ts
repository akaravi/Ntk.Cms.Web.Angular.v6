import { Pipe, PipeTransform } from '@angular/core';
import { CoreUserService } from 'ntk-cms-api';
import { map, Observable } from 'rxjs';

@Pipe({ name: 'cmsuserinfo' })
export class CmsUserInfoPipe implements PipeTransform {
  constructor(public service: CoreUserService) {

  }
  transform(value: number): Observable<string> {
    if (!value || value <= 0) {
      return new Observable<string>();
    }
    return this.service.ServiceGetOneById(value)
      .pipe(
        map((ret) => {
          var retOut = '';
          if (ret.isSuccess) {
            if (ret.item.username && ret.item.username.length > 0)
              retOut = ret.item.username
            ///** */
            if (ret.item.email && ret.item.email.length > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.email
            }
            ///** */
            if (ret.item.name && ret.item.name.length > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.name
            }
            ///** */
            if (ret.item.lastName && ret.item.lastName.length > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.lastName
            }
            ///** */
            if (ret.item.mobile && ret.item.mobile.length > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.mobile
            }
          }
          return retOut;
        },
          (er) => {
            return '';
          })  // needed only if you need projection
      );

  }

}
