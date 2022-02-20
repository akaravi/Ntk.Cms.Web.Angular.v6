import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleSiteUserCreditCalculateDtoModel, CoreSiteService } from 'ntk-cms-api';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CmsBankpaymentTransactionInfoComponent } from 'src/app/shared/cms-bankpayment-transaction-info/cms-bankpayment-transaction-info.component';
import { CoreModuleSiteUserCreditChargePaymentComponent } from '../charge-payment/charge-payment.component';

@Component({
    selector: 'app-coremodule-site-credit-charge',
    templateUrl: './charge.component.html',
    styleUrls: ['./charge.component.scss'],
})
export class CoreModuleSiteUserCreditChargeComponent implements OnInit {
    requestLinkModuleId = 0;
    constructor(
        @Inject(DOCUMENT) private document: any,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private coreSiteService: CoreSiteService,
        private cmsToastrService: CmsToastrService,
        private router: Router,
        private translate: TranslateService
    ) {
        this.requestLinkModuleId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkModuleId'));
        this.dataModelCalculate.LinkModuleId = this.requestLinkModuleId;
    }
    currency = '';
    viewCalculate = false;
    loading = new ProgressSpinnerModel();
    dataModelCalculate: CoreModuleSiteUserCreditCalculateDtoModel = new CoreModuleSiteUserCreditCalculateDtoModel();

    ngOnInit(): void {
        this.DataGetCurrency();
        const transactionId = + localStorage.getItem('TransactionId');
        if (transactionId > 0) {
            const dialogRef = this.dialog.open(CmsBankpaymentTransactionInfoComponent, {
                // height: "90%",
                data: {
                    Id: transactionId,
                },
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (result && result.dialogChangedDate) {
                    localStorage.removeItem('TransactionId');
                }
            });
        }
    }

    DataGetCurrency(): void {
        this.coreSiteService.ServiceGetCurrencyMaster().subscribe(
            (next) => {
                if (next.IsSuccess) {
                    this.currency = next.Item;
                }
            },
            (error) => {
                this.cmsToastrService.typeError(error);
            }
        );
    }

    onActionbuttonBuy(): void {
        const dialogRef = this.dialog.open(CoreModuleSiteUserCreditChargePaymentComponent, {
            height: '90%',
            data: {
                Credit: this.dataModelCalculate.Credit,
                LinkModuleId: this.dataModelCalculate.LinkModuleId,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.dialogChangedDate) {

            }
        });
    }

    onActionBackToParent(): void {
        this.router.navigate(['/coremodule/site-user-credit/']);
    }
}

