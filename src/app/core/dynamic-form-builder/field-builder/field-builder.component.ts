import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'field-builder',
  template: `
  <div class="form-group row" [formGroup]="formGroup">
    <label class="col-md-3 form-control-label" [attr.for]="field.label">
      {{field.label}}
      <strong class="text-danger" *ngIf="field.required && formGroup.get(field.name).invalid">*</strong>
    </label>
    <div class="col-md-9" [ngSwitch]="field.type">
      <textbox *ngSwitchCase="'text'" [field]="field" [optionFormControl]="formGroup.get(field.name)"></textbox>
      <textbox *ngSwitchCase="'date'" [field]="field" [optionFormControl]="formGroup.get(field.name)"></textbox>
      <dropdown *ngSwitchCase="'dropdown'" [field]="field" [optionFormControl]="formGroup.get(field.name)"></dropdown>
      <checkbox *ngSwitchCase="'checkbox'" [field]="field" [optionFormGroup]="formGroup.get(field.name)"></checkbox>
      <radio *ngSwitchCase="'radio'" [field]="field" [optionFormControl]="formGroup.get(field.name)"></radio>
      <file *ngSwitchCase="'file'" [field]="field" [formControl]="formGroup.get(field.name)"></file>
      <div class="alert alert-danger my-1 p-2 fadeInDown animated" *ngIf="!isValid && isDirty">{{field.label}} is required</div>
    </div>
  </div>
  `
})
export class FieldBuilderComponent implements OnInit {
  @Input() field: any;
  @Input() formGroup: FormGroup;

  get isValid() { return this.formGroup.controls[this.field.name].valid; }
  get isDirty() { return this.formGroup.controls[this.field.name].dirty; }

  constructor() { }

  ngOnInit() {
  }

}
