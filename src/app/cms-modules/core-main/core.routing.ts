import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { CoreConfigSiteComponent } from './config/site/configSite.component';
import { CoreComponent } from './core.component';



const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: CoreConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: CoreConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: CoreConfigSiteComponent
      },
      /*Config*/
      {
        path: 'user',
        loadChildren: () =>
          import('./user/coreUser.module').then((m) => m.CoreUserModule),
      },
      {
        path: 'usergroup',
        loadChildren: () =>
          import('./user-group/coreUserGroup.module').then((m) => m.CoreUserGroupCmsModule),
      },
       {
        path: 'currency',
        loadChildren: () =>
          import('./currency/coreCurrency.module').then((m) => m.CoreCurrencyCmsModule),
      },
      {
        path: 'site',
        loadChildren: () =>
          import('./site/coreSite.module').then((m) => m.CoreSiteModule),
      },
      {
        path: 'sitecategory',
        loadChildren: () =>
          import('./site-category/coreSiteCategory.module').then((m) => m.CoreSiteCategoryCmsModule),
      },
      {
        path: 'sitecategorymodule',
        loadChildren: () =>
          import('./site-category-module/coreSiteCategoryCmsModule.module').then((m) => m.CoreSiteCategoryCmsModuleModule),
      },
      {
        path: 'sitedomainalias',
        loadChildren: () =>
          import('./site-domain-alias/coreSiteDomainAlias.module').then((m) => m.CoreSiteDomainAliasModule),
      },
      {
        path: 'cpmainmenu',
        loadChildren: () =>
          import('./cp-main-menu/coreCpMainMenu.module').then((m) => m.CoreCpMainMenu),
      },
      {
        path: 'module',
        loadChildren: () =>
          import('./module/coreModule.module').then((m) => m.CoreModuleModule),
      },
      {
        path: 'modulesale',
        loadChildren: () =>
          import('./module-sale/core-module-sale.module').then((m) => m.CoreModuleSaleModule),
      },
      {
        path: 'userclaim',
        loadChildren: () =>
          import('./user-claim/core-user-claim.module').then((m) => m.CoreUserClaimModule),
      },
      {
        path: 'location',
        loadChildren: () =>
          import('./location/coreLocation.module').then((m) => m.CoreLocationCmsModule),
      },
      {
        path: 'device',
        loadChildren: () =>
          import('./device/coreDevice.module').then((m) => m.CoreDeviceModule),
      },
      {
        path: 'guide',
        loadChildren: () =>
          import('./guides/coreGuide.module').then((m) => m.CoreGuideCmsModule),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutes {
}
