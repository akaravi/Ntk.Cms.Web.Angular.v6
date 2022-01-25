import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModuleService, CoreSiteService } from 'ntk-cms-api';
import { CoreSiteHeaderComponent } from './site/header/header.component';
import { CoreModuleHeaderComponent } from './module/header/header.component';
import { SharedModule } from 'src/app/shared.module';

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
