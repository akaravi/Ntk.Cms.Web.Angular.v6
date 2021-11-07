import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  GetPropertiesInfoModel,
} from 'ntk-cms-api';
import { debounceTime } from 'rxjs/operators';
// https://stackblitz.com/edit/angular-dynamic-form-builder-9nybhu?file=app%2Fapp.component.html
@Component({
  selector: 'dynamic-form-builder-cms',
  template: `
      <div *ngFor="let field of fields">
          <field-builder [field]="field" [formGroup]="formGroup"></field-builder>
      </div>
  `,
})
export class DynamicFormBuilderCmsComponent implements OnInit, AfterViewInit {

  @Output() jsonValueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() set jsonValue(model: string) {
    if (model && model.length > 0) {
      const values = JSON.parse(model);
      if (values && this.privatePropertiesInfos && this.privatePropertiesInfos.length > 0) {
        this.privatePropertiesInfos.forEach(x => {
          if (!this.formValues) {
            this.formValues = {};
          }
          if (values[x.FieldName]) {
            this.formValues[x.FieldName] = values[x.FieldName];
          } else {
            this.formValues[x.FieldName] = '';
          }
          if (this.formValues[x.FieldName] && this.fields.findIndex(y => y.name === x.FieldName) >= 0) {
            const val = this.formValues[x.FieldName];
            this.fields.find(y => y.name === x.FieldName).value = val;
            this.formGroup.get(x.FieldName).setValue(val, { emitEvent: false });
          }
        });
      }
    }
  }
  privatePropertiesInfos: GetPropertiesInfoModel[] = [];
  @Input() set propertiesInfos(model: GetPropertiesInfoModel[]) {
    this.privatePropertiesInfos = model;
    this.actionFormMake();
  }
  formValues = {};


  @Input() formGroup: FormGroup;
  fields: any[] = [];
  unsubcribe: any;
  constructor() {

  }
  private DEBOUNCE_TIME_FORM_INPUT = 250;
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.unsubcribe = this.formGroup.valueChanges
    .pipe(debounceTime(this.DEBOUNCE_TIME_FORM_INPUT)) // Debounce time optional
    .subscribe((update) => {
      if (!this.formValues) {
        this.formValues = {};
      }
      if (this.privatePropertiesInfos && this.privatePropertiesInfos.length > 0) {
        this.privatePropertiesInfos.forEach(x => {
          if ((update[x.FieldName] || update[x.FieldName] === '')) {
            // if (this.formValues && (this.formValues[x.FieldName] || this.formValues[x.FieldName] == '')) {
            //   this.formValues[x.FieldName] = update[x.FieldName];
            //   this.jsonValueChange.emit(JSON.stringify(this.formValues));
            // }
            this.formValues[x.FieldName] = update[x.FieldName];
          }
          this.jsonValueChange.emit(JSON.stringify(this.formValues));
        });
      }

    });
  }
  actionFormMake() {
    if (this.privatePropertiesInfos) {
      this.fields = [];
      this.privatePropertiesInfos.forEach(x => {
        let fValue = '';
        if (this.formValues && this.formValues[x.FieldName]) {
          fValue = this.formValues[x.FieldName];
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
    }
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
