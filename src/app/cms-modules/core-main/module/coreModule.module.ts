import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModuleRouting } from './coreModule.routing';
import { CoreModuleComponent } from './coreModule.component';
import {
  CoreModuleService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { CoreModuleTreeComponent } from './tree/tree.component';
import { CoreModuleSelectorComponent } from './selector/selector.component';
import { CoreModuleEditComponent } from './edit/edit.component';
import { CoreModuleAddComponent } from './add/add.component';
import { CoreModuleListComponent } from './list/list.component';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { CoreModuleSelectionlistComponent } from './selectionlist/selectionlist.component';
import { CoreModuleHeaderComponent } from './header/header.component';
import { CoreSharedModule } from '../core.shared.module';


@NgModule({
  declarations: [
    CoreModuleComponent,
    CoreModuleListComponent,
    CoreModuleAddComponent,
    CoreModuleEditComponent,
    CoreModuleSelectorComponent,
    CoreModuleTreeComponent,
    CoreModuleSelectionlistComponent,
  ],
  exports: [
    CoreModuleComponent,
    CoreModuleListComponent,
    CoreModuleAddComponent,
    CoreModuleEditComponent,
    CoreModuleSelectorComponent,
    CoreModuleTreeComponent,
    CoreModuleSelectionlistComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreModuleRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
    
    CoreSharedModule,
  ],
  providers: [
    CoreModuleService,
  ]
})
export class CoreModuleModule {
}
