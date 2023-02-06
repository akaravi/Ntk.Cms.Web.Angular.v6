import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  CoreModuleEntityService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { CoreSharedModule } from '../core.shared.module';
import { CoreModuleModule } from '../module/coreModule.module';
import { CoreModuleEntityComponent } from './core-module-entity.component';
import { CoreModuleEntityRouting } from './core-module-entity.routing';
import { CoreModuleEntityEditComponent } from './edit/edit.component';
import { CoreModuleEntityListComponent } from './list/list.component';
import { CoreModuleEntitySelectorComponent } from './selector/selector.component';


@NgModule({
  declarations: [
    CoreModuleEntityComponent,
    CoreModuleEntityEditComponent,
    CoreModuleEntityListComponent,
    CoreModuleEntitySelectorComponent,
  ],
  exports: [
    CoreModuleEntityComponent,
    CoreModuleEntityEditComponent,
    CoreModuleEntityListComponent,
    CoreModuleEntitySelectorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreModuleEntityRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
    CoreModuleModule,

    CoreSharedModule,
  ],
  providers: [
    CoreModuleEntityService,
  ]
})
export class CoreModuleEntityModule {
}
