import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreModuleService,
  CoreUserSupportAccessService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { CoreModuleEntityModule } from '../module-entity/core-module-entity.module';
import { CoreUserSupportAccessAddComponent } from './add/add.component';
import { CoreUserSupportAccessComponent } from './core-user-support-access.component';
import { CoreUserSupportAccessRouting } from './core-user-support-access.routing';
import { CoreUserSupportAccessEditComponent } from './edit/edit.component';
import { CoreUserSupportAccessListComponent } from './list/list.component';

@NgModule({
  declarations: [
    CoreUserSupportAccessComponent,
    CoreUserSupportAccessListComponent,
    CoreUserSupportAccessAddComponent,
    CoreUserSupportAccessEditComponent,
  ],
  exports: [
    CoreUserSupportAccessComponent,
    CoreUserSupportAccessListComponent,
    CoreUserSupportAccessAddComponent,
    CoreUserSupportAccessEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreUserSupportAccessRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    CoreModuleEntityModule,
  ],
  providers: [
    CoreUserSupportAccessService,
    CoreModuleService,
  ]
})
export class CoreUserSupportAccessCmsModule {
}
