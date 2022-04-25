import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  DataFieldInfoModel,
  EnumClauseType,
  EnumRecordStatus,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  NewsCategoryModel,
  NewsContentModel,
  NewsContentService,
  NtkCmsApiStoreService,
  TokenInfoModel,
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
import { NewsContentDeleteComponent } from '../delete/delete.component';
import { Observable, Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsLinkToComponent } from 'src/app/shared/cms-link-to/cms-link-to.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-news-content-list',
  templateUrl: './list.component.html',
})
export class NewsContentListComponent implements OnInit, OnDestroy {
  constructor(
    public publicHelper: PublicHelper,
    public contentService: NewsContentService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private tokenHelper: TokenHelper,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
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
  categoryModelSelected: NewsCategoryModel;
  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<NewsContentModel> = [];
  tableRowSelected: NewsContentModel = new NewsContentModel();
  tableSource: MatTableDataSource<NewsContentModel> = new MatTableDataSource<NewsContentModel>();
  tabledisplayedColumns: string[] = [
    'LinkMainImageIdSrc',
    'Id',
    'RecordStatus',
    'Title',
    'CreatedDate',
    'UpdatedDate',
    'Action',
    "LinkTo",
  ];
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  cmsApiStoreSubscribe: Subscription;
  GetAllWithHierarchyCategoryId = false;
  ngOnInit(): void {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((ret) => {
      this.tokenInfo = ret;
      this.DataGetAll();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new NewsContentModel();
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
    this.filteModelContent.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    if (this.GetAllWithHierarchyCategoryId) {
      /** GetAllWithHierarchyCategoryId */
      let selectId = 0;
      if (this.categoryModelSelected?.Id > 0) {
        selectId = this.categoryModelSelected.Id;
      }
      const pName = this.constructor.name + '.ServiceGetAllWithHierarchyCategoryId';
      this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
      this.contentService.ServiceGetAllWithHierarchyCategoryId(selectId, filterModel).subscribe({
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
          }
          this.loading.Stop(pName);
        },
        error: (e) => {
          this.cmsToastrService.typeError(e);
          this.loading.Stop(pName);
        },
        complete: () => {

        }
      });

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
      const pName = this.constructor.name + '.ServiceGetAll';
      this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
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
          }
          this.loading.Stop(pName);
        },
        error: (e) => {
          this.cmsToastrService.typeError(e);

          this.loading.Stop(pName);
        },
        complete: () => {

        }
      });
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
  onActionSelectorSelect(model: NewsCategoryModel | null): void {
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
    this.router.navigate(['/news/content/add', this.categoryModelSelected.Id]);
  }
  onActionbuttonEditRow(model: NewsContentModel = this.tableRowSelected): void {
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
    this.router.navigate(['/news/content/edit', this.tableRowSelected.Id]);
  }
  onActionbuttonDeleteRow(model: NewsContentModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      const emessage = 'ردیفی برای حذف انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(emessage); return;
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
    const dialogRef = this.dialog.open(NewsContentDeleteComponent, { height: '90%', data: { id: this.tableRowSelected.Id } });
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
    this.contentService.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          statist.set('All', ret.TotalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
      },
      error: (e) => {
        this.cmsToastrService.typeError(e);
      }
    });
    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.PropertyName = 'RecordStatus';
    fastfilter.Value = EnumRecordStatus.Available;
    filterStatist1.Filters.push(fastfilter);
    const pName = this.constructor.name + '.ServiceGetCount';
    this.loading.Start(pName, 'دریافت آمار');
    this.contentService.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          statist.set('Active', ret.TotalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
        this.loading.Stop(pName);
      }
      ,
      error: (e) => {
        this.cmsToastrService.typeError(e);
        this.loading.Stop(pName);
      }
    });
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
    const pName = this.constructor.name + '.ServiceExportFile';
    this.loading.Start(pName, 'دریافت فایل خروجی');
    this.contentService.ServiceExportFile(model).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          exportlist.set('Download', ret.LinkFile);
          this.optionsExport.childMethods.setExportLinkFile(exportlist);
        }
        this.loading.Stop(pName);
      },
      error: (e) => {
        this.cmsToastrService.typeError(e);
        this.loading.Stop(pName);
      }
    });
  }
  onActionbuttonReload(): void {
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.Filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: NewsContentModel): void {
    this.tableRowSelected = row;
  }
  onActionbuttonComment(model: NewsContentModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.router.navigate(['/news/comment/', model.Id]);
  }
  onActionbuttonLinkTo(model: NewsContentModel = this.tableRowSelected): void {
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
    const pName = this.constructor.name + "ServiceGetOneById";
    this.loading.Start(pName, "دریافت اطلاعات خبر");
    this.contentService
      .ServiceGetOneById(this.tableRowSelected.Id)
      .subscribe({
        next: (ret) => {
          if (ret.IsSuccess) {
            //open popup
            const dialogRef = this.dialog.open(CmsLinkToComponent, {
              // height: "90%",
              data: {
                Title: ret.Item.Title,
                UrlViewContentQRCodeBase64: ret.Item.UrlViewContentQRCodeBase64,
                UrlViewContent: ret.Item.UrlViewContent,
              },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result && result.dialogChangedDate) {
                this.DataGetAll();
              }
            });
            //open popup
          } else {
            this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (e) => {
          this.cmsToastrService.typeError(e);
          this.loading.Stop(pName);
        }
      });
  }
}