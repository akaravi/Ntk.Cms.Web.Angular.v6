import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-string',
  templateUrl: './string.component.html',
  styleUrls: ['./string.component.scss']
})
export class StringComponent implements OnInit {

  constructor() { }
  @Input()
  set model(value: string) {
    if (value) {
      value.split(',').forEach(element => {
        this.itemSelected[element] = true;
      });
    }
    this.privateModelDate = value;
  }
  @Output() modelChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() optionMultipleChoice = false;
  @Input() optionForceUseDefaultValue = false;
  @Input() optionDefaultValue: string[] = [];
  @Input() optionRequired = false;
  @Input() optionDisabled = false;
  @Input() optionTitle = '';
  @Input() optionPlaceholder = '';
  @Input() optionIconColor = '';

  private privateModelDate = '';
  get modelDate(): string {
    return this.privateModelDate;
  }
  set modelDate(value: string) {
    this.privateModelDate = value;
    this.modelChange.emit(value);
  }
  itemSelected: Map<string, boolean> = new Map<string, boolean>();

  colors = ['primary', 'accent', 'warn', 'primary', 'accent', 'warn', 'primary', 'accent', 'warn'];

  ngOnInit(): void {
  }
  onActionSelect(value: string): void {
    const retOut = [];
    this.optionDefaultValue.forEach(element => {
      if (this.itemSelected[element] && this.itemSelected[element] === true) {
        retOut.push(element);
      }
    });
    this.modelDate = retOut.join(',');
  }
}
