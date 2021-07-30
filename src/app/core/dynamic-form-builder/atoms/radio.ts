import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'radio',
  template: `
        <div class="form-check" *ngFor="let opt of field.options">
          <input [formControl]="optionFormControl" class="form-check-input" type="radio" [value]="opt.key" >
          <label class="form-check-label">
            {{opt.label}}
          </label>
        </div>
    `
})
export class RadioComponent {
  @Input() field: any = {};
  @Input() optionFormControl: FormControl;
}
