import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstateComponent } from './estate.component';
import { EstateRoutes } from './estate.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

import {
  CoreAuthService,
  CoreEnumService,
  CoreModuleTagService,
  EstateConfigurationService,
  EstatePropertyTypeLanduseService,
  EstateActivityTypeService,
  EstatePropertyService,
  EstateContractTypeService,
  EstatePropertyDetailGroupService,
  EstateAccountAgencyService,
  EstateAccountAgencyTypeUserService,
  EstateAccountUserService,
  EstateEnumService,
  EstatePropertyAccountTypeUserService,
  EstatePropertyHistoryService,
  EstatePropertyShareAgencyService,
  EstatePropertyShareAgentService,
  EstatePropertyShareSiteService,
  EstateContractService,
  EstatePropertyDetailService,
  EstatePropertyTypeUsageService,
  EstatePropertyTypeService,
  EstatePropertyAdsService,
  EstateAdsTypeService,
  CoreModuleService,
  FileCategoryService,
  EstateBillboardService,
  EstateCustomerOrderService,
  BankPaymentTransactionService,
  EstateAccountAgencyAdsService,
  EstatePropertyProjectService,
  EstatePropertyExpertPriceService,
  EstateCustomerOrderResultService
} from 'ntk-cms-api';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';

import { EstatePropertyAddComponent } from './property/add/add.component';
import { EstatePropertyEditComponent } from './property/edit/edit.component';
import { EstatePropertyListComponent } from './property/list/list.component';
import { EstateContractTypeAddComponent } from './contract-type/add/add.component';
import { EstateContractTypeEditComponent } from './contract-type/edit/edit.component';
import { EstateContractTypeListComponent } from './contract-type/list/list.component';
import { EstateContractTypeSelectorComponent } from './contract-type/selector/selector.component';
import { EstateContractTypeTreeComponent } from './contract-type/tree/tree.component';
import { EstatePropertyDetailGroupAddComponent } from './property-detail-group/add/add.component';
import { EstatePropertyDetailGroupEditComponent } from './property-detail-group/edit/edit.component';
import { EstatePropertyDetailGroupListComponent } from './property-detail-group/list/list.component';
import { EstatePropertyDetailGroupSelectorComponent } from './property-detail-group/selector/selector.component';
import { EstatePropertyDetailGroupTreeComponent } from './property-detail-group/tree/tree.component';
import { EstateAccountAgencyAddComponent } from './account-agency/add/add.component';
import { EstateAccountAgencyEditComponent } from './account-agency/edit/edit.component';
import { EstateAccountAgencyListComponent } from './account-agency/list/list.component';
import { EstateAccountAgencySelectorComponent } from './account-agency/selector/selector.component';
import { EstateAccountAgencyTreeComponent } from './account-agency/tree/tree.component';
import { EstateAccountAgencyTypeUserAddComponent } from './account-agency-typeuser/add/add.component';
import { EstateAccountAgencyTypeUserEditComponent } from './account-agency-typeuser/edit/edit.component';
import { EstateAccountAgencyTypeUserListComponent } from './account-agency-typeuser/list/list.component';
import { EstateAccountAgencyTypeUserSelectorComponent } from './account-agency-typeuser/selector/selector.component';
import { EstatePropertySelectorComponent } from './property/selector/selector.component';
import { EstateAccountUserAddComponent } from './account-user/add/add.component';
import { EstateAccountUserEditComponent } from './account-user/edit/edit.component';
import { EstateAccountUserListComponent } from './account-user/list/list.component';
import { EstateAccountUserSelectorComponent } from './account-user/selector/selector.component';
import { EstateAccountUserTreeComponent } from './account-user/tree/tree.component';
import { EstatePropertyHistoryAddComponent } from './property-history/add/add.component';
import { EstatePropertyHistoryEditComponent } from './property-history/edit/edit.component';
import { EstatePropertyHistoryListComponent } from './property-history/list/list.component';
import { EstatePropertyDetailAddComponent } from './property-detail/add/add.component';
import { EstatePropertyDetailEditComponent } from './property-detail/edit/edit.component';
import { EstatePropertyDetailListComponent } from './property-detail/list/list.component';
import { EstatePropertyDetailSelectorComponent } from './property-detail/selector/selector.component';
import { EstatePropertyDetailTreeComponent } from './property-detail/tree/tree.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColorPickerModule } from 'ngx-color-picker';
import { IconPickerModule } from 'ngx-icon-picker';
import { EstatePropertyTypeLanduseAddComponent } from './property-type-landuse/add/add.component';
import { EstatePropertyTypeLanduseEditComponent } from './property-type-landuse/edit/edit.component';
import { EstatePropertyTypeLanduseListComponent } from './property-type-landuse/list/list.component';
import { EstatePropertyTypeLanduseSelectorComponent } from './property-type-landuse/selector/selector.component';
import { EstatePropertyTypeLanduseTreeComponent } from './property-type-landuse/tree/tree.component';
import { EstateActivityTypeAddComponent } from './activity-type/add/add.component';
import { EstateActivityTypeEditComponent } from './activity-type/edit/edit.component';
import { EstateActivityTypeListComponent } from './activity-type/list/list.component';
import { EstateActivityTypeSelectorComponent } from './activity-type/selector/selector.component';
import { EstateActivityTypeTreeComponent } from './activity-type/tree/tree.component';
import { EstatePropertyTypeUsageAddComponent } from './property-type-usage/add/add.component';
import { EstatePropertyTypeUsageEditComponent } from './property-type-usage/edit/edit.component';
import { EstatePropertyTypeUsageListComponent } from './property-type-usage/list/list.component';
import { EstatePropertyTypeUsageSelectorComponent } from './property-type-usage/selector/selector.component';
import { EstatePropertyTypeUsageTreeComponent } from './property-type-usage/tree/tree.component';
import { EstatePropertyTypeUsageSelectionlistComponent } from './property-type-usage/selectionlist/selectionlist.component';
import { EstatePropertyAdsAddComponent } from './property-ads/add/add.component';
import { EstatePropertyAdsEditComponent } from './property-ads/edit/edit.component';
import { EstatePropertyAdsListComponent } from './property-ads/list/list.component';
import { EstateAdsTypeEditComponent } from './ads-type/edit/edit.component';
import { EstateAdsTypeListComponent } from './ads-type/list/list.component';
import { EstateAdsTypeAddComponent } from './ads-type/add/add.component';
import { EstateAdsTypeSelectorComponent } from './ads-type/selector/selector.component';
import { EstatePropertyAdsSaleListComponent } from './property-ads/sale-list/sale-list.component';
import { EstatePropertyAdsSalePaymentComponent } from './property-ads/sale-payment/sale-payment.component';
import { EstateBillboardAddComponent } from './billbord/add/add.component';
import { EstateBillboardEditComponent } from './billbord/edit/edit.component';
import { EstateBillboardListComponent } from './billbord/list/list.component';
import { EstateBillboardSelectorComponent } from './billbord/selector/selector.component';
import { EstateBillboardTreeComponent } from './billbord/tree/tree.component';
import { EstatePropertyCompleteComponent } from './property/autocomplete/autocomplete.component';
import { EstateContractTypeCompleteComponent } from './contract-type/autocomplete/autocomplete.component';
import { EstatePropertyTypeUsageCompleteComponent } from './property-type-usage/autocomplete/autocomplete.component';
import { EstatePropertyTypeLanduseCompleteComponent } from './property-type-landuse/autocomplete/autocomplete.component';
import { EstateActivityTypeCompleteComponent } from './activity-type/autocomplete/autocomplete.component';
import { EstateCustomerOrderAddComponent } from './customer-order/add/add.component';
import { EstateCustomerOrderEditComponent } from './customer-order/edit/edit.component';
import { EstateCustomerOrderListComponent } from './customer-order/list/list.component';
import { EstateCustomerOrderSelectorComponent } from './customer-order/selector/selector.component';
import { EstateCustomerOrderTreeComponent } from './customer-order/tree/tree.component';
import { EstatePropertyTypeLanduseSelectionlistComponent } from './property-type-landuse/selectionlist/selectionlist.component';
import { EstateActivityTypeSelectionlistComponent } from './activity-type/selectionlist/selectionlist.component';
import { EstatePropertyHeaderComponent } from './property/header/header.component';
import { EstateBillboardHeaderComponent } from './billbord/header/header.component';
import { EstatePropertyTypeLanduseHeaderComponent } from './property-type-landuse/header/header.component';
import { EstateActivityTypeHeaderComponent } from './activity-type/header/header.component';

