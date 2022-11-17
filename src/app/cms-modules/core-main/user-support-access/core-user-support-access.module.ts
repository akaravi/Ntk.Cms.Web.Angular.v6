import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreUserSupportAccessRouting } from './core-user-support-access.routing';
import { CoreUserSupportAccessComponent } from './core-user-support-access.component';
import {
  CoreModuleEntityModel,
  CoreModuleService,
  CoreUserSupportAccessService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { CoreUserSupportAccessEditComponent } from './edit/edit.component';
import { CoreUserSupportAccessAddComponent } from './add/add.component';
import { CoreUserSupportAccessListComponent } from './list/list.component';
import { CoreModuleEntityModule } from '../module-entity/core-module-entity.module';

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
