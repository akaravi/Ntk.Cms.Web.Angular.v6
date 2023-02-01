import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from 'src/app/shared.module';
import { WebDesignerComponent } from './web-designer.component';
import { WebDesignerRoutes } from './web-designer.routing';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { ColorPickerModule } from 'ngx-color-picker';
import { IconPickerModule } from 'ngx-icon-picker';
import {
  CoreAuthService,
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  CoreSiteCategoryService,
  WebDesignerEnumService,
  WebDesignerLogMemberInfoService,
  WebDesignerLogPageSafeService,
  WebDesignerMainIntroService,
  WebDesignerMainMenuService,
  WebDesignerMainPageDependencyService,
  WebDesignerMainPageService,
  WebDesignerMainPageTemplateService,
  WebDesignerMainPageTemplateSiteCategoryService
} from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CoreModuleModule } from '../core-main/module/coreModule.module';
import { WebDesignerMainIntroAddComponent } from './intro/add/add.component';
import { WebDesignerMainIntroEditComponent } from './intro/edit/edit.component';
import { WebDesignerMainIntroListComponent } from './intro/list/list.component';
import { WebDesignerLogMemberInfoListComponent } from './log-member-info/list/list.component';
import { WebDesignerLogMemberInfoSelectorComponent } from './log-member-info/selector/selector.component';
import { WebDesignerLogMemberInfoViewComponent } from './log-member-info/view/view.component';
import { WebDesignerMainMenuAddComponent } from './menu/add/add.component';
import { WebDesignerMainMenuEditComponent } from './menu/edit/edit.component';
import { WebDesignerMainMenuListComponent } from './menu/list/list.component';
import { WebDesignerMainMenuSelectorComponent } from './menu/selector/selector.component';
import { WebDesignerMainMenuTreeComponent } from './menu/tree/tree.component';
import { WebDesignerMainPageDependencyAddComponent } from './page-dependency/add/add.component';
import { WebDesignerMainPageDependencyAutoAddPageComponent } from './page-dependency/auto-add-page/auto-add-page.component';
import { WebDesignerMainPageDependencyEditComponent } from './page-dependency/edit/edit.component';
import { WebDesignerMainPageDependencyHeaderComponent } from './page-dependency/header/header.component';
import { WebDesignerMainPageDependencyListComponent } from './page-dependency/list/list.component';
import { WebDesignerMainPageDependencySelectorComponent } from './page-dependency/selector/selector.component';
import { WebDesignerMainPageDependencyTreeComponent } from './page-dependency/tree/tree.component';
import { WebDesignerMainPageTemplateAddComponent } from './page-template/add/add.component';
import { WebDesignerMainPageTemplateEditComponent } from './page-template/edit/edit.component';
import { WebDesignerMainPageTemplateHeaderComponent } from './page-template/header/header.component';
import { WebDesignerMainPageTemplateListComponent } from './page-template/list/list.component';
import { WebDesignerMainPageTemplateSelectorComponent } from './page-template/selector/selector.component';
import { WebDesignerMainPageTemplateTreeComponent } from './page-template/tree/tree.component';
import { WebDesignerMainPageAddComponent } from './page/add/add.component';
import { WebDesignerMainPageEditComponent } from './page/edit/edit.component';
import { WebDesignerMainPageHeaderComponent } from './page/header/header.component';
import { WebDesignerMainPageListGridComponent } from './page/list-grid/list-grid.component';
import { WebDesignerMainPageListComponent } from './page/list/list.component';
import { WebDesignerMainPageSelectorComponent } from './page/selector/selector.component';
import { WebDesignerMainPageTreeComponent } from './page/tree/tree.component';
@NgModule({
  declarations: [
    WebDesignerComponent,
    /** */
    WebDesignerMainIntroAddComponent,
    WebDesignerMainIntroEditComponent,
    WebDesignerMainIntroListComponent,
    /** */
    /** */
    WebDesignerMainMenuAddComponent,
    WebDesignerMainMenuEditComponent,
    WebDesignerMainMenuListComponent,
    WebDesignerMainMenuSelectorComponent,
    WebDesignerMainMenuTreeComponent,
    /** */
    /** */
    WebDesignerMainPageTemplateAddComponent,
    WebDesignerMainPageTemplateEditComponent,
    WebDesignerMainPageTemplateListComponent,
    WebDesignerMainPageTemplateSelectorComponent,
    WebDesignerMainPageTemplateTreeComponent,
    WebDesignerMainPageTemplateHeaderComponent,
    /** */
    /** */
    WebDesignerMainPageDependencyAddComponent,
    WebDesignerMainPageDependencyEditComponent,
    WebDesignerMainPageDependencyListComponent,
    WebDesignerMainPageDependencySelectorComponent,
    WebDesignerMainPageDependencyTreeComponent,
    WebDesignerMainPageDependencyHeaderComponent,
    WebDesignerMainPageDependencyAutoAddPageComponent,
    /** */
    /** */
    WebDesignerMainPageAddComponent,
    WebDesignerMainPageEditComponent,
    WebDesignerMainPageListComponent,
    WebDesignerMainPageListGridComponent,
    WebDesignerMainPageSelectorComponent,
    WebDesignerMainPageTreeComponent,
    WebDesignerMainPageHeaderComponent,
    /** */
    WebDesignerLogMemberInfoListComponent,
    WebDesignerLogMemberInfoSelectorComponent,
    WebDesignerLogMemberInfoViewComponent,
    /** */
  ],
  imports: [
    CommonModule,
    WebDesignerRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,

    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    ColorPickerModule,
    IconPickerModule,
    DragDropModule,
    CoreModuleModule,
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    CoreAuthService,
    CmsConfirmationDialogService,
    CoreModuleTagService,
    CoreSiteCategoryService,
    WebDesignerLogPageSafeService,
    WebDesignerLogMemberInfoService,
    WebDesignerMainIntroService,
    WebDesignerMainMenuService,
    WebDesignerMainPageService,
    WebDesignerMainPageDependencyService,
    WebDesignerMainPageTemplateService,
    WebDesignerMainPageTemplateSiteCategoryService,
    WebDesignerEnumService,
  ]
})
export class WebDesignerModule { }
