import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// https://stackblitz.com/edit/angular-dynamic-form-builder-9nybhu?file=app%2Fapp.component.html
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dynamic-form-builder',
  template: `
    <!-- <form [formGroup]="formGroup" class="form-horizontal"> -->
      <div *ngFor="let field of fields">
          <field-builder [field]="field" [formGroup]="formGroup"></field-builder>
      </div>
      <!-- <div class="form-row"></div>
      <div class="form-group row">
        <div class="col-md-3"></div>
        <div class="col-md-9">
          <button type="submit" [disabled]="!formGroup.valid" class="btn btn-primary">Save</button>
          <strong >Saved all values</strong>
        </div>
      </div>
    </form> -->
  `,
})
export class DynamicFormBuilderComponent implements OnInit {
  // @Output() onSubmit = new EventEmitter();
  @Input() fields: any[] = [];
  @Input() formGroup: FormGroup;
  constructor() { }

  ngOnInit(): void {
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
    // let fieldsCtrls = {};
    // for (let f of this.fields) {
    //   if (f.type != 'checkbox') {
    //     fieldsCtrls[f.name] = new FormControl(f.value || '', Validators.required)
    //   } else {
    //     let opts = {};
    //     for (let opt of f.options) {
    //       opts[opt.key] = new FormControl(opt.value);
    //     }
    //     fieldsCtrls[f.name] = new FormGroup(opts)
    //   }
    // }
    // this.formGroup = new FormGroup(fieldsCtrls);
  }
}
