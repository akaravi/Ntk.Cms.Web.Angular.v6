import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  EnumRecordStatus,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  BlogCategoryModel,
  BlogContentModel,
  BlogContentService,
  NtkCmsApiStoreService,
  TokenInfoModel,
  DataFieldInfoModel,
  EnumClauseType,
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
import { BlogContentDeleteComponent } from '../delete/delete.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-content-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class BlogContentListComponent implements OnInit, OnDestroy {

  constructor(
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private contentService: BlogContentService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public dialog: MatDialog
  ) {
    // this.optionsCategoryTree.parentMethods = {
    //   onActionSelect: (x) => this.onActionSelectorSelect(x),
    // };

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
  categoryModelSelected: BlogCategoryModel;
  dataModelResult: ErrorExceptionResult<BlogContentModel> = new ErrorExceptionResult<BlogContentModel>();

  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<BlogContentModel> = [];
  tableRowSelected: BlogContentModel = new BlogContentModel();
  tableSource: MatTableDataSource<BlogContentModel> = new MatTableDataSource<BlogContentModel>();
  tabledisplayedColumns: string[] = [
    'LinkMainImageIdSrc',
    'Id',
    'RecordStatus',
    'Title',
    'CreatedDate',
    'UpdatedDate',
    'Action'
  ];
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  cmsApiStoreSubscribe: Subscription;
  GetAllWithHierarchyCategoryId = false;
  ngOnInit(): void {

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
    this.tableRowSelected = new BlogContentModel();


    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/

    if (this.GetAllWithHierarchyCategoryId) {
      /** GetAllWithHierarchyCategoryId */
      this.contentService.ServiceGetAllWithHierarchyCategoryId(this.categoryModelSelected.Id, filterModel).subscribe(
        (next) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
          if (next.IsSuccess) {
            this.dataModelResult = next;
            this.tableSource.data = next.ListItems;
            if (this.tokenInfo.UserAccessAdminAllowToAllData) {
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
              this.optionsSearch.childMethods.setAccess(next.Access);
            }
          }
          this.loading.display = false;
        },
        (error) => {
          this.cmsToastrService.typeError(error);

          this.loading.display = false;
        }
      );
      /** GetAllWithHierarchyCategoryId */
    } else {
      /** Normal */
      /** filter Category */
      if (this.categoryModelSelected && this.categoryModelSelected.Id > 0) {
        const filterChild = new FilterDataModel();
        let fastfilter = new FilterDataModel();
        fastfilter.PropertyName = 'LinkCategoryId';
        fastfilter.Value = this.categoryModelSelected.Id;
        fastfilter.ClauseType = EnumClauseType.Or;
        filterChild.Filters.push(fastfilter);
        /** N to N */
        fastfilter = new FilterDataModel();
        fastfilter.PropertyName = 'ContentCategores';
        fastfilter.PropertyAnyName = 'LinkCategoryId';
        fastfilter.Value = this.categoryModelSelected.Id;
        fastfilter.ClauseType = EnumClauseType.Or;
        filterChild.Filters.push(fastfilter);
        filterModel.Filters.push(filterChild);
      }
      /** filter Category */
      this.contentService.ServiceGetAll(filterModel).subscribe(
        (next) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);


          if (next.IsSuccess) {
            this.dataModelResult = next;
            this.tableSource.data = next.ListItems;
            if (this.tokenInfo.UserAccessAdminAllowToAllData) {
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
              this.optionsSearch.childMethods.setAccess(next.Access);
            }
          }
          this.loading.display = false;
        },
        (error) => {
          this.cmsToastrService.typeError(error);

          this.loading.display = false;
        }
      );
      /** Normal */
    }
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

  onActionSelectorSelect(model: BlogCategoryModel | null): void {
    this.filteModelContent = new FilterModel();
    this.categoryModelSelected = model;

    this.DataGetAll();
  }

  onActionbuttonNewRow(): void {
    if (
      this.categoryModelSelected == null ||
      this.categoryModelSelected.Id === 0
    ) {
      const message = 'دسته بندی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    this.router.navigate(['/blog/content/add', this.categoryModelSelected.Id]);
  }

  onActionbuttonEditRow(model: BlogContentModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
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
    this.router.navigate(['/blog/content/edit', this.tableRowSelected.Id]);
  }
  onActionbuttonDeleteRow(model: BlogContentModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
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
    const dialogRef = this.dialog.open(BlogContentDeleteComponent, { data: { id: this.tableRowSelected.Id } });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
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
    this.contentService.ServiceGetCount(this.filteModelContent).subscribe(
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
    this.contentService.ServiceGetCount(filterStatist1).subscribe(
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
  onActionbuttonWithHierarchy(): void {
    this.GetAllWithHierarchyCategoryId = !this.GetAllWithHierarchyCategoryId;
    this.DataGetAll();
  }
  onSubmitOptionExport(model: FilterModel): void {
    const exportlist = new Map<string, string>();
    exportlist.set('Download', 'loading ... ');
    this.contentService.ServiceExportFile(model).subscribe(
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
  onActionTableRowSelect(row: BlogContentModel): void {
    this.tableRowSelected = row;
  }
  onActionbuttonComment(model: BlogContentModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.router.navigate(['/blog/comment/', model.Id]);
  }
}
