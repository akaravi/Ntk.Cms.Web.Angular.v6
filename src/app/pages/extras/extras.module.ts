import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
//import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
//import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TicketingTaskService } from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared.module';
import { CartDropdownInnerComponent } from './dropdown-inner/cart-dropdown-inner/cart-dropdown-inner.component';
import { NotificationsDropdownInnerComponent } from './dropdown-inner/notifications-dropdown-inner/notifications-dropdown-inner.component';
import { QuickActionsDropdownInnerComponent } from './dropdown-inner/quick-actions-dropdown-inner/quick-actions-dropdown-inner.component';
import { SearchDropdownInnerComponent } from './dropdown-inner/search-dropdown-inner/search-dropdown-inner.component';
import { SearchResultComponent } from './dropdown-inner/search-dropdown-inner/search-result/search-result.component';
import { UserDropdownInnerComponent } from './dropdown-inner/user-dropdown-inner/user-dropdown-inner.component';
import { CartOffcanvasComponent } from './offcanvas/cart-offcanvas/cart-offcanvas.component';
import { NotificationsOffcanvasComponent } from './offcanvas/notifications-offcanvas/notifications-offcanvas.component';
import { QuickActionsOffcanvasComponent } from './offcanvas/quick-actions-offcanvas/quick-actions-offcanvas.component';
import { QuickPanelOffcanvasComponent } from './offcanvas/quick-panel-offcanvas/quick-panel-offcanvas.component';
import { SearchOffcanvasComponent } from './offcanvas/search-offcanvas/search-offcanvas.component';
import { UserOffcanvasComponent } from './offcanvas/user-offcanvas/user-offcanvas.component';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true,
// };

@NgModule({
  declarations: [
    SearchDropdownInnerComponent,
    NotificationsDropdownInnerComponent,
    QuickActionsDropdownInnerComponent,
    CartDropdownInnerComponent,
    UserDropdownInnerComponent,
    SearchOffcanvasComponent,
    SearchResultComponent,
    NotificationsOffcanvasComponent,
    QuickActionsOffcanvasComponent,
    CartOffcanvasComponent,
    QuickPanelOffcanvasComponent,
    UserOffcanvasComponent,
    ScrollTopComponent,
    ToolbarComponent,
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    // PerfectScrollbarModule,
    // CoreModule,
    RouterModule,
    SharedModule.forRoot(),
  ],
  providers: [
    // {
    //   provide: PERFECT_SCROLLBAR_CONFIG,
    //   useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    // },
    TicketingTaskService
  ],
  exports: [
    SearchDropdownInnerComponent,
    NotificationsDropdownInnerComponent,
    QuickActionsDropdownInnerComponent,
    CartDropdownInnerComponent,
    UserDropdownInnerComponent,
    SearchOffcanvasComponent,
    NotificationsOffcanvasComponent,
    QuickActionsOffcanvasComponent,
    CartOffcanvasComponent,
    QuickPanelOffcanvasComponent,
    UserOffcanvasComponent,
    ToolbarComponent,
    ScrollTopComponent,

  ],
})
export class ExtrasModule { }
