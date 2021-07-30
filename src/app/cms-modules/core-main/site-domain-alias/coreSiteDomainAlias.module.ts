import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreSiteDomainAliasRouting } from './coreSiteDomainAlias.routing';
import { CoreSiteDomainAliasComponent } from './coreSiteDomainAlias.component';
import {
  CoreModuleService,
  CoreSiteDomainAliasService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreSiteDomainAliasSelectorComponent } from './selector/selector.component';
import { CoreSiteDomainAliasEditComponent } from './edit/edit.component';
import { CoreSiteDomainAliasAddComponent } from './add/add.component';
import { CoreSiteDomainAliasListComponent } from './list/list.component';
import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
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
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
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
