import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreSiteCategoryRouting } from './coreSiteCategory.routing';
import { CoreSiteCategoryComponent } from './coreSiteCategory.component';
import {
  CoreModuleService,
  CoreSiteCategoryCmsModuleService,
  CoreSiteCategoryService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { CoreSiteCategoryTreeComponent } from './tree/tree.component';
import { CoreSiteCategorySelectorComponent } from './selector/selector.component';
import { CoreSiteCategoryEditComponent } from './edit/edit.component';
import { CoreSiteCategoryAddComponent } from './add/add.component';
import { CoreSiteCategoryListComponent } from './list/list.component';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { CoreModuleModule } from '../module/coreModule.module';
// import { CoreSiteCategoryCmsModuleListComponent } from './moduleList/moduleList.component';

@NgModule({
  declarations: [
    CoreSiteCategoryComponent,
    CoreSiteCategoryListComponent,
    CoreSiteCategoryAddComponent,
    CoreSiteCategoryEditComponent,
    CoreSiteCategorySelectorComponent,
    CoreSiteCategoryTreeComponent,
    // CoreSiteCategoryCmsModuleListComponent,
  ],
  exports: [
    CoreSiteCategoryComponent,
    CoreSiteCategoryListComponent,
    CoreSiteCategoryAddComponent,
    CoreSiteCategoryEditComponent,
    CoreSiteCategorySelectorComponent,
    CoreSiteCategoryTreeComponent,
    // CoreSiteCategoryCmsModuleListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreSiteCategoryRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
    
    CoreModuleModule,
  ],
  providers: [
    CoreSiteCategoryService,
    CoreSiteCategoryCmsModuleService,
    CoreModuleService,
    CoreSiteCategoryCmsModuleService,
  ]
})
export class CoreSiteCategoryCmsModule {
}
