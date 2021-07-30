import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dropdown',
  template: `
        <select class="form-control" [id]="field.name" [formControl]="optionFormControl">
          <option *ngFor="let opt of field.options" [value]="opt.key">{{opt.label}}</option>
        </select>
    `
})
export class DropDownComponent {
  @Input() field: any = {};
  @Input() optionFormControl: FormControl;

  constructor() {

  }
}
