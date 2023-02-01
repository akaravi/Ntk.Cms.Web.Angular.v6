import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HyperShopComponent } from './hyper-shop.component';
import { HyperShopRoutes } from './hyper-shop.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from 'src/app/shared.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import {
  CoreAuthService,
  CoreEnumService, CoreModuleService, CoreModuleTagService, HyperShopCategoryService, HyperShopConfigurationService, HyperShopContentService
} from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
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
