
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CoreSiteCategoryCmsModuleModel,
  CoreSiteCategoryCmsModuleService,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  TokenInfoModel,
  FilterDataModel,
  EnumRecordStatus,
  DataFieldInfoModel,
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
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CoreSiteCategoryCmsModuleEditComponent } from '../edit/edit.component';
import { CoreSiteCategoryCmsModuleAddComponent } from '../add/add.component';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-core-sitecategorycmsmodule-list',
  templateUrl: './list.component.html',
})
export class CoreSiteCategoryCmsModuleListComponent implements OnInit, OnDestroy {
  requestLinkCmsModuleId = 0;
  requestLinkCmsSiteCategoryId = 0;
  constructor(
    public contentService: CoreSiteCategoryCmsModuleService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tokenHelper: TokenHelper,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public dialog: MatDialog) {
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
    this.requestLinkCmsModuleId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkCmsModuleId'));
    this.requestLinkCmsSiteCategoryId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkCmsSiteCategoryId'));
    if (this.requestLinkCmsModuleId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkCmsModuleId';
      filter.value = this.requestLinkCmsModuleId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkCmsSiteCategoryId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkCmsSiteCategoryId';
      filter.value = this.requestLinkCmsSiteCategoryId;
      this.filteModelContent.filters.push(filter);
    }
  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreSiteCategoryCmsModuleModel> = new ErrorExceptionResult<CoreSiteCategoryCmsModuleModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreSiteCategoryCmsModuleModel> = [];
  tableRowSelected: CoreSiteCategoryCmsModuleModel = new CoreSiteCategoryCmsModuleModel();
  tableSource: MatTableDataSource<CoreSiteCategoryCmsModuleModel> = new MatTableDataSource<CoreSiteCategoryCmsModuleModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  tabledisplayedColumns: string[] = [
    'LinkCmsModuleId',
    'LinkCmsSiteCategoryId',
    'RecordStatus',
    'virtual_CmsSiteCategory.title',
    'virtual_CmsModule.title',
    'Action'
  ];



  expandedElement: CoreSiteCategoryCmsModuleModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.sortColumn = 'LinkCmsModuleId';
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
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    this.contentService.ServiceGetAllEditor(filterModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          this.dataModelResult = ret;
          this.tableSource.data = ret.listItems;
          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(ret.access);
          }
        } else {
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


  onActionbuttonNewRow(): void {

    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    const dialogRef = this.dialog.open(CoreSiteCategoryCmsModuleAddComponent, {
      height: '90%',
      data: {
        linkCmsModuleId: this.requestLinkCmsModuleId,
        linkCmsSiteCategoryId: this.requestLinkCmsSiteCategoryId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonEditRow(model: CoreSiteCategoryCmsModuleModel = this.tableRowSelected): void {
    if (!model || !model.linkCmsModuleId || model.linkCmsModuleId === 0 ||
      !model.linkCmsSiteCategoryId || model.linkCmsSiteCategoryId === 0) {
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
    const dialogRef = this.dialog.open(CoreSiteCategoryCmsModuleEditComponent, {
      height: '90%',
      data: {
        linkCmsModuleId: this.tableRowSelected.linkCmsModuleId,
        linkCmsSiteCategoryId: this.tableRowSelected.linkCmsSiteCategoryId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonDeleteRow(model: CoreSiteCategoryCmsModuleModel = this.tableRowSelected): void {
    if (!model || !model.linkCmsModuleId || model.linkCmsModuleId === 0 ||
      !model.linkCmsSiteCategoryId || model.linkCmsSiteCategoryId === 0) {
      const emessage = this.translate.instant('MESSAGE.no_row_selected_to_delete');
      this.cmsToastrService.typeErrorSelected(emessage); return;
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
    const title = this.translate.instant('MESSAGE.Please_Confirm');
    const message = this.translate.instant('MESSAGE.Do_you_want_to_delete_this_content') + '?' + '<br> ( '
      + this.tableRowSelected.virtual_CmsModule.title + '<==>' + this.tableRowSelected.virtual_CmsSiteCategory.title + ' ) ';
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          const pName = this.constructor.name + 'main';
          this.loading.Start(pName);

          this.contentService.ServiceDeleteEntity(this.tableRowSelected).subscribe({
            next: (ret) => {
              if (ret.isSuccess) {
                this.cmsToastrService.typeSuccessRemove();
                this.DataGetAll();
              } else {
                this.cmsToastrService.typeErrorRemove();
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
      )
      .catch(() => {
        // console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
      }
      );

  }

  onActionbuttonGoToSiteCategoryCmsModuleList(model: CoreSiteCategoryCmsModuleModel = this.tableRowSelected): void {
    if (!model || !model.linkCmsModuleId || model.linkCmsModuleId === 0 ||
      !model.linkCmsSiteCategoryId || model.linkCmsSiteCategoryId === 0) {
      const message = this.translate.instant('MESSAGE.no_row_selected_to_display');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    this.router.navigate(['/core/siteSiteCategoryCmsModule/', this.tableRowSelected.id]);
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
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
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
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
      }
    }
    );

  }
  onActionbuttonConfigMainAdminRow(model: CoreSiteCategoryCmsModuleModel = this.tableRowSelected): void {
    if (!model || !model.linkCmsModuleId || model.linkCmsModuleId === 0
      || !model.linkCmsSiteCategoryId || model.linkCmsSiteCategoryId === 0) {
      const emessage = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate([model.virtual_CmsModule.className + '/config/mainadmin/']);
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
        if (ret.isSuccess) {
          exportlist.set('Download', ret.linkFile);
          this.optionsExport.childMethods.setExportLinkFile(exportlist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
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
  onActionTableRowSelect(row: CoreSiteCategoryCmsModuleModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/core/sitecategory/']);
  }
  onActionBackToParentModule(): void {
    this.router.navigate(['/core/module/']);
  }
}
