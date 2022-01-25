import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HyperShopComponent } from './hyperShop.component';
import { HyperShopRoutes } from './hyperShop.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CmsFileManagerModule } from 'src/filemanager-api';
import {
   CoreAuthService,
  CoreEnumService,
  CoreModuleTagService,
  HyperShopConfigurationService,
  HyperShopCategoryService,
  HyperShopContentService,
  CoreModuleService
} from 'ntk-cms-api';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { HyperShopConfigMainAdminComponent } from './config/main-admin/config-main-admin.component';
import { HyperShopConfigSiteComponent } from './config/site/config-site.component';
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
    
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
  ],
  providers: [
    CoreModuleService,
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