import { EstateContractTypeHeaderComponent } from './contract-type/header/header.component';
import { EstateCustomerOrderHeaderComponent } from './customer-order/header/header.component';
import { EstatePropertyTypeUsageHeaderComponent } from './property-type-usage/header/header.component';
import { EstatePropertyActionComponent } from './property/action/action.component';
import { EstateAccountAgencyAdsAddComponent } from './account-agency-ads/add/add.component';
import { EstateAccountAgencyAdsEditComponent } from './account-agency-ads/edit/edit.component';
import { EstateAccountAgencyAdsListComponent } from './account-agency-ads/list/list.component';
import { EstateAccountAgencyAdsSaleListComponent } from './account-agency-ads/sale-list/sale-list.component';
import { EstateAccountAgencyAdsSalePaymentComponent } from './account-agency-ads/sale-payment/sale-payment.component';
import { EstatePropertyProjectAddComponent } from './property-project/add/add.component';
import { EstatePropertyProjectDeleteComponent } from './property-project/delete/delete.component';
import { EstatePropertyProjectEditComponent } from './property-project/edit/edit.component';
import { EstatePropertyProjectListComponent } from './property-project/list/list.component';
import { EstatePropertyProjectSelectorComponent } from './property-project/selector/selector.component';
import { EstatePropertyProjectComponent } from './property-project/header/header.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { EstatePropertyQuickViewComponent } from './property/quick-view/quick-view.component';
import { EstatePropertyExpertPriceAddComponent } from './property-expert-price/add/add.component';
import { EstatePropertyExpertPriceEditComponent } from './property-expert-price/edit/edit.component';
import { EstatePropertyExpertPriceHeaderComponent } from './property-expert-price/header/header.component';
import { EstatePropertyExpertPriceListComponent } from './property-expert-price/list/list.component';
import { EstatePropertyExpertPriceInquiryCalculateComponent } from './property-expert-price/inquiry-calculate/inquiry-calculate.component';
import { EstatePropertyExpertPriceInquiryListComponent } from './property-expert-price/inquiry-list/inquiry-list.component';
import { EstateCustomerOrderResultListComponent } from './customer-order-result/list/list.component';
import { EstateCustomerOrderResultViewComponent } from './customer-order-result/view/view.component';
import { EstateCustomerOrderActionComponent } from './customer-order/action/action.component';
import { EstatePropertyQuickListComponent } from './property/quick-list/quick-list.component';

