import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {

  constructor() { }
  @Input()
  set model(value: Date) {
    this.privateModelDate = value;
  }
  @Output() modelChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Input() optionRequired = false;
  @Input() optionDisabled = false;
  private privateModelDate: Date;
  get modelDate(): Date {
    return this.privateModelDate;
  }
  set modelDate(value: Date) {
    this.privateModelDate = value;
    this.modelChange.emit(value);
  }
  ngOnInit(): void {
  }


}
