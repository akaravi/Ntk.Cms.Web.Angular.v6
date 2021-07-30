import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HyperShopComponent } from './hyperShop.component';
import { HyperShopRoutes } from './hyperShop.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import {
   CoreAuthService,
  CoreEnumService,
  CoreModuleTagService,
  HyperShopConfigurationService,
  HyperShopCategoryService,
  HyperShopContentService
} from 'ntk-cms-api';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { HyperShopConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { HyperShopConfigSiteComponent } from './config/site/configSite.component';
import { HyperShopCategoryAddComponent } from './category/add/add.component';
import { HyperShopCategoryEditComponent } from './category/edit/edit.component';
import { HyperShopCategoryListComponent } from './category/list/list.component';
import { HyperShopCategorySelectorComponent } from './category/selector/selector.component';
import { HyperShopCategoryTreeComponent } from './category/tree/tree.component';
import { HyperShopContentAddComponent } from './content/add/add.component';
import { HyperShopContentEditComponent } from './content/edit/edit.component';
import { HyperShopContentListComponent } from './content/list/list.component';
import { HyperShopContentViewComponent } from './content/view/view.component';

@NgModule({
  declarations: [
    HyperShopComponent,
    /*Config*/
    HyperShopConfigMainAdminComponent,
    HyperShopConfigSiteComponent,
    /*Config*/
    /* */
    HyperShopCategoryAddComponent,
    HyperShopCategoryEditComponent,
    HyperShopCategoryListComponent,
    HyperShopCategorySelectorComponent,
    HyperShopCategoryTreeComponent,
    /* */
    HyperShopContentAddComponent,
    HyperShopContentEditComponent,
    HyperShopContentListComponent,
    HyperShopContentViewComponent,
  ],
  imports: [
    CommonModule,
    HyperShopRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule,
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
  ],
  providers: [
    CoreEnumService,
    CoreAuthService,
    /*Config*/
    HyperShopConfigurationService,
    /*Config*/
    HyperShopCategoryService,
    HyperShopContentService,
    CmsConfirmationDialogService,
    CoreModuleTagService,

  ]
})
export class HyperShopModule { }
