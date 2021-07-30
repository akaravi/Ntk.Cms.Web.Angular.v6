import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'checkbox',
  template: `
        <div [formGroup]="optionFormGroup" >
          <div *ngFor="let opt of field.options" class="form-check form-check">
          <label class="form-check-label">
             <input [formControlName]="opt.key" class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
             {{opt.label}}</label>
          </div>
      </div>
    `
})
export class CheckBoxComponent {
  @Input() field: any = {};
  @Input() optionFormGroup: FormGroup;
  get isValid() { return this.optionFormGroup.controls[this.field.name].valid; }
  get isDirty() { return this.optionFormGroup.controls[this.field.name].dirty; }
}
