
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CoreEnumService,
  CoreModuleModel,
  CoreModuleSaleItemModel,
  CoreModuleSaleItemService,
  CoreModuleService,
  DataFieldInfoModel,
  EnumInfoModel,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';

@Component({
  selector: 'app-core-modulesaleitem-listview',
  templateUrl: './listview.component.html',
})
export class CoreModuleSaleItemListViewComponent implements OnInit, OnDestroy {
  @Input() set optionHeaderId(x: number) {
    this.linkHeaderId = x;
    this.DataGetAll();
  }
  linkHeaderId = 0;
  constructor(
    private coreModuleSaleItemService: CoreModuleSaleItemService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private coreModuleService: CoreModuleService,
    private coreEnumService: CoreEnumService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
  ) {
    this.loading.cdr = this.cdr;
  }
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  tableContentSelected = [];
  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreModuleSaleItemModel> = new ErrorExceptionResult<CoreModuleSaleItemModel>();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreModuleSaleItemModel> = [];
  tableRowSelected: CoreModuleSaleItemModel = new CoreModuleSaleItemModel();
  tableSource: MatTableDataSource<CoreModuleSaleItemModel> = new MatTableDataSource<CoreModuleSaleItemModel>();
  dataModelCoreModuleResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();
  dataModelEnumCmsModuleSaleItemTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();


  tabledisplayedColumns: string[] = [
    'LinkModuleId',
    'MonthLength',
    'EnumCmsModuleSaleItemType',
  ];


  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.SortColumn = 'Title';
    this.DataGetAll();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.DataGetAll();
      this.tokenInfo = next;
    });
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
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreModuleSaleItemModel();

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.filteModelContent.AccessLoad = true;

    const filteModel = JSON.parse(JSON.stringify(this.filteModelContent));
    if (this.linkHeaderId && this.linkHeaderId > 0) {
      const fastfilter = new FilterDataModel();
      fastfilter.PropertyName = 'LinkModuleSaleHeader';
      fastfilter.Value = this.linkHeaderId;
      filteModel.Filters.push(fastfilter);
    }
    filteModel.SortColumn = 'Id';
    this.coreModuleSaleItemService.ServiceGetAll(filteModel).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.tableSource.data = next.ListItems;
        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);

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


  onActionbuttonReload(): void {
    this.DataGetAll();
  }

  onActionTableRowSelect(row: CoreModuleSaleItemModel): void {
    this.tableRowSelected = row;
  }

}
