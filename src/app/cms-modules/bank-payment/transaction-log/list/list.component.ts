import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  ApplicationAppModel,
  BankPaymentEnumService,
  BankPaymentTransactionLogModel,
  BankPaymentTransactionLogService,
  CoreAuthService,
  DataFieldInfoModel,
  EnumModel,
  EnumRecordStatus,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  NtkCmsApiStoreService,
  TokenInfoModel
} from 'ntk-cms-api';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialog } from '@angular/material/dialog';
import { ComponentOptionExportModel } from 'src/app/core/cmsComponentModels/base/componentOptionExportModel';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistModel';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { BankPaymentTransactionLogViewComponent } from '../view/view.component';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';

@Component({
  selector: 'app-bankpayment-transactionlog-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class BankPaymentTransactionLogListComponent implements OnInit, OnDestroy {
  requestLinkTransactionId = 0;
  constructor(
    private bankPaymentTransactionLogService: BankPaymentTransactionLogService,
    private activatedRoute: ActivatedRoute,
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private bankPaymentEnumService: BankPaymentEnumService,
    private router: Router,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog) {
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    this.optionsExport.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionExport(model),
    };
    /*filter Sort*/
    this.filteModelContent.SortColumn = 'CreatedDate';
    this.filteModelContent.SortType = EnumSortType.Descending;
  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];
  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<BankPaymentTransactionLogModel> = new ErrorExceptionResult<BankPaymentTransactionLogModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  categoryModelSelected: ApplicationAppModel;
  tableRowsSelected: Array<BankPaymentTransactionLogModel> = [];
  tableRowSelected: BankPaymentTransactionLogModel = new BankPaymentTransactionLogModel();
  tableSource: MatTableDataSource<BankPaymentTransactionLogModel> = new MatTableDataSource<BankPaymentTransactionLogModel>();
  dataModelEnumTransactionRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  tabledisplayedColumns: string[] = [
    'Id',
    'TransactionStatus',
    'LinkTransactionId',
    'Memo',
    'CreatedDate',
    'Action'
  ];


  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  expandedElement: BankPaymentTransactionLogModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {

    this.requestLinkTransactionId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkTransactionId'));
    if (this.requestLinkTransactionId > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkTransactionId';
      filter.Value = this.requestLinkTransactionId;
      this.filteModelContent.Filters.push(filter);
    }

    this.DataGetAll();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.DataGetAll();
      this.tokenInfo = next;
    });
    this.getEnumTransactionRecordStatus();
  }
  getEnumTransactionRecordStatus(): void {
    this.bankPaymentEnumService.ServiceEnumTransactionRecordStatus().subscribe((next) => {
      this.dataModelEnumTransactionRecordStatusResult = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }

  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new BankPaymentTransactionLogModel();

    this.loading.Start('main');
    this.cdr.detectChanges();
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    const filter = new FilterDataModel();

    if (this.categoryModelSelected && this.categoryModelSelected.Id > 0) {
      filter.PropertyName = 'LinkTransactionId';
      filter.Value = this.categoryModelSelected.Id;
      filterModel.Filters.push(filter);
    }
    this.bankPaymentTransactionLogService.ServiceGetAll(filterModel).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.tableSource.data = next.ListItems;

          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(next.Access);
          }
        }
        this.loading.Stop('main');
        this.cdr.detectChanges();
      },
      (error) => {
        this.cmsToastrService.typeError(error);

        this.loading.Stop('main');
        this.cdr.detectChanges();
      }
    );
  }


  onTableSortData(sort: MatSort): void {
    if (this.tableSource && this.tableSource.sort && this.tableSource.sort.active === sort.active) {
      if (this.tableSource.sort.start === 'asc') {
        sort.start = 'desc';
        this.filteModelContent.SortColumn = sort.active;
        this.filteModelContent.SortType = EnumSortType.Descending;
      } else if (this.tableSource.sort.start === 'desc') {
        this.filteModelContent.SortColumn = '';
        this.filteModelContent.SortType = EnumSortType.Ascending;
      } else {
        sort.start = 'desc';
      }
    } else {
      this.filteModelContent.SortColumn = sort.active;
      this.filteModelContent.SortType = EnumSortType.Ascending;
    }
    this.tableSource.sort = sort;
    this.filteModelContent.CurrentPageNumber = 0;
    this.DataGetAll();
  }
  onTablePageingData(event?: PageEvent): void {
    this.filteModelContent.CurrentPageNumber = event.pageIndex + 1;
    this.filteModelContent.RowPerPage = event.pageSize;
    this.DataGetAll();
  }


  onActionbuttonViewRow(model: BankPaymentTransactionLogModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id <= 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessWatchRow
    ) {
      this.cmsToastrService.typeErrorAccessWatch();
      return;
    }
    const dialogRef = this.dialog.open(BankPaymentTransactionLogViewComponent, {
      data: { id: this.tableRowSelected.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
      }
    });
  }


  onActionbuttonDeleteRow(model: BankPaymentTransactionLogModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id <= 0) {
      const emessage = 'ردیفی برای حذف انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;

    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessDeleteRow
    ) {
      this.cmsToastrService.typeErrorAccessDelete();
      return;
    }
    // const dialogRef = this.dialog.open(NewsCommentDeleteComponent, {
    //   data: { id: this.tableRowSelected.Id }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log(`Dialog result: ${result}`);
    //   if (result && result.dialogChangedDate) {
    //     this.DataGetAll();
    //   }
    // });
  }
  onActionbuttonNotifictionActionSend(model: BankPaymentTransactionLogModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id <= 0) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    this.tableRowSelected = model;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessEditRow
    ) {
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }
    // const dialogRef = this.dialog.open(BankPaymentTransactionLogActionSendComponent, {
    //   data: { LinkApplicationMemberId: this.tableRowSelected.LinkApplicationMemberId }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log(`Dialog result: ${result}`);
    //   if (result && result.dialogChangedDate) {

    //   }
    // });
  }
  onActionSelectorSelect(model: ApplicationAppModel | null): void {
    this.filteModelContent = new FilterModel();
    this.categoryModelSelected = model;

    this.DataGetAll();
  }
  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set('Active', 0);
    statist.set('All', 0);
    this.bankPaymentTransactionLogService.ServiceGetCount(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          statist.set('All', next.TotalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
      }
    );

    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.PropertyName = 'RecordStatus';
    fastfilter.Value = EnumRecordStatus.Available;
    filterStatist1.Filters.push(fastfilter);
    this.bankPaymentTransactionLogService.ServiceGetCount(filterStatist1).subscribe(
      (next) => {
        if (next.IsSuccess) {
          statist.set('Active', next.TotalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
      }
      ,
      (error) => {
        this.cmsToastrService.typeError(error);
      }
    );

  }
  onActionbuttonExport(): void {
    this.optionsExport.data.show = !this.optionsExport.data.show;
    this.optionsExport.childMethods.setExportFilterModel(this.filteModelContent);
  }
  onSubmitOptionExport(model: FilterModel): void {
    const exportlist = new Map<string, string>();
    exportlist.set('Download', 'loading ... ');
    this.bankPaymentTransactionLogService.ServiceExportFile(model).subscribe(
      (next) => {
        if (next.IsSuccess) {
          exportlist.set('Download', next.LinkFile);
          this.optionsExport.childMethods.setExportLinkFile(exportlist);
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
      }
    );
  }

  onActionbuttonReload(): void {
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.Filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: BankPaymentTransactionLogModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/bankpayment/transaction/']);
  }

}
