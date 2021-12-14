
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  EstateAdsTypeService,
  ErrorExceptionResult,
  FilterModel,
  TokenInfoModel,
  EstateAdsTypeModel,
  CoreEnumService,
  EnumInfoModel,
  CoreSiteService,
  BankPaymentTransactionService,
  BankPaymentTransactionModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EstatePropertyAdsSalePaymentComponent } from '../sale-payment/sale-payment.component';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsBankpaymentTransactionInfoComponent } from 'src/app/shared/cms-bankpayment-transaction-info/cms-bankpayment-transaction-info.component';

@Component({
  selector: 'app-estate-propertyads-salelist',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class EstatePropertyAdsSaleListComponent implements OnInit, OnDestroy {
  requestLinkPropertyId = '';
  constructor(
    private estateAdsTypeService: EstateAdsTypeService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    private coreSiteService: CoreSiteService,
    private tokenHelper: TokenHelper,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) {
    this.loading.cdr = this.cdr;
    this.requestLinkPropertyId = this.activatedRoute.snapshot.paramMap.get('LinkPropertyId');
  }
  showBuy = false;
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];
  dataModelResult: ErrorExceptionResult<EstateAdsTypeModel> = new ErrorExceptionResult<EstateAdsTypeModel>();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowSelected: EstateAdsTypeModel = new EstateAdsTypeModel();
  categoryModelSelected: EstateAdsTypeModel = new EstateAdsTypeModel();
  dataModelEnumCmsModuleSaleItemTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
 
  tabledisplayedColumns: string[] = [
    'LinkModuleId',
    'EnumCmsModuleSaleItemType',
    'FromDate',
    'ExpireDate',
  ];



  // expandedElement: CoreModuleSaleItemModel | null;
  cmsApiStoreSubscribe: Subscription;
  currency = '';

  ngOnInit(): void {
    if (!this.requestLinkPropertyId || this.requestLinkPropertyId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.router.navigate(['/estate/property']);
      return;
    }
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {

      this.tokenInfo = next;
    });

    this.DataGetAll();
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
          // localStorage.removeItem('TransactionId');
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

  getEnumCmsModuleSaleItemType(): void {
    this.coreEnumService.ServiceEnumCmsModuleSaleItemType().subscribe((next) => {
      this.dataModelEnumCmsModuleSaleItemTypeResult = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowSelected = new EstateAdsTypeModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);



    this.showBuy = false;
    const model = new FilterModel();
    this.estateAdsTypeService.ServiceGetAllSale(model).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.showBuy = true;
          this.dataModelResult = next;
         
        }
        else {
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
  }

  onActionbuttonBuy(model: EstateAdsTypeModel): void {
    this.tableRowSelected = model;

    const dialogRef = this.dialog.open(EstatePropertyAdsSalePaymentComponent, {
      height: '90%',
      data: {
        LinkPropertyId: this.requestLinkPropertyId,
        LinkAdsTypeId: model.Id,
        BankPrivateMaster: model.PaymentForMainSite
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {

      }
    });
  }

  onActionBackToParent(): void {
    this.router.navigate(['/estate/property-ads/LinkPropertyId/'+this.requestLinkPropertyId]);
  }
}
