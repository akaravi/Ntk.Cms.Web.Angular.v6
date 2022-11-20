import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreEnumService, SmsMainApiPathService, SmsMainApiNumberService } from 'ntk-cms-api';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
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
