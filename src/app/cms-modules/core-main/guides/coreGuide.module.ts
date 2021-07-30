import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreGuideRouting } from './coreGuide.routing';
import { CoreGuideComponent } from './coreGuide.component';
import {
  CoreModuleService,
  CoreGuideService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreGuideTreeComponent } from './tree/tree.component';
import { CoreGuideSelectorComponent } from './selector/selector.component';
import { CoreGuideEditComponent } from './edit/edit.component';
import { CoreGuideAddComponent } from './add/add.component';
import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CoreGuideListComponent } from './list/list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    CoreGuideComponent,
    CoreGuideListComponent,
    CoreGuideAddComponent,
    CoreGuideEditComponent,
    CoreGuideSelectorComponent,
    CoreGuideTreeComponent,
  ],
  exports: [
    CoreGuideComponent,
    CoreGuideListComponent,
    CoreGuideAddComponent,
    CoreGuideEditComponent,
    CoreGuideSelectorComponent,
    CoreGuideTreeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreGuideRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    // CmsFileManagerModule
    DragDropModule
  ],
  providers: [
    CoreGuideService,
    CoreModuleService,
  ]
})
export class CoreGuideCmsModule {
}
