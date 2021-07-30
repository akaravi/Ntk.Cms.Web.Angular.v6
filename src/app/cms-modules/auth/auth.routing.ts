import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthComponent} from './auth.component';
import {AuthSingUpComponent} from './singup/singup.component';
import {AuthForgotPasswordComponent} from './forgot-password/forgot-password.component';
import { AuthSingoutComponent } from './singout/singout.component';
import { AuthSingInComponent } from './singin/singin.component';
import { AuthSingInBySmsComponent } from './singin-bysms/singin-bysms.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'singin',
        component: AuthSingInComponent,
      },
      {
        path: 'singinbysms',
        component: AuthSingInBySmsComponent,
      },
      {
        path: 'singout',
        component: AuthSingoutComponent,
      },
      {
        path: 'singup',
        component: AuthSingUpComponent
      },
      {
        path: 'forgot-password',
        component: AuthForgotPasswordComponent
      },
      {path: '', redirectTo: 'singin', pathMatch: 'full'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
