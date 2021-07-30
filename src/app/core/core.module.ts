import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstLetterPipe } from './pipe/first-letter.pipe';
import { SafePipe } from './pipe/safe.pipe';

@NgModule({
  declarations: [
    FirstLetterPipe,
    SafePipe,
  ],
  imports: [CommonModule],
  exports: [
    FirstLetterPipe,
    SafePipe,
  ]
  ,
})
export class CoreModule { }
