
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CoreSiteCategoryCmsModuleModel,
  CoreSiteCategoryCmsModuleService,
  DataFieldInfoModel,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  NtkCmsApiStoreService,
  TokenInfoModel
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-core-sitecategorycmsmodule-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss']
})
export class CoreSiteCategoryCmsModuleListViewComponent implements OnInit, OnDestroy {
  @Input() set optionSiteCategoryId(x: number) {
    this.linkSiteCategoryId = x;
    this.DataGetAll();
  }
  linkSiteCategoryId = 0;
  constructor(
    private coreSiteCategoryCmsModuleService: CoreSiteCategoryCmsModuleService,
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
  ) {
  }
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  tableContentSelected = [];
  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreSiteCategoryCmsModuleModel> = new ErrorExceptionResult<CoreSiteCategoryCmsModuleModel>();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreSiteCategoryCmsModuleModel> = [];
  tableRowSelected: CoreSiteCategoryCmsModuleModel = new CoreSiteCategoryCmsModuleModel();
  tableSource: MatTableDataSource<CoreSiteCategoryCmsModuleModel> = new MatTableDataSource<CoreSiteCategoryCmsModuleModel>();


  tabledisplayedColumns: string[] = [
    'LinkCmsSiteCategoryId',
    'LinkCmsModuleId',
    'virtual_CmsSiteCategory.Title',
    'virtual_CmsModule.Title',
    'virtual_CmsModule.Description',
  ];


  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.SortColumn = 'Title';
    this.DataGetAll();
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.DataGetAll();
      this.tokenInfo = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreSiteCategoryCmsModuleModel();

    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;

    const filteModel = JSON.parse(JSON.stringify(this.filteModelContent));
    if (this.linkSiteCategoryId && this.linkSiteCategoryId > 0) {
      const fastfilter = new FilterDataModel();
      fastfilter.PropertyName = 'LinkCmsSiteCategoryId';
      fastfilter.Value = this.linkSiteCategoryId;
      filteModel.Filters.push(fastfilter);
    }

    this.coreSiteCategoryCmsModuleService.ServiceGetAll(filteModel).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.tableSource.data = next.ListItems;
        }
        this.loading.display = false;
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.display = false;
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

  onActionTableRowSelect(row: CoreSiteCategoryCmsModuleModel): void {
    this.tableRowSelected = row;
  }

}