@NgModule({
  declarations: [
    EstateComponent,
    /* */
    EstatePropertyTypeLanduseAddComponent,
    EstatePropertyTypeLanduseEditComponent,
    EstatePropertyTypeLanduseListComponent,
    EstatePropertyTypeLanduseSelectorComponent,
    EstatePropertyTypeLanduseTreeComponent,
    EstatePropertyTypeLanduseCompleteComponent,
    EstatePropertyTypeLanduseSelectionlistComponent,
    EstatePropertyTypeLanduseHeaderComponent,
     /* */
     EstateActivityTypeAddComponent,
     EstateActivityTypeEditComponent,
     EstateActivityTypeListComponent,
     EstateActivityTypeSelectorComponent,
     EstateActivityTypeTreeComponent,
     EstateActivityTypeCompleteComponent,
     EstateActivityTypeSelectionlistComponent,
     EstateActivityTypeHeaderComponent,
    /* */
    EstatePropertyProjectAddComponent,
    EstatePropertyProjectEditComponent,
    EstatePropertyProjectListComponent,
    EstatePropertyProjectSelectorComponent,
    EstatePropertyProjectDeleteComponent,
    EstatePropertyProjectComponent,
    /* */
    EstatePropertyTypeUsageAddComponent,
    EstatePropertyTypeUsageEditComponent,
    EstatePropertyTypeUsageListComponent,
    EstatePropertyTypeUsageSelectorComponent,
    EstatePropertyTypeUsageTreeComponent,
    EstatePropertyTypeUsageSelectionlistComponent,
    EstatePropertyTypeUsageCompleteComponent,
    EstatePropertyTypeUsageHeaderComponent,
    /* */
    EstatePropertyAddComponent,
    EstatePropertyEditComponent,
    EstatePropertyListComponent,
    EstatePropertySelectorComponent,
    EstatePropertyCompleteComponent,
    EstatePropertyHeaderComponent,
    EstatePropertyActionComponent,
    EstatePropertyQuickViewComponent,
    EstatePropertyQuickListComponent,
    /* */
    EstatePropertyHistoryAddComponent,
    EstatePropertyHistoryEditComponent,
    EstatePropertyHistoryListComponent,
    /* */
    EstatePropertyAdsAddComponent,
    EstatePropertyAdsEditComponent,
    EstatePropertyAdsListComponent,
    EstatePropertyAdsSaleListComponent,
    EstatePropertyAdsSalePaymentComponent,
    /* */
    EstateAdsTypeAddComponent,
    EstateAdsTypeEditComponent,
    EstateAdsTypeListComponent,
    EstateAdsTypeSelectorComponent,
    /* */
    EstateContractTypeAddComponent,
    EstateContractTypeEditComponent,
    EstateContractTypeListComponent,
    EstateContractTypeSelectorComponent,
    EstateContractTypeTreeComponent,
    EstateContractTypeCompleteComponent,
    EstateContractTypeHeaderComponent,
    /* */
    EstateBillboardAddComponent,
    EstateBillboardEditComponent,
    EstateBillboardListComponent,
    EstateBillboardSelectorComponent,
    EstateBillboardTreeComponent,
    EstateBillboardHeaderComponent,
    /* */
    EstateCustomerOrderAddComponent,
    EstateCustomerOrderEditComponent,
    EstateCustomerOrderListComponent,
    EstateCustomerOrderSelectorComponent,
    EstateCustomerOrderTreeComponent,
    EstateCustomerOrderHeaderComponent,
    EstateCustomerOrderActionComponent,
    /* */
    EstateCustomerOrderResultListComponent,
    EstateCustomerOrderResultViewComponent,
    /* */
    EstatePropertyDetailGroupAddComponent,
    EstatePropertyDetailGroupEditComponent,
    EstatePropertyDetailGroupListComponent,
    EstatePropertyDetailGroupSelectorComponent,
    EstatePropertyDetailGroupTreeComponent,
    /* */
    EstatePropertyDetailAddComponent,
    EstatePropertyDetailEditComponent,
    EstatePropertyDetailListComponent,
    EstatePropertyDetailSelectorComponent,
    EstatePropertyDetailTreeComponent,
    /* */
    EstatePropertyExpertPriceAddComponent,
    EstatePropertyExpertPriceEditComponent,
    EstatePropertyExpertPriceHeaderComponent,
    EstatePropertyExpertPriceListComponent,
    EstatePropertyExpertPriceInquiryCalculateComponent,
    EstatePropertyExpertPriceInquiryListComponent,
    /* */

    EstateAccountUserAddComponent,
    EstateAccountUserEditComponent,
    EstateAccountUserListComponent,
    EstateAccountUserSelectorComponent,
    EstateAccountUserTreeComponent,
    /* */
    EstateAccountAgencyAddComponent,
    EstateAccountAgencyEditComponent,
    EstateAccountAgencyListComponent,
    EstateAccountAgencySelectorComponent,
    EstateAccountAgencyTreeComponent,
    /* */
    EstateAccountAgencyTypeUserAddComponent,
    EstateAccountAgencyTypeUserEditComponent,
    EstateAccountAgencyTypeUserListComponent,
    EstateAccountAgencyTypeUserSelectorComponent,
    /* */
    EstateAccountAgencyAdsAddComponent,
    EstateAccountAgencyAdsEditComponent,
    EstateAccountAgencyAdsListComponent,
    EstateAccountAgencyAdsSaleListComponent,
    EstateAccountAgencyAdsSalePaymentComponent,

  ],
  imports: [
    CommonModule,
    EstateRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
    AngularEditorModule,
    

    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    IconPickerModule,
    DragDropModule,
    ColorPickerModule,
    InlineSVGModule,
  ],
  providers: [
    CoreModuleService,
    FileCategoryService,
    CoreEnumService,
    CoreAuthService,
    /*Config*/
    EstateConfigurationService,
    /*Config*/
    /** */
    EstateAccountAgencyService,
    EstateAccountAgencyTypeUserService,
    EstateAccountUserService,
    EstateContractService,
    EstateContractTypeService,
    EstateEnumService,
    EstateBillboardService,
    EstateCustomerOrderService,
    EstateCustomerOrderResultService,
    EstatePropertyService,
    EstatePropertyAccountTypeUserService,
    EstatePropertyDetailGroupService,
    EstatePropertyDetailService,
    EstatePropertyExpertPriceService,
    EstatePropertyHistoryService,
    EstatePropertyShareAgencyService,
    EstatePropertyShareAgentService,
    EstatePropertyShareSiteService,
    EstatePropertyProjectService,
    EstatePropertyTypeLanduseService,
    EstateActivityTypeService,
    EstatePropertyTypeUsageService,
    EstatePropertyTypeService,
    EstatePropertyAdsService,
    EstateAdsTypeService,
    /** */
    EstateAccountAgencyAdsService,
    /** */
    CmsConfirmationDialogService,
    CoreModuleTagService,
    BankPaymentTransactionService,
  ]
})
export class EstateModule { }
