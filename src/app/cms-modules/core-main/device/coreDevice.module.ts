import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreDeviceRouting } from './coreDevice.routing';
import { CoreDeviceComponent } from './coreDevice.component';
import {
  CoreModuleService,
  CoreDeviceService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreDeviceTreeComponent } from './tree/tree.component';
import { CoreDeviceSelectorComponent } from './selector/selector.component';
import { CoreDeviceEditComponent } from './edit/edit.component';
import { CoreDeviceAddComponent } from './add/add.component';
import { CoreDeviceListComponent } from './list/list.component';
import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';


@NgModule({
  declarations: [
    CoreDeviceComponent,
    CoreDeviceListComponent,
    CoreDeviceAddComponent,
    CoreDeviceEditComponent,
    CoreDeviceSelectorComponent,
    CoreDeviceTreeComponent,
  ],
  exports: [
    CoreDeviceComponent,
    CoreDeviceListComponent,
    CoreDeviceAddComponent,
    CoreDeviceEditComponent,
    CoreDeviceSelectorComponent,
    CoreDeviceTreeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreDeviceRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    // CmsFileManagerModule

  ],
  providers: [
    CoreDeviceService,
    CoreModuleService,
  ]
})
export class CoreDeviceModule {
}
