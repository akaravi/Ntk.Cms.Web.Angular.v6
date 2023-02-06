import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModuleSaleHeaderGroupListComponent } from './header-group/list/list.component';
import { CoreModuleSaleHeaderListComponent } from './header/list/list.component';
import { CoreModuleSaleHeaderSaleListComponent } from './header/sale-list/sale-list.component';
import { CoreModuleSaleInvoiceDetailListComponent } from './invoice-detail/list/list.component';
import { CoreModuleSaleInvoiceListComponent } from './invoice/list/list.component';
import { CoreModuleSaleItemListComponent } from './Item/list/list.component';
import { CoreModuleSaleSerialCheckListComponent } from './serial/check-list/check-list.component';
import { CoreModuleSaleSerialListComponent } from './serial/list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'headergroup',
        component: CoreModuleSaleHeaderGroupListComponent
      },
      /** */
      {
        path: 'header',
        component: CoreModuleSaleHeaderListComponent
      },
      {
        path: 'header/sale',
        component: CoreModuleSaleHeaderSaleListComponent
      }
      ,
      {
        path: 'header/:LinkHeaderGroupId',
        component: CoreModuleSaleHeaderListComponent
      },
      /** */
      {
        path: 'invoice',
        component: CoreModuleSaleInvoiceListComponent
      },
      {
        path: 'invoicedetail',
        component: CoreModuleSaleInvoiceDetailListComponent
      },
      {
        path: 'invoicedetail/LinkInvoiceId/:LinkInvoiceId',
        component: CoreModuleSaleInvoiceDetailListComponent
      },
      {
        path: 'item',
        component: CoreModuleSaleItemListComponent
      },
      {
        path: 'item/LinkModuleSaleHeader/:LinkModuleSaleHeader',
        component: CoreModuleSaleItemListComponent
      },
      {
        path: 'serial',
        component: CoreModuleSaleSerialListComponent
      },
      {
        path: 'serial/checklist',
        component: CoreModuleSaleSerialCheckListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreModuleSaleRouting {
}
