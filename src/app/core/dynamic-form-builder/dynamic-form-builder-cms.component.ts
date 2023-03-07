import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  GetPropertiesInfoModel
} from 'ntk-cms-api';
import { debounceTime } from 'rxjs/operators';
// https://stackblitz.com/edit/angular-dynamic-form-builder-9nybhu?file=app%2Fapp.component.html
@Component({
  // tslint:disable-next-line: component-selector
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
      this.privateJsonValue = JSON.parse(model);
      this.actionSetValue();
    }
  }
  privatePropertiesInfos: GetPropertiesInfoModel[] = [];
  privateJsonValue: any;
  @Input() set propertiesInfos(model: GetPropertiesInfoModel[]) {
    this.privatePropertiesInfos = model;
    this.actionFormMake();
    this.actionSetValue();
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
            if ((update[x.fieldName] || update[x.fieldName] === '')) {
              // if (this.formValues && (this.formValues[x.fieldName] || this.formValues[x.fieldName] == '')) {
              //   this.formValues[x.fieldName] = update[x.fieldName];
              //   this.jsonValueChange.emit(JSON.stringify(this.formValues));
              // }
              this.formValues[x.fieldName] = update[x.fieldName];
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
        if (this.formValues && this.formValues[x.fieldName]) {
          fValue = this.formValues[x.fieldName];
        }



        switch (x.fieldTypeString) {
          case 'System.String':
            this.fields.push({
              type: 'text',
              name: x.fieldName,
              label: x.fieldTitle,
              value: fValue,
              required: false,
            });
            break;
          case 'System.Int64':
            this.fields.push({
              type: 'text',
              name: x.fieldName,
              label: x.fieldTitle,
              value: fValue,
              required: false,
            });
            break;
          case 'System.Int32':
            this.fields.push({
              type: 'text',
              name: x.fieldName,
              label: x.fieldTitle,
              value: fValue,
              required: false,
            });
            break;
          default:
            this.fields.push({
              type: 'text',
              name: x.fieldName,
              label: x.fieldTitle,
              value: fValue,
              required: false,
            });
            break;
        }
      });
    }
    this.fields.forEach(x => {
      if (x.type === 'checkbox') {
        this.formGroup.addControl(x.name, new FormGroup({}));
        x.options.forEach(o => {
          (this.formGroup.get(x.name) as FormGroup).addControl(o.key, new FormControl(false));
        });
      }
      else {
        this.formGroup.addControl(x.name,
          new FormControl(x.value || '', x.required ? Validators.required : null));
      }
    });
  }
  actionSetValue(): void {
    if (this.privateJsonValue && this.privatePropertiesInfos && this.privatePropertiesInfos.length > 0) {
      this.privatePropertiesInfos.forEach(x => {
        if (!this.formValues) {
          this.formValues = {};
        }
        if (this.privateJsonValue[x.fieldName]) {
          this.formValues[x.fieldName] = this.privateJsonValue[x.fieldName];
        } else {
          this.formValues[x.fieldName] = '';
        }
        if (this.formValues[x.fieldName] && this.fields.findIndex(y => y.name === x.fieldName) >= 0) {
          const val = this.formValues[x.fieldName];
          this.fields.find(y => y.name === x.fieldName).value = val;
          this.formGroup.get(x.fieldName).setValue(val, { emitEvent: false });
        }
      });
    }
  }
  ngDistroy(): void {
    this.unsubcribe();
  }
}
