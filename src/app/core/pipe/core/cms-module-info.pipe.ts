import { Pipe, PipeTransform } from '@angular/core';
import { CoreModuleService } from 'ntk-cms-api';
import { map, Observable } from 'rxjs';

@Pipe({ name: 'cmsmoduleinfo' })
export class CmsModuleInfoPipe implements PipeTransform {
  constructor(public service: CoreModuleService) {

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
            if (ret.item.titleML && ret.item.titleML.length > 0)
              retOut = ret.item.titleML
            ///** */
            if (ret.item.id && ret.item.id > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.id
            }
            ///** */


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
