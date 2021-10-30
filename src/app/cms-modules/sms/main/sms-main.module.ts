import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsMainComponent } from './sms-main.component';
import { SmsMainRoutes } from './sms-main.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CmsFileManagerModule } from 'src/filemanager-api';
import {
  CoreAuthService,
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  SmsConfigurationService,
  SmsEnumService,
  SmsMainApiPathCompanyService,
  SmsMainApiPathPermissionService,
  SmsMainApiPathService
} from 'ntk-cms-api';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { SmsMainApiPathCompanyListComponent } from './api-path-company/list/list.component';
import { SmsMainApiPathCompanyAddComponent } from './api-path-company/add/add.component';
import { SmsMainApiPathCompanyEditComponent } from './api-path-company/edit/edit.component';
import { SmsMainApiPathCompanySelectorComponent } from './api-path-company/selector/selector.component';
import { SmsMainApiPathCompanyTreeComponent } from './api-path-company/tree/tree.component';
import { SmsMainApiPathListComponent } from './api-path/list/list.component';
import { SmsMainApiPathAddComponent } from './api-path/add/add.component';
import { SmsMainApiPathEditComponent } from './api-path/edit/edit.component';
import { SmsMainApiPathSelectorComponent } from './api-path/selector/selector.component';
import { SmsMainApiPathTreeComponent } from './api-path/tree/tree.component';
import { SmsMainApiPathPermissionListComponent } from './api-path-permission/list/list.component';
import { SmsMainApiPathPermissionAddComponent } from './api-path-permission/add/add.component';
import { SmsMainApiPathPermissionEditComponent } from './api-path-permission/edit/edit.component';
import { SmsMainApiPathPriceServiceListComponent } from './api-path-price-service/list/list.component';
import { SmsMainApiPathPriceServiceAddComponent } from './api-path-price-service/add/add.component';
import { SmsMainApiPathPriceServiceEditComponent } from './api-path-price-service/edit/edit.component';

@NgModule({
  declarations: [
    SmsMainComponent,
    /*company*/
    SmsMainApiPathCompanyListComponent,
    SmsMainApiPathCompanyAddComponent,
    SmsMainApiPathCompanyEditComponent,
    SmsMainApiPathCompanySelectorComponent,
    SmsMainApiPathCompanyTreeComponent,
    /*api*/
    SmsMainApiPathListComponent,
    SmsMainApiPathAddComponent,
    SmsMainApiPathEditComponent,
    SmsMainApiPathSelectorComponent,
    SmsMainApiPathTreeComponent,
    /*Permission*/
    SmsMainApiPathPermissionListComponent,
    SmsMainApiPathPermissionAddComponent,
    SmsMainApiPathPermissionEditComponent,
    /*PriceService*/
    SmsMainApiPathPriceServiceListComponent,
    SmsMainApiPathPriceServiceAddComponent,
    SmsMainApiPathPriceServiceEditComponent,
  ],
  exports: [
    /*company*/
    SmsMainApiPathCompanyListComponent,
    SmsMainApiPathCompanyAddComponent,
    SmsMainApiPathCompanyEditComponent,
    SmsMainApiPathCompanySelectorComponent,
    SmsMainApiPathCompanyTreeComponent,
    /*api*/
    SmsMainApiPathListComponent,
    SmsMainApiPathAddComponent,
    SmsMainApiPathEditComponent,
    SmsMainApiPathSelectorComponent,
    SmsMainApiPathTreeComponent,
    /*Permission*/
    SmsMainApiPathPermissionListComponent,
    SmsMainApiPathPermissionAddComponent,
    SmsMainApiPathPermissionEditComponent,
    /*PriceService*/
    SmsMainApiPathPriceServiceListComponent,
    SmsMainApiPathPriceServiceAddComponent,
    SmsMainApiPathPriceServiceEditComponent,
  ],
  imports: [
    CommonModule,
    SmsMainRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule.forRoot(),
    AngularEditorModule,
    CmsFileManagerModule
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    SmsEnumService,
    CmsConfirmationDialogService,
    /*Config*/
    SmsConfigurationService,
    /*Config*/
    SmsMainApiPathService,
    SmsMainApiPathCompanyService,
    SmsMainApiPathPermissionService
  ]
})
export class SmsMainModule { }
