import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { AngularEditorModule } from '@kolkov/angular-editor';
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

import { SharedModule } from 'src/app/shared.module';
import { CoreModuleModule } from '../core-main/module/coreModule.module';
import { WebDesignerBuilderHtmlBodyComponent } from './html/body/body.component';
import { WebDesignerBuilderHtmlContainerComponent } from './html/container/container.component';
import { WebDesignerBuilderHtmlHeaderComponent } from './html/header/header.component';
import { WebDesignerBuilderHtmlItemsComponent } from './html/items/items.component';
import { WebDesignerBuilderHtmlRowComponent } from './html/row/row.component';
import { WebDesignerBuilderModuleBlogComponent } from './module/blog/blog.component';
import { WebDesignerBuilderModuleNewsComponent } from './module/news/news.component';
import { WebDesignerBuilderModuleTicketingComponent } from './module/ticketing/ticketing.component';
import { WebDesignerBuilderComponent } from './web-designer-builder.component';
import { WebDesignerBuilderRoutes } from './web-designer-builder.routing';

@NgModule({
  declarations: [
    WebDesignerBuilderComponent,
    /** */
    WebDesignerBuilderHtmlRowComponent,
    WebDesignerBuilderHtmlHeaderComponent,
    WebDesignerBuilderHtmlContainerComponent,
    WebDesignerBuilderHtmlBodyComponent,
    WebDesignerBuilderHtmlItemsComponent,
    /** */
    WebDesignerBuilderModuleNewsComponent,
    WebDesignerBuilderModuleBlogComponent,
    WebDesignerBuilderModuleTicketingComponent,
    /** */
    /** */

    /** */
  ],
  imports: [
    CommonModule,
    WebDesignerBuilderRoutes,
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
export class WebDesignerBuilderModule { }
