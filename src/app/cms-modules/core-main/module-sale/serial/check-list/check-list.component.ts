
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CoreModuleSaleItemModel,
  CoreModuleSaleSerialService,
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
  CoreModuleCheckSerialForSiteDtoModel,
  CoreModuleSaleInvoiceDetailModel,
  CoreModuleSaleInvoiceModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-core-modulesaleserial-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.scss']
})
export class CoreModuleSaleSerialCheckListComponent implements OnInit, OnDestroy {
  requestSerial = '';
  constructor(
    private coreModuleSaleSerialService: CoreModuleSaleSerialService,
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private translate: TranslateService,
    public coreEnumService: CoreEnumService,
    private activatedRoute: ActivatedRoute,
    private coreModuleService: CoreModuleService,
    private router: Router,
    public dialog: MatDialog) {
    this.requestSerial = this.activatedRoute.snapshot.paramMap.get('Serial');
  }
  showBuy = false;
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];
  dataModel: CoreModuleCheckSerialForSiteDtoModel = new CoreModuleCheckSerialForSiteDtoModel();
  dataModelResult: ErrorExceptionResult<CoreModuleSaleInvoiceDetailModel> = new ErrorExceptionResult<CoreModuleSaleInvoiceDetailModel>();
  dataModelRegResult: ErrorExceptionResult<CoreModuleSaleInvoiceModel> = new ErrorExceptionResult<CoreModuleSaleInvoiceModel>();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreModuleSaleInvoiceDetailModel> = [];
  tableRowSelected: CoreModuleSaleInvoiceDetailModel = new CoreModuleSaleInvoiceDetailModel();
  tableSource: MatTableDataSource<CoreModuleSaleInvoiceDetailModel> = new MatTableDataSource<CoreModuleSaleInvoiceDetailModel>();
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

  ngOnInit(): void {
    if (this.requestSerial && this.requestSerial.length > 0) {
      this.DataCheckUseSerialForSite(this.requestSerial);
    }
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      if (this.requestSerial && this.requestSerial.length > 0) {
        this.DataCheckUseSerialForSite(this.requestSerial);
      }
      this.tokenInfo = next;
    });
    this.getEnumCmsModuleSaleItemType();

    this.getModuleList();
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
  DataCheckUseSerialForSite(serial: string): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreModuleSaleInvoiceDetailModel();
    this.loading.display = true;
    this.loading.Globally = false;
    this.tableSource.data = [];
    const model = new CoreModuleCheckSerialForSiteDtoModel();
    model.serialNumber = serial;
    this.showBuy = false;
    this.coreModuleSaleSerialService.ServiceCheckUseSerialForSite(model).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.showBuy = true;
          this.dataModelResult = next;
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
          this.tableSource.data = next.ListItems;

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
  RegisterUseSerialForSite(model: CoreModuleCheckSerialForSiteDtoModel): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreModuleSaleInvoiceDetailModel();

    this.loading.display = true;
    this.loading.Globally = false;
    this.coreModuleSaleSerialService.ServiceRegisterUseSerialForSite(model).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelRegResult = next;
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.The_series_was_successfully_registered_for_you'));

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



  onActionbuttonReload(): void {
    if (!this.dataModel || !this.dataModel.serialNumber || this.dataModel.serialNumber.length === 0) {
      const message = 'مقدار سریال به درستی  وارد نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.DataCheckUseSerialForSite(this.dataModel.serialNumber);
  }
  onActionbuttonBuy(): void {
    if (!this.dataModel || !this.dataModel.serialNumber || this.dataModel.serialNumber.length === 0) {
      const message = 'مقدار سریال به درستی  وارد نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    if (!this.dataModel || !this.dataModel.pwdForUse || this.dataModel.pwdForUse.length === 0) {
      const message = 'مقدار پسورد به درستی  وارد نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.RegisterUseSerialForSite(this.dataModel);
  }

  onActionTableRowSelect(row: CoreModuleSaleInvoiceDetailModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/core/modulesale/serial']);
  }
}
