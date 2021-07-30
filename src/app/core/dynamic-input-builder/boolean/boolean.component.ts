import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-boolean',
  templateUrl: './boolean.component.html',
  styleUrls: ['./boolean.component.scss']
})
export class BooleanComponent implements OnInit {

  constructor() { }
  @Input() model: boolean;
  @Output() modelChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  ngOnInit(): void {
  }
  setValueToggle(e): void {
    if (e.checked) {
      this.modelChange.emit(true);
    } else {
      this.modelChange.emit(false);
    }
  }
}
