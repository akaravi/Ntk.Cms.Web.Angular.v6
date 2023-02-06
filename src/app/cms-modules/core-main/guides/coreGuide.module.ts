import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreGuideService, CoreModuleService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { CoreGuideAddComponent } from './add/add.component';
import { CoreGuideComponent } from './coreGuide.component';
import { CoreGuideRouting } from './coreGuide.routing';
import { CoreGuideEditComponent } from './edit/edit.component';
import { CoreGuideSelectorComponent } from './selector/selector.component';
import { CoreGuideTreeComponent } from './tree/tree.component';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CoreInfoComponent } from '../site/info/core-info.component';
import { CoreGuideListComponent } from './list/list.component';


@NgModule({
  declarations: [
    CoreGuideComponent,
    CoreGuideListComponent,
    CoreGuideAddComponent,
    CoreGuideEditComponent,
    CoreGuideSelectorComponent,
    CoreGuideTreeComponent,
    CoreInfoComponent,
  ],
  exports: [
    CoreGuideComponent,
    CoreGuideListComponent,
    CoreGuideAddComponent,
    CoreGuideEditComponent,
    CoreGuideSelectorComponent,
    CoreGuideTreeComponent,
    CoreInfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreGuideRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,

    InlineSVGModule,

    // CmsFileManagerModule,
    DragDropModule,
  ],
  providers: [
    CoreGuideService,
    CoreModuleService,
  ]
})
export class CoreGuideCmsModule {
}
