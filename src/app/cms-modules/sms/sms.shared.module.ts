import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CoreEnumService } from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { SmsMainApiPathTreeComponent } from './main/api-path/tree/tree.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    NgxMaterialTimepickerModule,
  ],
  declarations: [
    SmsMainApiPathTreeComponent,
  ],
  exports: [
    SmsMainApiPathTreeComponent,
  ],
  providers: [
    CoreEnumService,
  ]
})
export class SmsSharedModule { }
