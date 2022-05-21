//**msh */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  DataProviderTransactionModel,
  DataProviderTransactionService,
  TokenInfoModel,
  EnumRecordStatus,
  DataFieldInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from '../../../../core/helpers/publicHelper';
import { CmsToastrService } from '../../../../core/services/cmsToastr.service';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerModel } from '../../../../core/models/progressSpinnerModel';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchModel';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistModel';
import { ComponentOptionExportModel } from 'src/app/core/cmsComponentModels/base/componentOptionExportModel';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { TranslateService } from '@ngx-translate/core';
import { DataProviderTransactionViewComponent } from '../view/view.component';

@Component({
  selector: 'app-donate-transaction-list',
  templateUrl: './list.component.html',
})
export class DataProviderTransactionListComponent implements OnInit, OnDestroy {
  requestLinkCmsUserId = 0;
  requestLinkPlanId = 0;
  requestLinkPlanPriceId = 0;
  requestLinkClientId = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    public contentService: DataProviderTransactionService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;

    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    this.optionsExport.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionExport(model),
    };
    /*filter Sort*/
    this.filteModelContent.SortColumn = 'Id';
    this.filteModelContent.SortType = EnumSortType.Descending;

  }
  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<DataProviderTransactionModel> = new ErrorExceptionResult<DataProviderTransactionModel>();

  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<DataProviderTransactionModel> = [];
  tableRowSelected: DataProviderTransactionModel = new DataProviderTransactionModel();
  tableSource: MatTableDataSource<DataProviderTransactionModel> = new MatTableDataSource<DataProviderTransactionModel>();
  tabledisplayedColumns: string[] = [
    'Id',
    'LinkSiteId',
    'RecordStatus',
    'LinkClientId',
    'LinkPlanId',
    'LinkPlanPriceId',
    'SystemTransactionId',
    'SystemPaymentIsSuccess',
    'AmountPure',
    'FeeTransport',
    'FeeTax',
    'Amount',
    'CreatedDate',
    'Action'
  ];
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.requestLinkCmsUserId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkCmsUserId'));
    if (this.requestLinkCmsUserId && this.requestLinkCmsUserId > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkCmsUserId';
      filter.Value = this.requestLinkCmsUserId;
      this.filteModelContent.Filters.push(filter);
    }
    this.requestLinkPlanId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkPlanId'));
    if (this.requestLinkPlanId && this.requestLinkPlanId > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkPlanId';
      filter.Value = this.requestLinkPlanId;
      this.filteModelContent.Filters.push(filter);
    }
    this.requestLinkClientId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkClientId'));
    if (this.requestLinkClientId && this.requestLinkClientId > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkClientId';
      filter.Value = this.requestLinkClientId;
      this.filteModelContent.Filters.push(filter);
    }
    this.requestLinkPlanPriceId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkPlanPriceId'));
    if (this.requestLinkPlanPriceId && this.requestLinkPlanPriceId > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkPlanPriceId';
      filter.Value = this.requestLinkPlanPriceId;
      this.filteModelContent.Filters.push(filter);
    }
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.DataGetAll();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    if (
      this.tokenInfo.UserAccessAdminAllowToAllData ||
      this.tokenInfo.UserAccessAdminAllowToProfessionalData
    ) {
      this.tabledisplayedColumns = this.publicHelper.listAddIfNotExist(
        this.tabledisplayedColumns,
        "LinkSiteId",
        0
      );
      this.tabledisplayedColumns = this.publicHelper.listAddIfNotExist(
        this.tabledisplayedColumns,
        "Id",
        0
      );
    } else {
      this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
        this.tabledisplayedColumns,
        "LinkSiteId"
      );
      this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
        this.tabledisplayedColumns,
        "Id"
      );
    }
    this.tableRowsSelected = [];
    this.tableRowSelected = new DataProviderTransactionModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/

    this.contentService.setAccessLoad();
    this.contentService.ServiceGetAllEditor(filterModel).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);
        if (ret.IsSuccess) {
          this.dataModelResult = ret;
          this.tableSource.data = ret.ListItems;
          if (this.tokenInfo.UserAccessAdminAllowToAllData || this.tokenInfo.UserAccessAdminAllowToProfessionalData) {
            this.tabledisplayedColumns = this.publicHelper.listAddIfNotExist(
              this.tabledisplayedColumns,
              'LinkSiteId',
              0
            );
          } else {
            this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
              this.tabledisplayedColumns,
              'LinkSiteId'
            );
          }
          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(ret.Access);
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
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

  onActionbuttonViewRow(model: DataProviderTransactionModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id > 0) {
      this.cmsToastrService.typeErrorSelected();
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
    const dialogRef = this.dialog.open(DataProviderTransactionViewComponent, {
      height: '90%',
      data: { id: this.tableRowSelected.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
      }
    });
  }


  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set('Active', 0);
    statist.set('All', 0);
    this.contentService.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          statist.set('All', ret.TotalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
      }
    }
    );

    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.PropertyName = 'RecordStatus';
    fastfilter.Value = EnumRecordStatus.Available;
    filterStatist1.Filters.push(fastfilter);
    this.contentService.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          statist.set('Active', ret.TotalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
      }
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
    this.contentService.ServiceExportFile(model).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          exportlist.set('Download', ret.LinkFile);
          this.optionsExport.childMethods.setExportLinkFile(exportlist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
      }
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
  onActionTableRowSelect(row: DataProviderTransactionModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {

    if (this.requestLinkCmsUserId > 0) {
      this.router.navigate(['/data-provider/plan/']);
    }
    else if (this.requestLinkPlanId > 0) {
      this.router.navigate(['/data-provider/plan/']);
    } else if (this.requestLinkPlanPriceId > 0) {
      this.router.navigate(['/data-provider/plan-price/']);
    } else if (this.requestLinkClientId > 0) {
      this.router.navigate(['/data-provider/client/']);
    }
  }
}
