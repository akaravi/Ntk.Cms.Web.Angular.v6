//**msh */
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CoreSiteCategoryCmsModuleModel,
  CoreSiteCategoryCmsModuleService,
  DataFieldInfoModel,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-core-sitecategorycmsmodule-listview',
  templateUrl: './listview.component.html',
})
export class CoreSiteCategoryCmsModuleListViewComponent implements OnInit, OnDestroy {
  @Input() set optionSiteCategoryId(x: number) {
    this.linkSiteCategoryId = x;
    this.DataGetAll();
  }
  linkSiteCategoryId = 0;
  constructor(
    private coreSiteCategoryCmsModuleService: CoreSiteCategoryCmsModuleService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  tableContentSelected = [];
  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreSiteCategoryCmsModuleModel> = new ErrorExceptionResult<CoreSiteCategoryCmsModuleModel>();
  tokenInfo = new TokenInfoModel();
  @Input() loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreSiteCategoryCmsModuleModel> = [];
  tableRowSelected: CoreSiteCategoryCmsModuleModel = new CoreSiteCategoryCmsModuleModel();
  tableSource: MatTableDataSource<CoreSiteCategoryCmsModuleModel> = new MatTableDataSource<CoreSiteCategoryCmsModuleModel>();


  tabledisplayedColumns: string[] = [
    'virtual_CmsSiteCategory.Title',
    'virtual_CmsModule.Title',
    'virtual_CmsModule.Description',
  ];


  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.SortColumn = 'Title';
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
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreSiteCategoryCmsModuleModel();
    this.filteModelContent.AccessLoad = true;

    const filteModel = JSON.parse(JSON.stringify(this.filteModelContent));
    if (this.linkSiteCategoryId && this.linkSiteCategoryId > 0) {
      const fastfilter = new FilterDataModel();
      fastfilter.PropertyName = 'LinkCmsSiteCategoryId';
      fastfilter.Value = this.linkSiteCategoryId;
      filteModel.Filters.push(fastfilter);
    }
    const pName = this.constructor.name + '.ServiceGetAll';
    this.loading.Start(pName, 'در حال دریافت لیست ماژول ها');
    this.coreSiteCategoryCmsModuleService.ServiceGetAll(filteModel).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);

        if (ret.IsSuccess) {
          if (this.linkSiteCategoryId && this.linkSiteCategoryId > 0) {
            this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
              this.tabledisplayedColumns,
              'virtual_CmsSiteCategory.Title'
            );
          }
          this.dataModelResult = ret;
          this.tableSource.data = ret.ListItems;
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


  onActionbuttonReload(): void {
    this.DataGetAll();
  }

  onActionTableRowSelect(row: CoreSiteCategoryCmsModuleModel): void {
    this.tableRowSelected = row;
  }

}
