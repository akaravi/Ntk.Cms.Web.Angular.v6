
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreSiteService, DataProviderModuleCalculateDtoModel } from 'ntk-cms-api';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CmsBankpaymentTransactionInfoComponent } from 'src/app/shared/cms-bankpayment-transaction-info/cms-bankpayment-transaction-info.component';
import { DataProviderPlanPriceChargePaymentComponent } from '../charge-payment/charge-payment.component';

@Component({
    selector: 'app-data-provider-plan-price-charge',
    templateUrl: './charge.component.html',
})
export class DataProviderPlanPriceChargeComponent implements OnInit {
    requestLinkClientId = 0;
    constructor(
        @Inject(DOCUMENT) private document: any,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private coreSiteService: CoreSiteService,
        private cmsToastrService: CmsToastrService,
        private router: Router,
        public translate: TranslateService
    ) {
        this.requestLinkClientId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkClientId'));
        this.dataModelCalculate.linkClientId = this.requestLinkClientId;
    }
    currency = '';
    viewCalculate = false;
    loading = new ProgressSpinnerModel();
    dataModelCalculate: DataProviderModuleCalculateDtoModel = new DataProviderModuleCalculateDtoModel();

    ngOnInit(): void {
        this.DataGetCurrency();
        const transactionId = + localStorage.getItem('TransactionId');
        if (transactionId > 0) {
            const dialogRef = this.dialog.open(CmsBankpaymentTransactionInfoComponent, {
                // height: "90%",
                data: {
                    id: transactionId,
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
        this.coreSiteService.ServiceGetCurrencyMaster().subscribe({
            next: (ret) => {
                if (ret.isSuccess) {
                    this.currency = ret.item;
                }
            },
            error: (er) => {
                this.cmsToastrService.typeError(er);
            }
        }
        );
    }

    onActionbuttonBuy(): void {
        const dialogRef = this.dialog.open(DataProviderPlanPriceChargePaymentComponent, {
            height: '90%',
            data: {
                linkPlanPriceId: this.dataModelCalculate.linkPlanPriceId,
                linkClientId: this.dataModelCalculate.linkClientId,
            }

        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.dialogChangedDate) {

            }
        });
    }

    onActionBackToParent(): void {
        this.router.navigate(['/donate/target-period/']);
    }
}

