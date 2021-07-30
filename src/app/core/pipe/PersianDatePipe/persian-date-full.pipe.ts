import { Injectable, Pipe } from '@angular/core';
import { PersianCalendarService } from './persian-date.service';

/*
  Generated class for the PersianDate pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
// tslint:disable-next-line: use-pipe-transform-interface
@Pipe({
  name: 'persianDateFull'
})
@Injectable()
export class PersianDateFull {
  /**
   *
   */
  constructor(public persianCalendarService: PersianCalendarService) {

  }
  /*
    Takes a value and convert it to
   */
  transform(value: string | Date): string {
    if (typeof value === 'string') {
      if (!value || value.length === 0) {
        return '';
      }
      const d = new Date(value);
      if (!d) {
        return '';
      }
      return this.persianCalendarService.PersianCalendar(d) + ' ' + d.getHours() + ':' + d.getMinutes();
    }
    if (typeof value === typeof Date) {
      if (!value) {
        return '';
      }
      return this.persianCalendarService.PersianCalendar(value) + ' ' + value.getHours() + ':' + value.getMinutes();
    }
  }

}
