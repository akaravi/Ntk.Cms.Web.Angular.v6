import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstatePropertyListComponent } from './property/list/list.component';
import { EstateComponent } from './estate.component';
import { EstateContractTypeListComponent } from './contract-type/list/list.component';
import { EstatePropertyDetailGroupListComponent } from './property-detail-group/list/list.component';
import { EstatePropertyDetailListComponent } from './property-detail/list/list.component';
import { EstateAccountAgencyListComponent } from './account-agency/list/list.component';
import { EstateAccountUserListComponent } from './account-user/list/list.component';
import { EstatePropertyAddComponent } from './property/add/add.component';
import { EstatePropertyEditComponent } from './property/edit/edit.component';
import { EstatePropertyTypeLanduseListComponent } from './property-type-landuse/list/list.component';
import { EstatePropertyTypeUsageListComponent } from './property-type-usage/list/list.component';
import { EstatePropertyAdsListComponent } from './property-ads/list/list.component';
import { EstateAdsTypeListComponent } from './ads-type/list/list.component';
import { EstatePropertyAdsSaleListComponent } from './property-ads/sale-list/sale-list.component';
import { EstateBillboardListComponent } from './billbord/list/list.component';
import { EstateCustomerOrderListComponent } from './customer-order/list/list.component';
import { EstateCustomerOrderAddComponent } from './customer-order/add/add.component';
import { EstateCustomerOrderEditComponent } from './customer-order/edit/edit.component';
import { EstateBillboardAddComponent } from './billbord/add/add.component';
import { EstateBillboardEditComponent } from './billbord/edit/edit.component';
import { EstatePropertyProjectListComponent } from './property-project/list/list.component';
import { EstatePropertyProjectAddComponent } from './property-project/add/add.component';
import { EstatePropertyProjectEditComponent } from './property-project/edit/edit.component';
import { EstateActivityTypeListComponent } from './activity-type/list/list.component';
import { EstatePropertyHistoryListComponent } from './property-history/list/list.component';
import { EstatePropertyExpertPriceListComponent } from './property-expert-price/list/list.component';
import { EstateCustomerOrderResultListComponent } from './customer-order-result/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: EstateComponent,
    children: [
      /* Config */
      {
        path: 'config',
        loadChildren: () =>
          import('./config/estate-config.module').then((m) => m.EstateConfigModule),
      },
      /* Config */
      {
        path: 'property',
        component: EstatePropertyListComponent
      },
      {
        path: 'property/LinkPropertyTypeLanduseId/:LinkPropertyTypeLanduseId',
        component: EstatePropertyListComponent
      },
      {
        path: 'property/LinkPropertyTypeUsageId/:LinkPropertyTypeUsageId',
        component: EstatePropertyListComponent
      },
      {
        path: 'property/LinkContractTypeId/:LinkContractTypeId',
        component: EstatePropertyListComponent
      },
      {
        path: 'property/LinkBillboardId/:LinkBillboardId',
        component: EstatePropertyListComponent
      },
      {
        path: 'property/LinkCustomerOrderId/:LinkCustomerOrderId',
        component: EstatePropertyListComponent
      },
      {
        path: 'property/LinkUserId/:LinkUserId',
        component: EstatePropertyListComponent
      },
      {
        path: 'property/LinkProjectId/:LinkProjectId',
        component: EstatePropertyListComponent
      },
      {
        path: 'property/LinkEstateUserId/:LinkEstateUserId',
        component: EstatePropertyListComponent
      },
      {
        path: 'property/LinkEstateAgencyId/:LinkEstateAgencyId',
        component: EstatePropertyListComponent
      },
      {
        path: 'property/InChecking/:InChecking',
        component: EstatePropertyListComponent
      },
      {
        path: 'property/add',
        component: EstatePropertyAddComponent
      },
      {
        path: 'property/add/LinkPropertyTypeLanduseId/:LinkPropertyTypeLanduseId',
        component: EstatePropertyAddComponent
      },
      {
        path: 'property/edit/:id',
        component: EstatePropertyEditComponent
      },
      /**/
      {
        path: 'property-type-usage',
        component: EstatePropertyTypeUsageListComponent
      },
      {
        path: 'property-type-landuse',
        component: EstatePropertyTypeLanduseListComponent
      },
      /**/
      {
        path: 'property-ads/LinkPropertyId/:LinkPropertyId',
        component: EstatePropertyAdsListComponent
      },
      {
        path: 'property-ads',
        component: EstatePropertyAdsListComponent
      },
      {
        path: 'property-ads/sale/:LinkPropertyId',
        component: EstatePropertyAdsSaleListComponent
      },
      /**/
      {
        path: 'activity-type',
        component: EstateActivityTypeListComponent
      },
      /**/
      {
        path: 'property-history',
        component: EstatePropertyHistoryListComponent
      },
      {
        path: 'property-history/LinkPropertyId/:LinkPropertyId',
        component: EstatePropertyHistoryListComponent
      },
      {
        path: 'property-history/LinkAgentId/:LinkAgentId',
        component: EstatePropertyHistoryListComponent
      },
      {
        path: 'property-history/LinkCustomerOrderId/:LinkCustomerOrderId',
        component: EstatePropertyHistoryListComponent
      },
      /**/
      {
        path: 'expert-price',
        component: EstatePropertyExpertPriceListComponent
      },
      /**/
      {
        path: 'ads-type',
        component: EstateAdsTypeListComponent
      },
      /**/
      {
        path: 'account-agency',
        component: EstateAccountAgencyListComponent
      },
      /**/    {
        path: 'account-user',
        component: EstateAccountUserListComponent
      },
      {
        path: 'account-user/LinkAccountAgencyId/:LinkAccountAgencyId',
        component: EstateAccountUserListComponent
      },
      /**/
      {
        path: 'contract-type',
        component: EstateContractTypeListComponent
      },
      /**/
      {
        path: 'billboard',
        component: EstateBillboardListComponent
      },
      {
        path: 'billboard/add',
        component: EstateBillboardAddComponent
      },
      {
        path: 'billboard/add-copy/:id',
        component: EstateBillboardAddComponent
      },
      {
        path: 'billboard/edit/:id',
        component: EstateBillboardEditComponent
      },
      /**/
      {
        path: 'property-project',
        component: EstatePropertyProjectListComponent
      },
      {
        path: 'property-project/add',
        component: EstatePropertyProjectAddComponent
      },
      {
        path: 'property-project/edit/:id',
        component: EstatePropertyProjectEditComponent
      },
      {
        path: 'customer-order',
        component: EstateCustomerOrderListComponent
      },
      {
        path: 'customer-order/add',
        component: EstateCustomerOrderAddComponent
      },
      {
        path: 'customer-order/add-copy/:id',
        component: EstateCustomerOrderAddComponent
      },
      {
        path: 'customer-order/add/LinkParentId/:LinkParentId',
        component: EstateCustomerOrderAddComponent
      },
      {
        path: 'customer-order/edit/:id',
        component: EstateCustomerOrderEditComponent
      },
      /**/
      {
        path: 'customer-order-result/LinkCustomerOrder/:LinkCustomerOrder',
        component: EstateCustomerOrderResultListComponent
      },
      {
        path: 'customer-order-result/LinkProperty/:LinkProperty',
        component: EstateCustomerOrderResultListComponent
      },
      /**/
      {
        path: 'property-detail-group',
        component: EstatePropertyDetailGroupListComponent
      },
      /**/
      {
        path: 'property-detail',
        component: EstatePropertyDetailListComponent
      },
      {
        path: 'property-detail/LinkPropertyTypeLanduseId/:LinkPropertyTypeLanduseId',
        component: EstatePropertyDetailListComponent
      },
      /** */

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstateRoutes {
}
