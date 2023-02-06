import { Pipe, PipeTransform } from '@angular/core';
import { CoreSiteService } from 'ntk-cms-api';
import { map, Observable } from 'rxjs';

@Pipe({ name: 'cmssiteinfo' })
export class CmsSiteInfoPipe implements PipeTransform {
  constructor(public service: CoreSiteService) {

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
            if (ret.item.title && ret.item.title.length > 0)
              retOut = ret.item.title
            ///** */
            if (ret.item.id && ret.item.id > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.id
            }
            ///** */
            if (ret.item.domain && ret.item.domain.length > 0 && ret.item.subDomain && ret.item.subDomain.length > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.subDomain + "." + ret.item.domain;
            }
            else if (ret.item.domain && ret.item.domain.length > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.domain
            }

          }
          return retOut;
        },
          (er) => {
            return '';
          })  // needed only if you need projection
      );

    // return this.service.ServiceGetOneById(value).subscribe({
    //   next: (ret) => {
    //     var retOut = '';
    //     if (ret.isSuccess) {
    //       if (ret.item.username && ret.item.username.length > 0)
    //         retOut = ret.item.username
    //       ///** */
    //       if (ret.item.name && ret.item.name.length > 0) {
    //         if (retOut.length > 0)
    //           retOut = retOut + " | ";
    //         retOut = retOut + ret.item.name
    //       }
    //       ///** */
    //       if (ret.item.lastName && ret.item.lastName.length > 0) {
    //         if (retOut.length > 0)
    //           retOut = retOut + " | ";
    //         retOut = retOut + ret.item.lastName
    //       }
    //       ///** */
    //       if (ret.item.mobile && ret.item.mobile.length > 0) {
    //         if (retOut.length > 0)
    //           retOut = retOut + " | ";
    //         retOut = retOut + ret.item.mobile
    //       }
    //     }
    //     return retOut;
    //   },
    //   error: (er) => {
    //     return '';
    //   }
    // }
    // );
  }

}
