import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModuleComponent } from './coreModule.component';
import { CoreModuleSiteCreditChargeComponent } from './site-credit/charge/charge.component';
import { CoreModuleSiteCreditListComponent } from './site-credit/list/list.component';
import { CoreModuleSiteUserCreditChargeComponent } from './site-user-credit/charge/charge.component';
import { CoreModuleSiteUserCreditListComponent } from './site-user-credit/list/list.component';
import { CoreModuleTagListComponent } from './tag/list/list.component';


const routes: Routes = [
  {
    path: '',
    component: CoreModuleComponent,
    children: [
      {
        path: 'tag',
        component: CoreModuleTagListComponent
      },
      {
        path: 'site-credit',
        component: CoreModuleSiteCreditListComponent
      },
      {
        path: 'site-credit-charge/:LinkModuleId',
        component: CoreModuleSiteCreditChargeComponent
      },
      {
        path: 'site-user-credit',
        component: CoreModuleSiteUserCreditListComponent
      },
      {
        path: 'site-user-credit-charge/:LinkModuleId',
        component: CoreModuleSiteUserCreditChargeComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreModuleRoutes {
}
