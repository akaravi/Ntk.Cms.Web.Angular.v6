import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// components
import { CheckBoxComponent } from './atoms/checkbox';
import { DropDownComponent } from './atoms/dropdown';
import { FileComponent } from './atoms/file';
import { RadioComponent } from './atoms/radio';
import { TextBoxComponent } from './atoms/textbox';
import { DynamicFormBuilderCmsComponent } from './dynamic-form-builder-cms.component';
import { DynamicFormBuilderComponent } from './dynamic-form-builder.component';
import { FieldBuilderComponent } from './field-builder/field-builder.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DynamicFormBuilderComponent,
    DynamicFormBuilderCmsComponent,
    FieldBuilderComponent,
    TextBoxComponent,
    DropDownComponent,
    CheckBoxComponent,
    FileComponent,
    RadioComponent
  ],
  exports: [
    DynamicFormBuilderComponent,
    DynamicFormBuilderCmsComponent
  ],
  providers: []
})
export class DynamicFormBuilderModule { }
