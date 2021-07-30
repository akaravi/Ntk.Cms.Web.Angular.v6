
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  WebDesignerMainPageModel,
  WebDesignerMainPageService,
  CoreAuthService,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  NtkCmsApiStoreService,
  TokenInfoModel,
  FilterDataModel,
  EnumRecordStatus,
  DataFieldInfoModel,
  CoreModuleModel,
  CoreModuleService,
  WebDesignerMainPageTemplateModel,
  WebDesignerMainPageTemplateService
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
import { WebDesignerMainPageEditComponent } from '../edit/edit.component';
import { WebDesignerMainPageAddComponent } from '../add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-webdesigner-page-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class WebDesignerMainPageListComponent implements OnInit, OnDestroy {
  requestLinkPageParentGuId = '';
  requestLinkPageTemplateGuId = '';
  requestLinkPageDependencyGuId = '';
  constructor(
    @Inject(DOCUMENT) private document: any,
    private bankPaymentPublicConfigService: WebDesignerMainPageService,
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private webDesignerMainPageTemplateService: WebDesignerMainPageTemplateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) {
    if (this.activatedRoute.snapshot.paramMap.get('LinkPageTemplateGuId')) {
      this.requestLinkPageTemplateGuId = this.activatedRoute.snapshot.paramMap.get('LinkPageTemplateGuId');
    }
    if (this.activatedRoute.snapshot.paramMap.get('LinkPageDependencyGuId')) {
      this.requestLinkPageDependencyGuId = this.activatedRoute.snapshot.paramMap.get('LinkPageDependencyGuId');
    }
    if (this.activatedRoute.snapshot.paramMap.get('LinkPageParentGuId')) {
      this.requestLinkPageParentGuId = this.activatedRoute.snapshot.paramMap.get('LinkPageParentGuId');
    }

    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    this.optionsExport.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionExport(model),
    };
    /*filter Sort*/
    this.filteModelContent.SortColumn = 'CreatedDate';
    this.filteModelContent.SortType = EnumSortType.Descending;
    if (this.requestLinkPageTemplateGuId.length > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkPageTemplateGuId';
      filter.Value = this.requestLinkPageTemplateGuId;
      this.filteModelContent.Filters.push(filter);
    }
    if (this.requestLinkPageDependencyGuId.length > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkPageDependencyGuId';
      filter.Value = this.requestLinkPageDependencyGuId;
      this.filteModelContent.Filters.push(filter);
    }
    if (this.requestLinkPageParentGuId.length > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkPageParentGuId';
      filter.Value = this.requestLinkPageParentGuId;
      this.filteModelContent.Filters.push(filter);
    }
  }
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<WebDesignerMainPageModel> = new ErrorExceptionResult<WebDesignerMainPageModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<WebDesignerMainPageModel> = [];
  tableRowSelected: WebDesignerMainPageModel = new WebDesignerMainPageModel();
  tableSource: MatTableDataSource<WebDesignerMainPageModel> = new MatTableDataSource<WebDesignerMainPageModel>();
  dataModelWebDesignerMainPageTemplateResult: ErrorExceptionResult<WebDesignerMainPageTemplateModel>
    = new ErrorExceptionResult<WebDesignerMainPageTemplateModel>();


  tabledisplayedColumns: string[] = [
    'Id',
    'RecordStatus',
    'Title',
    'LinkPageParentGuId',
    'LinkPageDependencyGuId',
    'LinkPageTemplateGuId',
    'PageDependencyIsDefualtPage',
    'ContentPageFindInDefaultSiteCategory',
    'Action'
  ];



  expandedElement: WebDesignerMainPageModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.SortColumn = 'Title';
    this.DataGetAll();
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.DataGetAll();
      this.tokenInfo = next;
    });
    this.getModuleList();
  }
  getModuleList(): void {
    const filter = new FilterModel();
    filter.RowPerPage = 100;
    this.webDesignerMainPageTemplateService.ServiceGetAll(filter).subscribe((next) => {
      this.dataModelWebDesignerMainPageTemplateResult = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new WebDesignerMainPageModel();

    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    this.bankPaymentPublicConfigService.ServiceGetAll(filterModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

          this.dataModelResult = next;
          this.tableSource.data = next.ListItems;

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


  onActionbuttonNewRow(): void {

    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    const dialogRef = this.dialog.open(WebDesignerMainPageAddComponent, {
      data: { LinkPageDependencyGuId: this.requestLinkPageDependencyGuId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonEditRow(model: WebDesignerMainPageModel = this.tableRowSelected): void {

    if (!model || !model.Id || model.Id.length === 0) {
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
    const dialogRef = this.dialog.open(WebDesignerMainPageEditComponent, {
      data: { id: this.tableRowSelected.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonDeleteRow(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id.length === 0) {
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


    const title = 'لطفا تایید کنید...';
    const message = 'آیا مایل به حدف این محتوا می باشید ' + '?' + '<br> ( ' + this.tableRowSelected.Title + ' ) ';
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          this.loading.display = true;
          this.bankPaymentPublicConfigService.ServiceDelete(this.tableRowSelected.Id).subscribe(
            (next) => {
              if (next.IsSuccess) {
                this.cmsToastrService.typeSuccessRemove();
                this.DataGetAll();
              } else {
                this.cmsToastrService.typeErrorRemove();
              }
              this.loading.display = false;
            },
            (error) => {
              this.cmsToastrService.typeError(error);
              this.loading.display = false;
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


  onActionbuttonGoToSiteCategoryList(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id.length === 0) {
      const message = 'ردیفی برای نمایش انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    this.router.navigate(['/core/siteSiteCategory/', this.tableRowSelected.Id]);
  }
  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set('Active', 0);
    statist.set('All', 0);
    this.bankPaymentPublicConfigService.ServiceGetCount(this.filteModelContent).subscribe(
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
    this.bankPaymentPublicConfigService.ServiceGetCount(filterStatist1).subscribe(
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
  onActionbuttonHtmlEditor(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id.length === 0) {
      const message = 'ردیفی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    const urlTemplate = environment.cmsServerConfig.configHtmlBuilderServerPath + 'htmlbuilder/?id=' + model.Id
      + '&token=' + encodeURIComponent(this.tokenInfo.Token);
    // this.document.location.href = urlTemplate;
    window.open(urlTemplate, '_blank');
  }
  onActionbuttonHtmlView(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id.length === 0) {
      const message = 'ردیفی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }

    const urlTemplate = environment.cmsServerConfig.configHtmlViewServerPath + 'page/' + model.Id + '?RenderViewPageByMaster=true&preview=true';
    // this.document.location.href = urlTemplate;
    window.open(urlTemplate, '_blank');
  }
  onActionbuttonHtmlViewWithOutParent(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id.length === 0) {
      const message = 'ردیفی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    const urlTemplate = environment.cmsServerConfig.configHtmlViewServerPath + 'page/' + model.Id + '?RenderViewPageByMaster=false&preview=true';
    // this.document.location.href = urlTemplate;
    window.open(urlTemplate, '_blank');
  }

  onActionbuttonExport(): void {
    this.optionsExport.data.show = !this.optionsExport.data.show;
    this.optionsExport.childMethods.setExportFilterModel(this.filteModelContent);
  }
  onSubmitOptionExport(model: FilterModel): void {
    const exportlist = new Map<string, string>();
    exportlist.set('Download', 'loading ... ');
    this.bankPaymentPublicConfigService.ServiceExportFile(model).subscribe(
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
  onActionTableRowSelect(row: WebDesignerMainPageModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParentTemplate(): void {
    this.router.navigate(['/webdesigner/pagetemplate']);
  }
  onActionBackToParentDependency(): void {
    this.router.navigate(['/webdesigner/pagedependency']);
  }
}
