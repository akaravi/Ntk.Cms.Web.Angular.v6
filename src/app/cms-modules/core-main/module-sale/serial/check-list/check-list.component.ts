
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreModuleCheckSerialForSiteDtoModel, CoreModuleModel, CoreModuleSaleHeaderModel, CoreModuleSaleInvoiceDetailModel,
  CoreModuleSaleInvoiceModel, CoreModuleSaleItemModel,
  CoreModuleSaleSerialService, CoreModuleService, DataFieldInfoModel, EnumInfoModel, ErrorExceptionResult,
  FilterModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-modulesaleserial-check-list',
  templateUrl: './check-list.component.html',
})
export class CoreModuleSaleSerialCheckListComponent implements OnInit, OnDestroy {
  requestSerial = '';
  constructor(
    private coreModuleSaleSerialService: CoreModuleSaleSerialService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    public coreEnumService: CoreEnumService,
    private activatedRoute: ActivatedRoute,
    private coreModuleService: CoreModuleService,
    private tokenHelper: TokenHelper,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
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
  dataModelEnumCmsModuleSaleItemTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
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
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
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
    filter.rowPerPage = 100;
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
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.tableSource.data = [];
    const model = new CoreModuleCheckSerialForSiteDtoModel();
    model.serialNumber = serial;
    this.showBuy = false;
    this.coreModuleSaleSerialService.ServiceCheckUseSerialForSite(model).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.showBuy = true;
          this.dataModelResult = ret;
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          this.tableSource.data = ret.listItems;
        }
        else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }
  RegisterUseSerialForSite(model: CoreModuleCheckSerialForSiteDtoModel): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreModuleSaleInvoiceDetailModel();

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.coreModuleSaleSerialService.ServiceRegisterUseSerialForSite(model).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelRegResult = ret;
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.The_series_was_successfully_registered_for_you'));
        }
        else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }



  onActionbuttonReload(): void {
    if (!this.dataModel || !this.dataModel.serialNumber || this.dataModel.serialNumber.length === 0) {
      const message = this.translate.instant('MESSAGE.Serial_value_is_not_entered_correctly');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.DataCheckUseSerialForSite(this.dataModel.serialNumber);
  }
  onActionbuttonBuy(): void {
    if (!this.dataModel || !this.dataModel.serialNumber || this.dataModel.serialNumber.length === 0) {
      const message = this.translate.instant('MESSAGE.Serial_value_is_not_entered_correctly');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    if (!this.dataModel || !this.dataModel.pwdForUse || this.dataModel.pwdForUse.length === 0) {
      const message = this.translate.instant('MESSAGE.Password_value_is_not_entered_correctly');
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
