import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SmsMainComponent } from './sms-main.component';
import { SmsMainRoutes } from './sms-main.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  CoreEnumService,
  CoreModuleService,
  SmsConfigurationService,
  SmsEnumService, SmsMainApiNumberPermissionService, SmsMainApiNumberService, SmsMainApiPathAndApiNumberService,
  SmsMainApiPathCompanyService,
  SmsMainApiPathPermissionService,
  SmsMainApiPathPublicConfigService,
  SmsMainApiPathService, SmsMainCustomerCreditService, SmsMainMessageCategoryService, SmsMainMessageContentService
} from 'ntk-cms-api';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { SharedModule } from 'src/app/shared.module';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { SmsMainApiPathCompanyAddComponent } from './api-path-company/add/add.component';
import { SmsMainApiPathCompanyEditComponent } from './api-path-company/edit/edit.component';
import { SmsMainApiPathCompanyListComponent } from './api-path-company/list/list.component';
import { SmsMainApiPathCompanySelectorComponent } from './api-path-company/selector/selector.component';
import { SmsMainApiPathCompanyTreeComponent } from './api-path-company/tree/tree.component';
import { SmsMainApiPathPermissionAddComponent } from './api-path-permission/add/add.component';
import { SmsMainApiPathPermissionEditComponent } from './api-path-permission/edit/edit.component';
import { SmsMainApiPathPermissionListComponent } from './api-path-permission/list/list.component';
import { SmsMainApiPathPriceServiceAddComponent } from './api-path-price-service/add/add.component';
import { SmsMainApiPathPriceServiceEditComponent } from './api-path-price-service/edit/edit.component';
import { SmsMainApiPathPriceServiceListComponent } from './api-path-price-service/list/list.component';
import { SmsMainApiPathAddComponent } from './api-path/add/add.component';
import { SmsMainApiPathEditComponent } from './api-path/edit/edit.component';
import { SmsMainApiPathListComponent } from './api-path/list/list.component';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DynamicFormBuilderModule } from 'src/app/core/dynamic-form-builder/dynamic-form-builder.module';
import { SmsSharedModule } from '../sms.shared.module';
import { SmsMainApiNumberPermissionAddComponent } from './api-number-permission/add/add.component';
import { SmsMainApiNumberPermissionEditComponent } from './api-number-permission/edit/edit.component';
import { SmsMainApiNumberPermissionListComponent } from './api-number-permission/list/list.component';
import { SmsMainApiNumberAddComponent } from './api-number/add/add.component';
import { SmsMainApiNumberEditComponent } from './api-number/edit/edit.component';
import { SmsMainApiNumberListComponent } from './api-number/list/list.component';
import { SmsMainApiNumberSelectorComponent } from './api-number/selector/selector.component';
import { SmsMainApiPathSelectionlistComponent } from './api-path/selectionlist/selectionlist.component';
import { SmsMainApiPathSelectorComponent } from './api-path/selector/selector.component';
import { SmsMainApiPathSendTestComponent } from './api-path/sendTest/sendTest.component';
import { SmsMainCustomerCreditAddComponent } from './customer-credit/add/add.component';
import { SmsMainCustomerCreditEditComponent } from './customer-credit/edit/edit.component';
import { SmsMainCustomerCreditListComponent } from './customer-credit/list/list.component';
import { SmsMainMessageCategoryAddComponent } from './message-category/add/add.component';
import { SmsMainMessageCategoryDeleteComponent } from './message-category/delete/delete.component';
import { SmsMainMessageCategoryEditComponent } from './message-category/edit/edit.component';
import { SmsMainMessageCategorySelectorComponent } from './message-category/selector/selector.component';
import { SmsMainMessageCategoryTreeComponent } from './message-category/tree/tree.component';
import { SmsMainMessageContentAddComponent } from './message-content/add/add.component';
import { SmsMainMessageContentEditComponent } from './message-content/edit/edit.component';
import { SmsMainMessageContentListComponent } from './message-content/list/list.component';
import { SmsMainMessageContentSelectorComponent } from './message-content/selector/selector.component';
import { SmsMainApiPathPublicConfigAddComponent } from './public-config/add/add.component';
import { SmsMainApiPathPublicConfigEditComponent } from './public-config/edit/edit.component';
import { SmsMainApiPathPublicConfigHeaderComponent } from './public-config/header/header.component';
import { SmsMainApiPathPublicConfigListComponent } from './public-config/list/list.component';
import { SmsMainApiPathPublicConfigSelectorComponent } from './public-config/selector/selector.component';
import { SmsMainApiPathPublicConfigTreeComponent } from './public-config/tree/tree.component';




