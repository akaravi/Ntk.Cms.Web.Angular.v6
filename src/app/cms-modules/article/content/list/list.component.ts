//**msh */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  ArticleCategoryModel,
  ArticleContentModel,
  ArticleContentService,
  TokenInfoModel,
  EnumRecordStatus,
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
import { ArticleContentDeleteComponent } from '../delete/delete.component';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsLinkToComponent } from 'src/app/shared/cms-link-to/cms-link-to.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-article-content-list',
  templateUrl: './list.component.html',
})
export class ArticleContentListComponent implements OnInit, OnDestroy {
  constructor(
    public publicHelper: PublicHelper,
    public contentService: ArticleContentService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    this.optionsExport.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionExport(model),
    };
    /*filter Sort*/
    this.filteModelContent.sortColumn = 'Id';
    this.filteModelContent.sortType = EnumSortType.Descending;
  }
  filteModelContent = new FilterModel();
  categoryModelSelected: ArticleCategoryModel;
  dataModelResult: ErrorExceptionResult<ArticleContentModel> = new ErrorExceptionResult<ArticleContentModel>();

  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<ArticleContentModel> = [];
  tableRowSelected: ArticleContentModel = new ArticleContentModel();
  tableSource: MatTableDataSource<ArticleContentModel> = new MatTableDataSource<ArticleContentModel>();
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
    this.tableRowSelected = new ArticleContentModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    if (this.GetAllWithHierarchyCategoryId) {
      /** GetAllWithHierarchyCategoryId */
      let selectId = 0;
      if (this.categoryModelSelected?.id > 0) {
        selectId = this.categoryModelSelected.id;
      }
      this.contentService.ServiceGetAllWithHierarchyCategoryId(selectId, filterModel).subscribe({
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          if (ret.isSuccess) {
            this.dataModelResult = ret;
            this.tableSource.data = ret.listItems;
            if (this.tokenInfo.userAccessAdminAllowToAllData || this.tokenInfo.userAccessAdminAllowToProfessionalData) {
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
              this.optionsSearch.childMethods.setAccess(ret.access);
            }
          } else {
            this.cmsToastrService.typeerrorMessage(ret.errorMessage);
          }
          this.loading.Stop(pName);

        },
        error: (er) => {
          this.cmsToastrService.typeError(er);

          this.loading.Stop(pName);
        }
      }
      );
      /** GetAllWithHierarchyCategoryId */
    } else {
      /** Normal */
      /** filter Category */
      if (this.categoryModelSelected && this.categoryModelSelected.id > 0) {
        const filterChild = new FilterDataModel();
        let fastfilter = new FilterDataModel();
        fastfilter.propertyName = 'LinkCategoryId';
        fastfilter.value = this.categoryModelSelected.id;
        fastfilter.clauseType = EnumClauseType.Or;
        filterChild.filters.push(fastfilter);
        /** N to N */
        fastfilter = new FilterDataModel();
        fastfilter.propertyName = 'ContentCategores';
        fastfilter.propertyAnyName = 'LinkCategoryId';
        fastfilter.value = this.categoryModelSelected.id;
        fastfilter.clauseType = EnumClauseType.Or;
        filterChild.filters.push(fastfilter);
        filterModel.filters.push(filterChild);
      }
      /** filter Category */
      this.contentService.ServiceGetAllEditor(filterModel).subscribe({
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          if (ret.isSuccess) {
            this.dataModelResult = ret;
            this.tableSource.data = ret.listItems;
            if (this.tokenInfo.userAccessAdminAllowToAllData || this.tokenInfo.userAccessAdminAllowToProfessionalData) {
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
              this.optionsSearch.childMethods.setAccess(ret.access);
            }
          } else {
            this.cmsToastrService.typeerrorMessage(ret.errorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);

          this.loading.Stop(pName);
        }
      }
      );
      /** Normal */
    }
  }
  onTableSortData(sort: MatSort): void {
    if (this.tableSource && this.tableSource.sort && this.tableSource.sort.active === sort.active) {
      if (this.tableSource.sort.start === 'asc') {
        sort.start = 'desc';
        this.filteModelContent.sortColumn = sort.active;
        this.filteModelContent.sortType = EnumSortType.Descending;
      } else if (this.tableSource.sort.start === 'desc') {
        this.filteModelContent.sortColumn = '';
        this.filteModelContent.sortType = EnumSortType.Ascending;
      } else {
        sort.start = 'desc';
      }
    } else {
      this.filteModelContent.sortColumn = sort.active;
      this.filteModelContent.sortType = EnumSortType.Ascending;
    }
    this.tableSource.sort = sort;
    this.filteModelContent.currentPageNumber = 0;
    this.DataGetAll();
  }
  onTablePageingData(event?: PageEvent): void {
    this.filteModelContent.currentPageNumber = event.pageIndex + 1;
    this.filteModelContent.rowPerPage = event.pageSize;
    this.DataGetAll();
  }
  onActionSelectorSelect(model: ArticleCategoryModel | null): void {
    this.filteModelContent = new FilterModel();
    this.categoryModelSelected = model;
    this.DataGetAll();
  }
  onActionbuttonNewRow(): void {
    if (
      this.categoryModelSelected == null ||
      this.categoryModelSelected.id === 0
    ) {
      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorCategoryNotSelected');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    this.router.navigate(['/article/content/add', this.categoryModelSelected.id]);
  }
  onActionbuttonEditRow(model: ArticleContentModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessEditRow
    ) {
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }
    this.router.navigate(['/article/content/edit', this.tableRowSelected.id]);
  }
  onActionbuttonDeleteRow(model: ArticleContentModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id === 0) {
      const emessage = this.translate.instant('MESSAGE.no_row_selected_to_delete');
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;

    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessDeleteRow
    ) {
      this.cmsToastrService.typeErrorAccessDelete();
      return;
    }
    const dialogRef = this.dialog.open(ArticleContentDeleteComponent, { height: '90%', data: { id: this.tableRowSelected.id } });
    dialogRef.afterClosed().subscribe(result => {
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
        if (ret.isSuccess) {
          statist.set('All', ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        } else {
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
        }
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
      }
    }
    );
    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'RecordStatus';
    fastfilter.value = EnumRecordStatus.Available;
    filterStatist1.filters.push(fastfilter);
    this.contentService.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          statist.set('Active', ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        } else {
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
        }
      }
      ,
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
  onActionbuttonWithHierarchy(): void {
    this.GetAllWithHierarchyCategoryId = !this.GetAllWithHierarchyCategoryId;
    this.DataGetAll();
  }
  onSubmitOptionExport(model: FilterModel): void {
    const exportlist = new Map<string, string>();
    exportlist.set('Download', 'loading ... ');
    this.contentService.ServiceExportFile(model).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          exportlist.set('Download', ret.linkFile);
          this.optionsExport.childMethods.setExportLinkFile(exportlist);
        } else {
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
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
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: ArticleContentModel): void {
    this.tableRowSelected = row;
  }
  onActionbuttonComment(model: ArticleContentModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id === 0) {
      this.cmsToastrService.typeErrorSelected(this.translate.instant('MESSAGE.No_row_selected_for_editing'));
      return;
    }
    this.router.navigate(['/article/comment/', model.id]);
  }
  onActionbuttonLinkTo(
    model: ArticleContentModel = this.tableRowSelected
  ): void {
    if (!model || !model.id || model.id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessEditRow
    ) {
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }
    const pName = this.constructor.name + "ServiceGetOneById";
    this.loading.Start(pName, "دریافت اطلاعات مقاله");
    this.contentService
      .ServiceGetOneById(this.tableRowSelected.id)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            //open popup
            const dialogRef = this.dialog.open(CmsLinkToComponent, {
              // height: "90%",
              data: {
                Title: ret.item.title,
                urlViewContentQRCodeBase64: ret.item.urlViewContentQRCodeBase64,
                urlViewContent: ret.item.urlViewContent,
              },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result && result.dialogChangedDate) {
                this.DataGetAll();
              }
            });
            //open popup
          } else {
            this.cmsToastrService.typeerrorMessage(ret.errorMessage);
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
}