import { NgModule, Pipe } from '@angular/core';
// import { IRCurrencyPipe, JdatePipe } from 'ngx-persian';
import { PersianDate } from './persian-date.pipe';
import { PersianCalendarService } from './persian-date.service';

@Pipe({
  name: 'irc',
  pure: false
})
// export class ExIRCurrencyPipe extends IRCurrencyPipe { }
// //
// @Pipe({
//   name: 'cjdate',
//   pure: false
// })
// export class ExJdatePipe extends JdatePipe { }
// //
// @Pipe({
//   name: 'persianDate',
//   pure: false
// })
export class ExPersianDate extends PersianDate { }
@NgModule({
  declarations: [
    ExPersianDate,
    // ExPersianTimeAgoPipe,
    // ExIRCurrencyPipe,
    // ExJdatePipe,

  ],
  providers: [
    ExPersianDate,
    // ExPersianTimeAgoPipe,
    // ExIRCurrencyPipe,
    // ExJdatePipe,
    PersianCalendarService
  ],
  exports: [
    // ExPersianTimeAgoPipe,
    // ExIRCurrencyPipe,
    // ExJdatePipe,
    ExPersianDate
  ]

})
export class PersianPipeModule { }