@NgModule({
  declarations: [
    SmsMainComponent,
    SmsMainApiPathPublicConfigAddComponent,
    SmsMainApiPathPublicConfigEditComponent,
    SmsMainApiPathPublicConfigListComponent,
    SmsMainApiPathPublicConfigSelectorComponent,
    SmsMainApiPathPublicConfigTreeComponent,
    SmsMainApiPathPublicConfigHeaderComponent,
    /* */

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

    SmsMainApiPathSendTestComponent,
    SmsMainApiPathSelectionlistComponent,
    /*Permission*/
    SmsMainApiPathPermissionListComponent,
    SmsMainApiPathPermissionAddComponent,
    SmsMainApiPathPermissionEditComponent,
    /*PriceService*/
    SmsMainApiPathPriceServiceListComponent,
    SmsMainApiPathPriceServiceAddComponent,
    SmsMainApiPathPriceServiceEditComponent,
    /*ApiNumber*/
    SmsMainApiNumberListComponent,
    SmsMainApiNumberAddComponent,
    SmsMainApiNumberEditComponent,
    SmsMainApiNumberSelectorComponent,
    /*Permission*/
    SmsMainApiNumberPermissionListComponent,
    SmsMainApiNumberPermissionAddComponent,
    SmsMainApiNumberPermissionEditComponent,
    /*CustomerCredit*/
    SmsMainCustomerCreditListComponent,
    SmsMainCustomerCreditEditComponent,
    SmsMainCustomerCreditAddComponent,
    /** */
    SmsMainMessageCategoryAddComponent,
    SmsMainMessageCategoryDeleteComponent,
    SmsMainMessageCategoryEditComponent,
    SmsMainMessageCategorySelectorComponent,
    SmsMainMessageCategoryTreeComponent,
    /** */
    SmsMainMessageContentAddComponent,
    SmsMainMessageContentEditComponent,
    SmsMainMessageContentListComponent,
    SmsMainMessageContentSelectorComponent,
    /** */
  ],
  exports: [
    SmsMainApiPathPublicConfigAddComponent,
    SmsMainApiPathPublicConfigEditComponent,
    SmsMainApiPathPublicConfigListComponent,
    SmsMainApiPathPublicConfigSelectorComponent,
    SmsMainApiPathPublicConfigTreeComponent,
    SmsMainApiPathPublicConfigHeaderComponent,
    /* */

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

    SmsMainApiPathSendTestComponent,
    SmsMainApiPathSelectionlistComponent,
    /*Permission*/
    SmsMainApiPathPermissionListComponent,
    SmsMainApiPathPermissionAddComponent,
    SmsMainApiPathPermissionEditComponent,
    /*PriceService*/
    SmsMainApiPathPriceServiceListComponent,
    SmsMainApiPathPriceServiceAddComponent,
    SmsMainApiPathPriceServiceEditComponent,
    /*ApiNumber*/
    SmsMainApiNumberListComponent,
    SmsMainApiNumberAddComponent,
    SmsMainApiNumberEditComponent,
    SmsMainApiNumberSelectorComponent,
    /*Permission*/
    SmsMainApiNumberPermissionListComponent,
    SmsMainApiNumberPermissionAddComponent,
    SmsMainApiNumberPermissionEditComponent,
    /*CustomerCredit*/
    SmsMainCustomerCreditListComponent,
    SmsMainCustomerCreditEditComponent,
    SmsMainCustomerCreditAddComponent,

    /** */
    SmsMainMessageCategoryAddComponent,
    SmsMainMessageCategoryDeleteComponent,
    SmsMainMessageCategoryEditComponent,
    SmsMainMessageCategorySelectorComponent,
    SmsMainMessageCategoryTreeComponent,
    /** */
    SmsMainMessageContentAddComponent,
    SmsMainMessageContentEditComponent,
    SmsMainMessageContentListComponent,
    SmsMainMessageContentSelectorComponent,
    /** */
  ],
  imports: [
    CommonModule,
    SmsMainRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule.forRoot(),
    AngularEditorModule,
    CmsFileManagerModule,
    DynamicFormBuilderModule,
    NgxMaterialTimepickerModule,
    SmsSharedModule,
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
    SmsMainApiPathPermissionService,
    SmsMainApiNumberPermissionService,
    SmsMainApiPathPublicConfigService,
    SmsMainApiNumberService,
    SmsMainApiPathAndApiNumberService,
    SmsMainCustomerCreditService,
    SmsMainMessageContentService,
    SmsMainMessageCategoryService,

  ]
})
export class SmsMainModule { }
