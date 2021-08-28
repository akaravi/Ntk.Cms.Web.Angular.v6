import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CmsAuthGuard } from './core/services/cmsAuthGuard.service';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./cms-modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: '',
    canActivate: [CmsAuthGuard],
    loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouting { }
