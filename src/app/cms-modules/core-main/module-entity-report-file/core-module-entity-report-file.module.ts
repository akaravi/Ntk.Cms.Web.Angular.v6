import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CoreModuleEntityReportFileService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CoreSharedModule } from '../core.shared.module';
import { CoreModuleEntityReportFileEditComponent } from './edit/edit.component';
import { CoreModuleEntityReportFileListComponent } from './list/list.component';
import { CoreModuleEntityReportFileComponent } from './core-module-entity-report-file.component';
import { CoreModuleEntityReportFileRouting } from './core-module-entity-report-file.routing';
import { CoreModuleEntityModule } from '../module-entity/core-module-entity.module';
import { CoreModuleEntityReportFileAddComponent } from './add/add.component';


@NgModule({
  declarations: [
    CoreModuleEntityReportFileComponent,
    CoreModuleEntityReportFileAddComponent,
    CoreModuleEntityReportFileEditComponent,
    CoreModuleEntityReportFileListComponent,
  ],
  exports: [
    CoreModuleEntityReportFileComponent,
    CoreModuleEntityReportFileAddComponent,
    CoreModuleEntityReportFileEditComponent,
    CoreModuleEntityReportFileListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreModuleEntityReportFileRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
    
    CoreSharedModule,
    CoreModuleEntityModule,
  ],
  providers: [
    CoreModuleEntityReportFileService,
  ]
})
export class CoreModuleEntityReportFileModule {
}
