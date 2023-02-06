import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core.component';



const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      /* Config */
      {
        path: 'config',
        loadChildren: () =>
          import('./config/core-config.module').then((m) => m.CoreConfigModule),
      },
      /* Config */
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
        path: 'user-support-access',
        loadChildren: () =>
          import('./user-support-access/core-user-support-access.module').then((m) => m.CoreUserSupportAccessCmsModule),
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
        path: 'module-entity',
        loadChildren: () =>
          import('./module-entity/core-module-entity.module').then((m) => m.CoreModuleEntityModule),
      },
      {
        path: 'module-entity-report-file',
        loadChildren: () =>
          import('./module-entity-report-file/core-module-entity-report-file.module').then((m) => m.CoreModuleEntityReportFileModule),
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
      }

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutes {
}
