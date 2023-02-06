import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreModuleService,
  CoreSiteDomainAliasService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { CoreSiteDomainAliasAddComponent } from './add/add.component';
import { CoreSiteDomainAliasComponent } from './coreSiteDomainAlias.component';
import { CoreSiteDomainAliasRouting } from './coreSiteDomainAlias.routing';
import { CoreSiteDomainAliasEditComponent } from './edit/edit.component';
import { CoreSiteDomainAliasListComponent } from './list/list.component';
import { CoreSiteDomainAliasSelectorComponent } from './selector/selector.component';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CoreSiteModule } from '../site/coreSite.module';


@NgModule({
  declarations: [
    CoreSiteDomainAliasComponent,
    CoreSiteDomainAliasListComponent,
    CoreSiteDomainAliasAddComponent,
    CoreSiteDomainAliasEditComponent,
    CoreSiteDomainAliasSelectorComponent,
  ],
  exports: [
    CoreSiteDomainAliasComponent,
    CoreSiteDomainAliasListComponent,
    CoreSiteDomainAliasAddComponent,
    CoreSiteDomainAliasEditComponent,
    CoreSiteDomainAliasSelectorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreSiteDomainAliasRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule.forRoot(),
    AngularEditorModule,

    CoreSiteModule

  ],
  providers: [
    CoreSiteDomainAliasService,
    CoreModuleService,
    CmsConfirmationDialogService
  ]
})
export class CoreSiteDomainAliasModule {
}
