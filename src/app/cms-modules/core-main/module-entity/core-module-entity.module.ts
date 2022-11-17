import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModuleEntityRouting } from './core-module-entity.routing';
import { CoreModuleEntityComponent } from './core-module-entity.component';
import {
  CoreModuleEntityService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CoreSharedModule } from '../core.shared.module';
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
    
    CoreSharedModule,
  ],
  providers: [
    CoreModuleEntityService,
  ]
})
export class CoreModuleEntityModule {
}
