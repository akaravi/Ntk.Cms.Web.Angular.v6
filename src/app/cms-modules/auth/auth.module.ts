import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth.routing';
import { AuthSingInComponent } from './singin/singin.component';

import { AuthForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthSingoutComponent } from './singout/singout.component';
import { AuthComponent } from './auth.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthSingUpComponent } from './singup/singup.component';
import { SingupRuleComponent } from './singupRule/singupRule.Component';
import { AuthSingInBySmsComponent } from './singin-bysms/singin-bysms.component';

@NgModule({
  declarations: [
    AuthSingInComponent,
    AuthSingInBySmsComponent,
    AuthSingUpComponent,
    AuthForgotPasswordComponent,
    AuthSingoutComponent,
    AuthComponent,
    SingupRuleComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class AuthModule { }
