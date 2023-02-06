import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DonateComponent } from './donate.component';
import { DonateRoutes } from './donate.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from 'src/app/shared.module';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { IconPickerModule } from 'ngx-icon-picker';
import {
  CoreAuthService,
  CoreEnumService,
  CoreModuleService,
  CoreModuleTagService,
  DonateConfigurationService,
  DonateEnumService,
  DonateLogViewService,
  DonateSponsorService,
  DonateTargetCategoryService,
  DonateTargetPeriodService,
  DonateTargetPeriodSponsorService,
  DonateTargetService,
  DonateTransactionService
} from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { DonateLogViewListComponent } from './log-view/list/list.component';
import { DonateLogViewComponent } from './log-view/view/view.component';
import { DonateSponserAddComponent } from './sponser/add/add.component';
import { DonateSponserDeleteComponent } from './sponser/delete/delete.component';
import { DonateSponserEditComponent } from './sponser/edit/edit.component';
import { DonateSponserHeaderComponent } from './sponser/header/header.component';
import { DonateSponserListComponent } from './sponser/list/list.component';
import { DonateSponserSelectorComponent } from './sponser/selector/selector.component';
import { DonateSponserTreeComponent } from './sponser/tree/tree.component';
import { DonateTargetCategoryAddComponent } from './target-category/add/add.component';
import { DonateTargetCategoryDeleteComponent } from './target-category/delete/delete.component';
import { DonateTargetCategoryEditComponent } from './target-category/edit/edit.component';
import { DonateTargetCategorySelectorComponent } from './target-category/selector/selector.component';
import { DonateTargetCategoryTreeComponent } from './target-category/tree/tree.component';
import { DonateTargetPeriodSponserAddComponent } from './target-period-sponsor/add/add.component';
import { DonateTargetPeriodSponserDeleteComponent } from './target-period-sponsor/delete/delete.component';
import { DonateTargetPeriodSponserEditComponent } from './target-period-sponsor/edit/edit.component';
import { DonateTargetPeriodSponserHeaderComponent } from './target-period-sponsor/header/header.component';
import { DonateTargetPeriodSponserListComponent } from './target-period-sponsor/list/list.component';
import { DonateTargetPeriodSponserSelectorComponent } from './target-period-sponsor/selector/selector.component';
import { DonateTargetPeriodSponserTreeComponent } from './target-period-sponsor/tree/tree.component';
import { DonateTargetPeriodAddComponent } from './target-period/add/add.component';
import { DonateTargetPeriodChargePaymentComponent } from './target-period/charge-payment/charge-payment.component';
import { DonateTargetPeriodChargeComponent } from './target-period/charge/charge.component';
import { DonateTargetPeriodDeleteComponent } from './target-period/delete/delete.component';
import { DonateTargetPeriodEditComponent } from './target-period/edit/edit.component';
import { DonateTargetPeriodHeaderComponent } from './target-period/header/header.component';
import { DonateTargetPeriodListComponent } from './target-period/list/list.component';
import { DonateTargetPeriodSelectorComponent } from './target-period/selector/selector.component';
import { DonateTargetAddComponent } from './target/add/add.component';
import { DonateTargetDeleteComponent } from './target/delete/delete.component';
import { DonateTargetEditComponent } from './target/edit/edit.component';
import { DonateTargetHeaderComponent } from './target/header/header.component';
import { DonateTargetListComponent } from './target/list/list.component';
import { DonateTargetSelectorComponent } from './target/selector/selector.component';
import { DonateTargetTreeComponent } from './target/tree/tree.component';
import { DonateTransactionListComponent } from './transaction/list/list.component';
import { DonateTransactionViewComponent } from './transaction/view/view.component';

@NgModule({
  declarations: [
    DonateComponent,
    /* */
    DonateTargetCategoryAddComponent,
    DonateTargetCategoryEditComponent,
    DonateTargetCategoryDeleteComponent,
    DonateTargetCategorySelectorComponent,
    DonateTargetCategoryTreeComponent,
    /* */
    DonateTargetAddComponent,
    DonateTargetEditComponent,
    DonateTargetDeleteComponent,
    DonateTargetSelectorComponent,
    DonateTargetTreeComponent,
    DonateTargetHeaderComponent,
    DonateTargetListComponent,
    /* */
    DonateSponserListComponent,
    DonateSponserAddComponent,
    DonateSponserDeleteComponent,
    DonateSponserEditComponent,
    DonateSponserSelectorComponent,
    DonateSponserTreeComponent,
    DonateSponserHeaderComponent,
    /* */
    DonateTargetPeriodListComponent,
    DonateTargetPeriodAddComponent,
    DonateTargetPeriodEditComponent,
    DonateTargetPeriodDeleteComponent,
    DonateTargetPeriodHeaderComponent,
    DonateTargetPeriodSelectorComponent,
    DonateTargetPeriodChargeComponent,
    DonateTargetPeriodChargePaymentComponent,
    /* */
    DonateTargetPeriodSponserListComponent,
    DonateTargetPeriodSponserAddComponent,
    DonateTargetPeriodSponserDeleteComponent,
    DonateTargetPeriodSponserEditComponent,
    DonateTargetPeriodSponserHeaderComponent,
    DonateTargetPeriodSponserSelectorComponent,
    DonateTargetPeriodSponserTreeComponent,
    /* */
    DonateLogViewListComponent,
    DonateLogViewComponent,
    /* */
    DonateTransactionListComponent,
    DonateTransactionViewComponent,


  ],
  imports: [
    CommonModule,
    DonateRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule.forRoot(),
    AngularEditorModule,


    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    IconPickerModule,
    DragDropModule,
    InlineSVGModule,
  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    CoreAuthService,
    /*Config*/
    DonateConfigurationService,
    /*Config*/
    /** */
    DonateEnumService,
    DonateLogViewService,
    DonateSponsorService,
    DonateTargetService,
    DonateTargetCategoryService,
    DonateTargetPeriodService,
    DonateTargetPeriodSponsorService,
    DonateTransactionService,
    /** */
    CmsConfirmationDialogService,
    CoreModuleTagService,

  ]
})
export class DonateModule { }
