import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreLocationRouting } from './coreLocation.routing';
import { CoreLocationComponent } from './coreLocation.component';
import {
  CoreModuleService,
  CoreLocationService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { CoreLocationTreeComponent } from './tree/tree.component';
import { CoreLocationSelectorComponent } from './selector/selector.component';
import { CoreLocationEditComponent } from './edit/edit.component';
import { CoreLocationAddComponent } from './add/add.component';
import { CoreLocationListComponent } from './list/list.component';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CoreLocationAddBulkComponent } from './add-bulk/add-bulk.component';


@NgModule({
  declarations: [
    CoreLocationComponent,
    CoreLocationListComponent,
    CoreLocationAddComponent,
    CoreLocationAddBulkComponent,
    CoreLocationEditComponent,
    CoreLocationSelectorComponent,
    CoreLocationTreeComponent,
  ],
  exports: [
    CoreLocationComponent,
    CoreLocationListComponent,
    CoreLocationAddComponent,
    CoreLocationAddBulkComponent,
    CoreLocationEditComponent,
    CoreLocationSelectorComponent,
    CoreLocationTreeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreLocationRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
    
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
