import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/shared/shared.module';
import { SmsMainApiPathSelectorComponent } from './main/api-path/selector/selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreEnumService, SmsMainApiPathService, SmsMainCustomerNumberService } from 'ntk-cms-api';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SmsMainCustomerNumberSelectorComponent } from './main/customer-number/selector/selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    NgxMaterialTimepickerModule,
  ],
  declarations: [
    SmsMainApiPathSelectorComponent,
    SmsMainCustomerNumberSelectorComponent,
  ],
  exports: [
    SmsMainApiPathSelectorComponent,
    SmsMainCustomerNumberSelectorComponent,
  ],
  providers: [
    CoreEnumService,
    SmsMainApiPathService,
    SmsMainCustomerNumberService,

  
  ]
})
export class SmsSharedModule { }
