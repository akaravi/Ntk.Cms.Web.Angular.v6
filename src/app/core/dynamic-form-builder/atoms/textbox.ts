import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

// text,email,tel,textarea,password,
@Component({
  selector: 'textbox',
  template: `
        <input *ngIf="!field.multiline" [attr.type]="field.type" class="form-control"  [id]="field.name" [name]="field.name" [formControl]="optionFormControl">
        <textarea *ngIf="field.multiline" [class.is-invalid]="isDirty && !isValid" [formControl]="optionFormControl" [id]="field.name"
        rows="9" class="form-control" [placeholder]="field.placeholder"></textarea>
    `
})
export class TextBoxComponent {
  @Input() field: any = {};
  @Input() optionFormControl: FormControl;
  get isValid(): any { return this.optionFormControl.valid; }
  get isDirty(): any { return this.optionFormControl.dirty; }

  constructor() {

  }
}
