import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-boolean',
  templateUrl: './boolean.component.html',
  styleUrls: ['./boolean.component.scss']
})
export class BooleanComponent implements OnInit {

  constructor() { }
  @Input() optionDisabled = false;
  @Input() set model(val: any) {
    if (val && (val === true || val === 'true' || val === 1 || val === '1')) {
      this.checkedValue = true;
    }
  }
  @Output() modelChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  checkedValue = false;
  ngOnInit(): void {
  }
  setValueToggle(e): void {
    if (e && e.checked) {
      this.modelChange.emit(true);
    } else {
      this.modelChange.emit(false);
    }
  }
}
