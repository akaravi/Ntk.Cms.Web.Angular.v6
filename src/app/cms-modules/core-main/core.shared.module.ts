import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModuleService, CoreSiteService } from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { CoreModuleHeaderComponent } from './module/header/header.component';
import { CoreSiteHeaderComponent } from './site/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
  ],
  declarations: [
    CoreSiteHeaderComponent,
    CoreModuleHeaderComponent,
  ],
  exports: [
    CoreSiteHeaderComponent,
    CoreModuleHeaderComponent,
  ],
  providers: [
    CoreSiteService,
    CoreModuleService,

  ]
})
export class CoreSharedModule { }
