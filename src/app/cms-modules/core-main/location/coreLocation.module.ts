import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreLocationRouting } from './coreLocation.routing';
import { CoreLocationComponent } from './coreLocation.component';
import {
  CoreModuleService,
  CoreLocationService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreLocationTreeComponent } from './tree/tree.component';
import { CoreLocationSelectorComponent } from './selector/selector.component';
import { CoreLocationEditComponent } from './edit/edit.component';
import { CoreLocationAddComponent } from './add/add.component';
import { CoreLocationListComponent } from './list/list.component';
import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';


@NgModule({
  declarations: [
    CoreLocationComponent,
    CoreLocationListComponent,
    CoreLocationAddComponent,
    CoreLocationEditComponent,
    CoreLocationSelectorComponent,
    CoreLocationTreeComponent,
  ],
  exports: [
    CoreLocationComponent,
    CoreLocationListComponent,
    CoreLocationAddComponent,
    CoreLocationEditComponent,
    CoreLocationSelectorComponent,
    CoreLocationTreeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreLocationRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    // CmsFileManagerModule

  ],
  providers: [
    CoreLocationService,
    CoreModuleService,
    CmsConfirmationDialogService
  ]
})
export class CoreLocationCmsModule {
}
