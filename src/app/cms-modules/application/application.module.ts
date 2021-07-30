import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application.component';
import { ApplicationRoutes } from './application.routing';
import { ApplicationAppListComponent } from './content/list/list.component';
import { ApplicationMemberInfoListComponent } from './memberInfo/list/list.component';
import { ApplicationIntroListComponent } from './intro/list/list.component';
import { ApplicationLogNotificationListComponent } from './notification/list/list.component';
import { ApplicationSourceListComponent } from './source/list/list.component';
import { ApplicationThemeConfigListComponent } from './themeConfig/list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import {
  ApplicationAppService,
  ApplicationIntroService,
  ApplicationLogNotificationService,
  ApplicationMemberInfoService,
  ApplicationSourceService,
  ApplicationThemeConfigService,
  CoreAuthService,
  CoreEnumService,
  ApplicationEnumService,
  CoreModuleTagService,
  ApplicationConfigurationService,
  ApplicationSourceSiteCategoryService
} from 'ntk-cms-api';
import { ApplicationSourceTreeComponent } from './source/tree/tree.component';
import { ApplicationAppTreeComponent } from './content/tree/tree.component';
import { ApplicationSourceAddComponent } from './source/add/add.component';
import { ApplicationSourceEditComponent } from './source/edit/edit.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { ApplicationSourceSelectorComponent } from './source/selector/selector.component';
import { ApplicationThemeConfigSelectorComponent } from './themeConfig/selector/selector.component';
import { ApplicationAppEditComponent } from './content/edit/edit.component';
import { ApplicationAppAddComponent } from './content/add/add.component';
import { ApplicationIntroAddComponent } from './intro/add/add.component';
import { ApplicationIntroEditComponent } from './intro/edit/edit.component';
import { ApplicationAppSelectorComponent } from './content/selector/selector.component';
import { ApplicationAppDownloadComponent } from './content/download/download.component';
import { ApplicationAppUploadAppComponent } from './content/uploadApp/uploadApp.component';
import { ApplicationAppUploadUpdateComponent } from './content/uploadUpdate/uploadUpdate.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { ApplicationConfigSiteComponent } from './config/site/configSite.component';
import { ApplicationConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { ApplicationThemeConfigEditComponent } from './themeConfig/edit/edit.component';
import { ApplicationThemeConfigAddComponent } from './themeConfig/add/add.component';
import { ApplicationMemberInfoViewComponent } from './memberInfo/view/view.component';
import { ApplicationLogNotificationViewComponent } from './notification/view/view.component';
import { ApplicationLogNotificationActionSendComponent } from './notification/action-send/action-send.component';
import { ApplicationMemberInfoSelectorComponent } from './memberInfo/selector/selector.component';
import { CmsFileUploaderModule } from 'src/app/shared/cms-file-uploader/cms-file-uploader.module';

@NgModule({
  declarations: [
    ApplicationComponent,
    /*Config*/
    ApplicationConfigMainAdminComponent,
    ApplicationConfigSiteComponent,
    /*Config*/
    ApplicationSourceListComponent,
    ApplicationSourceTreeComponent,
    ApplicationSourceAddComponent,
    ApplicationSourceEditComponent,
    ApplicationSourceSelectorComponent,

    ApplicationAppListComponent,
    ApplicationAppTreeComponent,
    ApplicationAppAddComponent,
    ApplicationAppEditComponent,
    ApplicationAppSelectorComponent,
    ApplicationAppDownloadComponent,
    ApplicationAppUploadAppComponent,
    ApplicationAppUploadUpdateComponent,

    ApplicationIntroListComponent,
    ApplicationIntroAddComponent,
    ApplicationIntroEditComponent,

    ApplicationMemberInfoListComponent,
    ApplicationMemberInfoViewComponent,
    ApplicationMemberInfoSelectorComponent,

    ApplicationLogNotificationListComponent,
    ApplicationLogNotificationViewComponent,
    ApplicationLogNotificationActionSendComponent,

    ApplicationThemeConfigListComponent,
    ApplicationThemeConfigSelectorComponent,
    ApplicationThemeConfigAddComponent,
    ApplicationThemeConfigEditComponent,



  ],
  imports: [
    CommonModule,
    ApplicationRoutes,
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
    CmsFileUploaderModule,
  ],
  providers: [
    CoreEnumService,
    CoreAuthService,
    CmsConfirmationDialogService,
    ApplicationEnumService,
    CoreModuleTagService,
    ApplicationAppService,
    ApplicationIntroService,
    ApplicationSourceService,
    ApplicationMemberInfoService,
    ApplicationLogNotificationService,
    ApplicationThemeConfigService,
    ApplicationConfigurationService,
    ApplicationSourceSiteCategoryService,
  ]
})
export class ApplicationModule { }
