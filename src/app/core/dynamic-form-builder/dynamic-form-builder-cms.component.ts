import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  GetPropertiesInfoModel,
  FormBuilderFieldModel
} from 'ntk-cms-api';
// https://stackblitz.com/edit/angular-dynamic-form-builder-9nybhu?file=app%2Fapp.component.html
@Component({
  selector: 'dynamic-form-builder-cms',
  template: `
      <div *ngFor="let field of fields">
          <field-builder [field]="field" [formGroup]="formGroup"></field-builder>
      </div>
  `,
})
export class DynamicFormBuilderCmsComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  @Input() propertiesInfos: GetPropertiesInfoModel[] = [];
  @Output() jsonValueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() set jsonValue(model: string) {
    this.fieldValue = JSON.parse(model);
  }
  fieldValue: Array<FormBuilderFieldModel>;
  @Input() formGroup: FormGroup;
  fields: any[] = [];
  unsubcribe: any;
  constructor() {

  }

  ngOnInit(): void {
    this.unsubcribe = this.formGroup.valueChanges.subscribe((update) => {
      const modelValue = {};
      this.propertiesInfos.forEach(x => {
        if (update[x.FieldName]) {
          // modelValue.push({
          //   fieldName: x.FieldName,
          //   value: update[x.FieldName]
          // });
          modelValue[x.FieldName] = update[x.FieldName];
        }
      });
      this.jsonValueChange.emit(JSON.stringify(modelValue));
    });

    this.propertiesInfos.forEach(x => {
      let fValue = '';
      if (this.fieldValue) {
        if (this.fieldValue[x.FieldName]) {
          fValue = this.fieldValue[x.FieldName];
        } else if (this.fieldValue.findIndex(y => y.fieldName === x.FieldName) >= 0) {
          fValue = this.fieldValue.find(y => y.fieldName === x.FieldName).value;
        } else if (this.fieldValue.findIndex(y => y['fieldname'] === x.FieldName) >= 0) {
          fValue = this.fieldValue.find(y => y['fieldname'] === x.FieldName).value;
        }
      }


      switch (x.FieldType) {
        case 'System.String':
          this.fields.push({
            type: 'text',
            name: x.FieldName,
            label: x.FieldTitle,
            value: fValue,
            required: false,
          });
          break;
        case 'System.Int64':
          this.fields.push({
            type: 'text',
            name: x.FieldName,
            label: x.FieldTitle,
            value: fValue,
            required: false,
          });
          break;
        case 'System.Int32':
          this.fields.push({
            type: 'text',
            name: x.FieldName,
            label: x.FieldTitle,
            value: fValue,
            required: false,
          });
          break;
        default:
          this.fields.push({
            type: 'text',
            name: x.FieldName,
            label: x.FieldTitle,
            value: fValue,
            required: false,
          });
          break;
      }
    });
    this.fields.forEach(x => {
      if (x.type == 'checkbox') {
        this.formGroup.addControl(x.name, new FormGroup({}));
        x.options.forEach(o => {
          (this.formGroup.get(x.name) as FormGroup).addControl(o.key, new FormControl(false));
        })
      }
      else {
        this.formGroup.addControl(x.name,
          new FormControl(x.value || '', x.required ? Validators.required : null));
      }
    });
  }
  ngDistroy(): void {
    this.unsubcribe();
  }
}
