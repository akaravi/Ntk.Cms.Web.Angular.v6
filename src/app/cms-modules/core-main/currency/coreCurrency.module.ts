import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCurrencyRouting } from './coreCurrency.routing';
import { CoreCurrencyComponent } from './coreCurrency.component';
import {
  CoreModuleService,
  CoreCurrencyService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreCurrencySelectorComponent } from './selector/selector.component';
import { CoreCurrencyEditComponent } from './edit/edit.component';
import { CoreCurrencyAddComponent } from './add/add.component';
import { CoreCurrencyListComponent } from './list/list.component';
import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';


@NgModule({
  declarations: [
    CoreCurrencyComponent,
    CoreCurrencyListComponent,
    CoreCurrencyAddComponent,
    CoreCurrencyEditComponent,
    CoreCurrencySelectorComponent,
  ],
  exports: [
    CoreCurrencyComponent,
    CoreCurrencyListComponent,
    CoreCurrencyAddComponent,
    CoreCurrencyEditComponent,
    CoreCurrencySelectorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreCurrencyRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule

  ],
  providers: [
    CoreCurrencyService,
    CoreModuleService,
  ]
})
export class CoreCurrencyCmsModule {
}
