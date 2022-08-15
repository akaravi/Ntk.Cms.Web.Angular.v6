
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreSiteService, DataProviderModuleCalculateDtoModel } from 'ntk-cms-api';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CmsBankpaymentTransactionInfoComponent } from 'src/app/shared/cms-bankpayment-transaction-info/cms-bankpayment-transaction-info.component';
import { DataProviderClientChargePaymentComponent } from '../charge-payment/charge-payment.component';

@Component({
    selector: 'app-data-provider-client-charge',
    templateUrl: './charge.component.html',
})
export class DataProviderClientChargeComponent implements OnInit {
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
    price = '';
    currency = '';
    viewCalculate = false;
    loading = new ProgressSpinnerModel();
    dataModelCalculate: DataProviderModuleCalculateDtoModel = new DataProviderModuleCalculateDtoModel();
    LinkPlanPriceId = this.dataModelCalculate.linkPlanPriceId;

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
        const dialogRef = this.dialog.open(DataProviderClientChargePaymentComponent, {
            height: '90%',
            data: {
                LinkPlanPriceId: this.dataModelCalculate.linkPlanPriceId,
                LinkClientId: this.dataModelCalculate.linkClientId,
            }

        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.dialogChangedDate) {

            }
        });
    }

    onActionBackToParent(): void {
        this.router.navigate(['/data-provider/client/']);
    }
    onInputChange(e: Event): void {
        this.price = (<HTMLInputElement>e.target).value;
    }
}

