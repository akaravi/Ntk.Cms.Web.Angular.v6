
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CoreModuleSaleHeaderService,
  ErrorExceptionResult,
  FilterModel,
  NtkCmsApiStoreService,
  TokenInfoModel,
  DataFieldInfoModel,
  CoreModuleSaleHeaderModel,
  CoreEnumService,
  EnumModel,
  CoreModuleService,
  CoreModuleModel,
  CoreModuleSaleInvoiceDetailModel,
  CoreModuleSaleInvoiceModel,
  CoreModuleSaleItemModel,
  CoreSiteService,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CoreModuleSaleHeaderSalePaymentComponent } from '../sale-payment/sale-payment.component';

@Component({
  selector: 'app-core-modulesaleheader-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class CoreModuleSaleHeaderSaleListComponent implements OnInit, OnDestroy {
  constructor(
    private coreModuleSaleHeaderService: CoreModuleSaleHeaderService,
    private coreSiteService: CoreSiteService,
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    private coreModuleService: CoreModuleService,
    private router: Router,
    public dialog: MatDialog) {
  }
  showBuy = false;
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];
  dataModel: CoreModuleSaleInvoiceDetailModel = new CoreModuleSaleInvoiceDetailModel();
  dataModelResult: ErrorExceptionResult<CoreModuleSaleHeaderModel> = new ErrorExceptionResult<CoreModuleSaleHeaderModel>();
  dataModelItemResult: ErrorExceptionResult<CoreModuleSaleItemModel> = new ErrorExceptionResult<CoreModuleSaleItemModel>();
  dataModelRegResult: ErrorExceptionResult<CoreModuleSaleInvoiceModel> = new ErrorExceptionResult<CoreModuleSaleInvoiceModel>();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreModuleSaleHeaderModel> = [];
  tableRowSelected: CoreModuleSaleHeaderModel = new CoreModuleSaleHeaderModel();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  categoryModelSelected: CoreModuleSaleHeaderModel = new CoreModuleSaleHeaderModel();
  dataModelEnumCmsModuleSaleItemTypeResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelCoreModuleResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();

  tabledisplayedColumns: string[] = [
    'LinkModuleId',
    'EnumCmsModuleSaleItemType',
    'FromDate',
    'ExpireDate',
  ];



  expandedElement: CoreModuleSaleItemModel | null;
  cmsApiStoreSubscribe: Subscription;
  currency = '';

  ngOnInit(): void {

    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {

      this.tokenInfo = next;
    });
    // this.getEnumCmsModuleSaleItemType();

    this.DataGetAll();
    this.DataGetCurrency();
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
  getModuleList(): void {
    const filter = new FilterModel();
    filter.RowPerPage = 100;
    this.coreModuleService.ServiceGetAllModuleName(filter).subscribe((next) => {
      this.dataModelCoreModuleResult = next;
    });
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
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreModuleSaleHeaderModel();
    this.loading.display = true;
    this.loading.Globally = false;

    this.showBuy = false;
    const model = new FilterModel();
    this.coreModuleSaleHeaderService.ServiceGetAllSale(model).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.showBuy = true;
          this.dataModelResult = next;
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
        }
        else {
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.display = false;
      },
      (error) => {
        this.cmsToastrService.typeError(error);

        this.loading.display = false;
      }
    );
  }


  onActionbuttonDetail(model: CoreModuleSaleHeaderModel): void {
    this.tableRowSelected = model;
  }
  onActionbuttonBuy(model: CoreModuleSaleHeaderModel): void {
    this.tableRowSelected = model;

    const dialogRef = this.dialog.open(CoreModuleSaleHeaderSalePaymentComponent, {
      data: { LinkHeaderId: model.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {

      }
    });
  }

  onActionBackToParent(): void {
    this.router.navigate(['/core/modulesale/Header']);
  }
}
