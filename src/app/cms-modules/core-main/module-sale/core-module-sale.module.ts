import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CoreModuleSaleHeaderGroupService,
  CoreModuleSaleHeaderService,
  CoreModuleSaleSerialService,
  CoreModuleSaleItemService,
  CoreModuleSaleInvoiceDetailService,
  CoreModuleSaleInvoiceService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CoreModuleSaleComponent } from './core-module-sale.component';
import { CoreModuleSaleRouting } from './core-module-sale.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModuleSaleHeaderGroupListComponent } from './header-group/list/list.component';
import { CoreModuleSaleHeaderGroupAddComponent } from './header-group/add/add.component';
import { CoreModuleSaleHeaderGroupEditComponent } from './header-group/edit/edit.component';
import { CoreModuleSaleHeaderGroupSelectorComponent } from './header-group/selector/selector.component';
import { CoreModuleSaleHeaderGroupTreeComponent } from './header-group/tree/tree.component';
import { CoreModuleSaleHeaderListComponent } from './header/list/list.component';
import { CoreModuleSaleHeaderAddComponent } from './header/add/add.component';
import { CoreModuleSaleHeaderEditComponent } from './header/edit/edit.component';
import { CoreModuleSaleHeaderSelectorComponent } from './header/selector/selector.component';
import { CoreModuleSaleHeaderTreeComponent } from './header/tree/tree.component';
import { CoreModuleSaleItemListComponent } from './Item/list/list.component';
import { CoreModuleSaleItemAddComponent } from './Item/add/add.component';
import { CoreModuleSaleItemEditComponent } from './Item/edit/edit.component';
import { CoreModuleSaleItemSelectorComponent } from './Item/selector/selector.component';
import { CoreModuleSaleItemTreeComponent } from './Item/tree/tree.component';
import { CoreModuleSaleSerialListComponent } from './serial/list/list.component';
import { CoreModuleSaleSerialAddComponent } from './serial/add/add.component';
import { CoreModuleSaleSerialEditComponent } from './serial/edit/edit.component';
import { CoreModuleSaleSerialSelectorComponent } from './serial/selector/selector.component';
import { CoreModuleSaleSerialTreeComponent } from './serial/tree/tree.component';
import { CoreModuleSaleInvoiceDetailListComponent } from './invoice-detail/list/list.component';
import { CoreModuleSaleInvoiceListComponent } from './invoice/list/list.component';
import { CoreModuleSaleInvoiceViewComponent } from './invoice/view/view.component';
import { CoreModuleSaleInvoiceDetailViewComponent } from './invoice-detail/view/view.component';
import { CoreModuleSaleHeaderGroupHeaderComponent } from './header-group/header/header.component';
import { CoreModuleSaleHeaderHeaderComponent } from './header/header/header.component';
import { CoreModuleSaleSerialCheckListComponent } from './serial/check-list/check-list.component';
import { CoreModuleSaleSerialHeaderComponent } from './serial/header/header.component';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { CoreModuleSaleHeaderSaleListComponent } from './header/sale-list/sale-list.component';
import { CoreModuleSaleItemListViewComponent } from './Item/listview/listview.component';
import { CoreModuleSaleHeaderSalePaymentComponent } from './header/sale-payment/sale-payment.component';

@NgModule({
  declarations: [
    CoreModuleSaleComponent,
    /** */
    CoreModuleSaleHeaderGroupListComponent,
    CoreModuleSaleHeaderGroupAddComponent,
    CoreModuleSaleHeaderGroupEditComponent,
    CoreModuleSaleHeaderGroupSelectorComponent,
    CoreModuleSaleHeaderGroupTreeComponent,
    CoreModuleSaleHeaderGroupHeaderComponent,
    /** */
    /** */
    CoreModuleSaleHeaderListComponent,
    CoreModuleSaleHeaderAddComponent,
    CoreModuleSaleHeaderEditComponent,
    CoreModuleSaleHeaderSelectorComponent,
    CoreModuleSaleHeaderTreeComponent,
    CoreModuleSaleHeaderHeaderComponent,
    CoreModuleSaleHeaderSaleListComponent,
    CoreModuleSaleHeaderSalePaymentComponent,
    /** */
    /** */
    CoreModuleSaleItemListComponent,
    CoreModuleSaleItemAddComponent,
    CoreModuleSaleItemEditComponent,
    CoreModuleSaleItemSelectorComponent,
    CoreModuleSaleItemTreeComponent,
    CoreModuleSaleItemListViewComponent,
    /** */
    /** */
    CoreModuleSaleSerialListComponent,
    CoreModuleSaleSerialAddComponent,
    CoreModuleSaleSerialEditComponent,
    CoreModuleSaleSerialSelectorComponent,
    CoreModuleSaleSerialTreeComponent,
    CoreModuleSaleSerialHeaderComponent,
    CoreModuleSaleSerialCheckListComponent,
    /** */
    /** */
    CoreModuleSaleInvoiceListComponent,
    CoreModuleSaleInvoiceViewComponent,
    /** */
    /** */
    CoreModuleSaleInvoiceDetailListComponent,
    CoreModuleSaleInvoiceDetailViewComponent,
    /** */
  ],
  exports: [
    CoreModuleSaleComponent,
    /** */
    CoreModuleSaleHeaderGroupListComponent,
    CoreModuleSaleHeaderGroupAddComponent,
    CoreModuleSaleHeaderGroupEditComponent,
    CoreModuleSaleHeaderGroupSelectorComponent,
    CoreModuleSaleHeaderGroupTreeComponent,
    /** */
    /** */
    CoreModuleSaleHeaderListComponent,
    CoreModuleSaleHeaderAddComponent,
    CoreModuleSaleHeaderEditComponent,
    CoreModuleSaleHeaderSelectorComponent,
    CoreModuleSaleHeaderTreeComponent,
    CoreModuleSaleHeaderSaleListComponent,
    CoreModuleSaleHeaderSalePaymentComponent,
    /** */
    /** */
    CoreModuleSaleItemListComponent,
    CoreModuleSaleItemAddComponent,
    CoreModuleSaleItemEditComponent,
    CoreModuleSaleItemSelectorComponent,
    CoreModuleSaleItemTreeComponent,
    CoreModuleSaleItemListViewComponent,
    /** */
    /** */
    CoreModuleSaleSerialListComponent,
    CoreModuleSaleSerialAddComponent,
    CoreModuleSaleSerialEditComponent,
    CoreModuleSaleSerialSelectorComponent,
    CoreModuleSaleSerialTreeComponent,
    CoreModuleSaleSerialHeaderComponent,
    CoreModuleSaleSerialCheckListComponent,
    /** */
    /** */
    CoreModuleSaleInvoiceListComponent,
    CoreModuleSaleInvoiceViewComponent,
    /** */
    /** */
    CoreModuleSaleInvoiceDetailListComponent,
    CoreModuleSaleInvoiceDetailViewComponent,
    /** */
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreModuleSaleRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule,
  ],
  providers: [
    CoreModuleSaleHeaderGroupService,
    CoreModuleSaleSerialService,
    CoreModuleSaleItemService,
    CoreModuleSaleInvoiceDetailService,
    CoreModuleSaleInvoiceService,
    CoreModuleSaleHeaderGroupService,
    CoreModuleSaleHeaderService,
  ]
})
export class CoreModuleSaleModule {
}
