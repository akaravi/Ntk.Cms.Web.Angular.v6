import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreSiteService, DonateModuleCalculateDtoModel } from 'ntk-cms-api';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CmsBankpaymentTransactionInfoComponent } from 'src/app/shared/cms-bankpayment-transaction-info/cms-bankpayment-transaction-info.component';
import { DonateTargetPeriodChargePaymentComponent } from '../charge-payment/charge-payment.component';

@Component({
    selector: 'app-donate-target-period-charge',
    templateUrl: './charge.component.html',
})
export class DonateTargetPeriodChargeComponent implements OnInit {
    requestLinkTargetPeriodId = 0;
    constructor(
        @Inject(DOCUMENT) private document: any,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private coreSiteService: CoreSiteService,
        private cmsToastrService: CmsToastrService,
        private router: Router,
        private translate: TranslateService
    ) {
        this.requestLinkTargetPeriodId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkTargetPeriodId'));
        this.dataModelCalculate.LinkTargetPeriodId = this.requestLinkTargetPeriodId;
    }
    currency = '';
    viewCalculate = false;
    loading = new ProgressSpinnerModel();
    dataModelCalculate: DonateModuleCalculateDtoModel = new DonateModuleCalculateDtoModel();

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
        const dialogRef = this.dialog.open(DonateTargetPeriodChargePaymentComponent, {
            height: '90%',
            data: {
                SupportPayment: this.dataModelCalculate.SupportPayment,
                LinkTargetPeriodId: this.dataModelCalculate.LinkTargetPeriodId,
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

