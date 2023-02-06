import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreAuthService, CoreConfigurationService, CoreModuleService } from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth.routing';
import { AuthForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthSingInBySmsComponent } from './singin-bysms/singin-bysms.component';
import { AuthSingInComponent } from './singin/singin.component';
import { AuthSingoutComponent } from './singout/singout.component';
import { AuthSingUpComponent } from './singup/singup.component';
import { SingupRuleComponent } from './singupRule/singupRule.Component';
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
    SharedModule.forRoot(),
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    CoreModuleService,
    CoreConfigurationService,
    CoreAuthService
  ]
})
export class AuthModule { }