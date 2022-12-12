﻿import { PlatformModule } from '@angular/cdk/platform';
import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxNtkQueryBuilderModule } from 'ngx-ntk-query-builder';
import { TreeModule } from '@circlon/angular-tree-component';
import { TruncatePipe } from './core/pipe/truncate.pipe';
import { PersianDate } from './core/pipe/PersianDatePipe/persian-date.pipe';
import { CmsSearchListComponent } from './shared/cms-search-list/cmsSearchList.component';
import { CmsStatistListComponent } from './shared/cms-statist-list/cmsStatistList.component';
import { CmsExportListComponent } from './shared/cms-export-list/cmsExportList.component';
import { CmsMapComponent } from './shared/cms-map/cms-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { RecordStatusClassPipe } from './core/pipe/recordStatusClass.pipe';
import { BoolStatusClassPipe } from './core/pipe/boolStatusClass.pipe';
import { PersianDateFull } from './core/pipe/PersianDatePipe/persian-date-full.pipe';
import { ProgressSpinnerComponent } from './shared/progress-spinner/progress-spinner.component';
import { OverlayService } from './shared/overlay/overlay.service';
import { HttpConfigInterceptor } from './core/interceptor/httpConfigInterceptor';
import { KeysPipe } from './core/pipe/keys.pipe';
import { EnumsPipe } from './core/pipe/enums.pipe';
import { PrettyjsonPipe } from './core/pipe/prettyjson.pipe';
import { CmsSiteSelectorComponent } from './shared/cms-site-selector/cmsSiteSelector.component';
import { CmsUserSelectorComponent } from './shared/cms-user-selector/cmsUserSelector.component';
import { CmsMemberSelectorComponent } from './shared/cms-member-selector/cmsMemberSelector.component';
import {
  ApplicationAppService,
  BankPaymentEnumService,
  BankPaymentPrivateSiteConfigService,
  BankPaymentTransactionService,
  CoreCurrencyService,
  CoreGuideService,
  CoreLocationService,
  CoreLogMemberService,
  CoreModuleLogMemoService,
  CoreModuleSiteCreditService,
  CoreModuleSiteUserCreditService,
  CoreSiteCategoryService,
  CoreSiteService,
  CoreUserGroupService,
  CoreUserService,
  MemberUserService,
  SmsMainApiNumberService,
  SmsMainApiPathService
} from 'ntk-cms-api';
import { PasswordStrengthComponent } from './shared/password-strength/password-strength.component';
import { CmsJsonListComponent } from './shared/cms-json-list/cmsJsonList.component';
import { CmsGuideinfoComponent } from './shared/cms-guide-info/cms-guide-info.component';
import { TooltipGuideDirective } from './core/directive/tooltip-guide.directive';
import { TooltipDirective } from './core/directive/tooltip.directive';
import { CmsFormBuilderPropertiesComponent } from './shared/cms-form-builder-properties/cms-form-builder-properties.component';
import { CmsModuleSelectorComponent } from './shared/cms-module-selector/cms-module-selector.component';
import { CmsSiteCategorySelectorComponent } from './shared/cms-site-category-selector/cmsSiteCategorySelector.component';
import { CmsUserGroupSelectorComponent } from './shared/cms-user-group-selector/cmsUserGroupSelector.component';
import { CmsTitlePipe } from './core/pipe/cms-title.pipe';
import { CmsApplicationSelectorComponent } from './shared/cms-application-selector/cms-application-selector.component';
import { CmsBankpaymentGridComponent } from './shared/cms-bankpayment-grid/cms-bankpayment-grid.component';
import { CmsCurrencySelectorComponent } from './shared/cms-currency-selector/cms-currency-selector.component';
import { CmsLocationSelectorComponent } from './shared/cms-location-selector/cms-location-selector.component';
import { ValueArrayPipe } from './core/pipe/valueArray.pipe';
import { StringComponent } from './core/dynamic-input-builder/string/string.component';
import { IntComponent } from './core/dynamic-input-builder/int/int.component';
import { BooleanComponent } from './core/dynamic-input-builder/boolean/boolean.component';
import { FloatComponent } from './core/dynamic-input-builder/float/float.component';
import { DateComponent } from './core/dynamic-input-builder/date/date.component';
import { TextAreaComponent } from './core/dynamic-input-builder/text-area/text-area.component';
import { LanguageSelectorComponent } from './shared/language-selector/language-selector.component';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CmsSiteCategorySelectionListComponent } from './shared/cms-site-category-selection-list/cmsSiteCategorySelectionList.component';
import { CmsFilesSelectorComponent } from './shared/cms-files-selector/cms-files-selector.component';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CmsTagAutocompleteComponent } from './shared/cms-tag-autocomplete/cms-tag-autocomplete.component';
import { CmsTokenAccessComponent } from './shared/cms-token-access/cmsTokenAccess.component';
import { CmsHtmlNoticeComponent } from './shared/cms-html-notice/cms-html-notice.component';
import { CmsHtmlCardComponent } from './shared/cms-html-card/cms-html-card.component';
import { CmsHtmlModalComponent } from './shared/cms-html-modal/cms-html-modal.component';
import { CmsHtmlListComponent } from './shared/cms-html-list/cms-html-list.component';
import { CmsHtmlTreeComponent } from './shared/cms-html-tree/cms-html-tree.component';
import { CmsHtmlTreeActionDirective, CmsHtmlTreeBodyDirective, CmsHtmlTreeFooterDirective, CmsHtmlTreeHeaderDirective } from './core/directive/cms-html-tree.directive';
import { FirstLetterPipe } from './core/pipe/first-letter.pipe';
import { SafePipe } from './core/pipe/safe.pipe';
import { MatInputCommifiedDirective } from './core/directive/mat-input-commified.directive';
import { PhoneDirective } from './core/directive/phone.directive';
import { CmsImageThumbnailPipe } from './core/pipe/cms-image-thumbnail.pipe';
import { CmsLocationCompleteComponent } from './shared/cms-location-autocomplete/cms-location-autocomplete.component';
import { CmsQDocComponent } from './shared/cms-qdoc/cms-qdoc.component';
import { CmsLinkToComponent } from './shared/cms-link-to/cms-link-to.component';
import { CmsBankpaymentTransactionInfoComponent } from './shared/cms-bankpayment-transaction-info/cms-bankpayment-transaction-info.component';
import { CmsViewComponent } from './shared/cms-view/cms-view.component';
import { DirDirective } from './core/directive/dir.directive';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CmsGuideNoticeComponent } from './shared/cms-guide-notice/cms-guide-notice.component';
import { CodePreviewComponent } from './shared/code-preview/code-preview.component';
//import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CmsSiteCreditViewComponent } from './shared/cms-site-credit-view/cms-site-credit-view.component';
import { CmsSiteUserCreditViewComponent } from './shared/cms-site-user-credit-view/cms-site-user-credit-view.component';
import { SelfSaveDirective } from './core/directive/self-save.directive';
import { CmsRecordStatusSelfSaveDirective } from './core/directive/cms-record-status-self-save.directive';
import { CmsMemoComponent } from './shared/cms-memo/cms-memo.component';
import { MaterialPersianDateAdapter, PERSIAN_DATE_FORMATS } from './shared/material/material.persian-date.adapter';
import { TranslateModule } from '@ngx-translate/core';
import { CmsContactCategoryTreeSelectorComponent } from './shared/cms-contact-category-tree-selector/cms-contact-category-tree-selector.component';
import { CmsContactContentSelectionListComponent } from './shared/cms-contact-content-selection-list/cms-contact-content-selection-list.component';
import { CmsAccessInfoComponent } from './shared/cms-access-info/cms-access-info.component';
import { CmsUserInfoPipe } from './core/pipe/cms-user-info.pipe';
import { CmsSiteInfoPipe } from './core/pipe/cms-site-info.pipe';
import { CmsModuleInfoPipe } from './core/pipe/cms-module-info.pipe';
import { SmsMainApiPathSelectorComponent } from './cms-modules/sms/main/api-path/selector/selector.component';
import { SmsMainApiNumberSelectorComponent } from './cms-modules/sms/main/api-number/selector/selector.component';
import { CmsExportEntityComponent } from './shared/cms-export-entity/cms-export-entity.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    HttpClientModule,
    //Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    CdkTableModule,
    PlatformModule,
    MatTreeModule,
    //Material
    TreeModule,
    NgxNtkQueryBuilderModule,
    LeafletModule,

    NgbDropdownModule,
    CmsFileManagerModule.forRoot(),
    ClipboardModule,
    InlineSVGModule,
    //PerfectScrollbarModule,
    NgbNavModule,

  ],
  declarations: [
    // common and shared components/directives/pipes between more than one module and components will be listed here.
    PersianDate,
    PersianDateFull,
    /** pipe */
    TruncatePipe,
    KeysPipe,
    EnumsPipe,
    CmsTitlePipe,
    CmsUserInfoPipe,
    CmsSiteInfoPipe,
    CmsModuleInfoPipe,
    CmsImageThumbnailPipe,
    PrettyjsonPipe,
    RecordStatusClassPipe,
    BoolStatusClassPipe,
    ValueArrayPipe,
    FirstLetterPipe,
    SafePipe,
    /** Component */
    LanguageSelectorComponent,
    CmsSearchListComponent,
    CmsStatistListComponent,
    CmsExportListComponent,
    CmsSiteSelectorComponent,
    CmsCurrencySelectorComponent,
    CmsLocationSelectorComponent,
    CmsLocationCompleteComponent,
    CmsApplicationSelectorComponent,
    CmsSiteCategorySelectorComponent,
    CmsSiteCategorySelectionListComponent,
    CmsUserSelectorComponent,
    CmsUserGroupSelectorComponent,
    CmsMemberSelectorComponent,
    CmsModuleSelectorComponent,
    CmsExportEntityComponent,
    CmsQDocComponent,
    CmsViewComponent,
    CmsLinkToComponent,
    CmsMemoComponent,
    CmsMapComponent,
    CmsTagAutocompleteComponent,
    ProgressSpinnerComponent,
    PasswordStrengthComponent,
    CmsJsonListComponent,
    CmsGuideinfoComponent,
    CmsGuideNoticeComponent,
    CmsFormBuilderPropertiesComponent,
    CmsBankpaymentGridComponent,
    CmsBankpaymentTransactionInfoComponent,
    CmsFilesSelectorComponent,
    CmsTokenAccessComponent,
    CmsHtmlNoticeComponent,
    CmsHtmlCardComponent,
    CmsHtmlModalComponent,
    CmsHtmlListComponent,
    CmsHtmlTreeComponent,
    CodePreviewComponent,
    CmsSiteCreditViewComponent,
    CmsSiteUserCreditViewComponent,
    CmsContactCategoryTreeSelectorComponent,
    CmsContactContentSelectionListComponent,
    CmsAccessInfoComponent,
    SmsMainApiPathSelectorComponent,
    SmsMainApiNumberSelectorComponent,
    /** input */
    StringComponent,
    IntComponent,
    BooleanComponent,
    FloatComponent,
    DateComponent,
    TextAreaComponent,
    /** Directive */
    TooltipGuideDirective,
    TooltipDirective,
    DirDirective,
    PhoneDirective,
    CmsHtmlTreeHeaderDirective,
    CmsHtmlTreeActionDirective,
    CmsHtmlTreeBodyDirective,
    CmsHtmlTreeFooterDirective,
    MatInputCommifiedDirective,
    SelfSaveDirective,
    CmsRecordStatusSelfSaveDirective,

  ],
  exports: [
    // common and shared components/directives/pipes between more than one module and components will be listed here.
    CommonModule,
    TranslateModule,
    FormsModule,
    HttpClientModule,
    //Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    CdkTableModule,
    PlatformModule,
    MatTreeModule,
    //Material
    CmsFileManagerModule,
    TreeModule,
    ClipboardModule,
    PersianDate,
    PersianDateFull,
    /** pipe */
    TruncatePipe,
    FirstLetterPipe,
    SafePipe,
    KeysPipe,
    EnumsPipe,
    CmsTitlePipe,
    CmsUserInfoPipe,
    CmsSiteInfoPipe,
    CmsModuleInfoPipe,
    CmsImageThumbnailPipe,
    PrettyjsonPipe,
    RecordStatusClassPipe,
    BoolStatusClassPipe,
    ValueArrayPipe,
    /** Component */
    LanguageSelectorComponent,
    CmsSearchListComponent,
    CmsStatistListComponent,
    CmsExportListComponent,
    CmsSiteSelectorComponent,
    CmsCurrencySelectorComponent,
    CmsLocationSelectorComponent,
    CmsLocationCompleteComponent,
    CmsApplicationSelectorComponent,
    CmsSiteCategorySelectorComponent,
    CmsSiteCategorySelectionListComponent,
    CmsUserSelectorComponent,
    CmsUserGroupSelectorComponent,
    CmsMemberSelectorComponent,
    CmsModuleSelectorComponent,
    CmsExportEntityComponent,
    CmsMapComponent,
    CmsQDocComponent,
    CmsViewComponent,
    CmsLinkToComponent,
    CmsMemoComponent,
    CmsTagAutocompleteComponent,
    ProgressSpinnerComponent,
    PasswordStrengthComponent,
    CmsJsonListComponent,
    CmsGuideinfoComponent,
    CmsGuideNoticeComponent,
    CmsFormBuilderPropertiesComponent,
    CmsBankpaymentGridComponent,
    CmsBankpaymentTransactionInfoComponent,
    CmsFilesSelectorComponent,
    CmsTokenAccessComponent,
    CmsHtmlNoticeComponent,
    CmsHtmlCardComponent,
    CmsHtmlModalComponent,
    CmsHtmlListComponent,
    CmsHtmlTreeComponent,
    CodePreviewComponent,
    CmsSiteCreditViewComponent,
    CmsSiteUserCreditViewComponent,
    CmsContactCategoryTreeSelectorComponent,
    CmsContactContentSelectionListComponent,
    CmsAccessInfoComponent,
    SmsMainApiPathSelectorComponent,
    SmsMainApiNumberSelectorComponent,
    /** input */
    StringComponent,
    IntComponent,
    BooleanComponent,
    FloatComponent,
    DateComponent,
    TextAreaComponent,
    /** Directive */
    TooltipGuideDirective,
    TooltipDirective,
    DirDirective,
    PhoneDirective,
    CmsHtmlTreeHeaderDirective,
    CmsHtmlTreeActionDirective,
    CmsHtmlTreeBodyDirective,
    CmsHtmlTreeFooterDirective,
    MatInputCommifiedDirective,
    SelfSaveDirective,
    CmsRecordStatusSelfSaveDirective
  ],
  providers: [
    OverlayService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    { provide: DateAdapter, useClass: MaterialPersianDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS },
    MemberUserService,
    CoreLogMemberService,
    CoreUserService,
    CoreUserGroupService,
    CoreSiteService,
    CoreSiteCategoryService,
    CoreGuideService,
    CoreCurrencyService,
    CoreLocationService,
    ApplicationAppService,
    BankPaymentPrivateSiteConfigService,
    BankPaymentTransactionService,
    BankPaymentEnumService,
    CoreModuleSiteCreditService,
    CoreModuleSiteUserCreditService,
    CoreModuleLogMemoService,
    SmsMainApiPathService,
    SmsMainApiNumberService,
  ]
  /* No providers here! Since they’ll be already provided in AppModule. */
})
export class SharedModule {
  static forRoot(): any {
    // Forcing the whole app to use the returned providers from the AppModule only.
    return {
      ngModule: SharedModule,
      providers: [
        /* All of your services here. It will hold the services needed by `itself`. */
      ],
    };
  }
}
