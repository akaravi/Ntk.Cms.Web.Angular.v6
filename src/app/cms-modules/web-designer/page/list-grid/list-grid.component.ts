
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreSiteCategoryModel,
  CoreSiteCategoryService, DataFieldInfoModel, EnumRecordStatus, EnumSortType,
  ErrorExceptionResult, FilterDataModel, FilterModel,
  TokenInfoModel, WebDesignerMainPageModel,
  WebDesignerMainPageService, WebDesignerMainPageTemplateModel,
  WebDesignerMainPageTemplateService
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchModel';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CmsExportEntityComponent } from 'src/app/shared/cms-export-entity/cms-export-entity.component';
import { CmsExportListComponent } from 'src/app/shared/cms-export-list/cmsExportList.component';
import { environment } from 'src/environments/environment';
import { WebDesignerMainPageAddComponent } from '../add/add.component';
import { WebDesignerMainPageEditComponent } from '../edit/edit.component';
@Component({
  selector: 'app-webdesigner-page-list-grid',
  templateUrl: './list-grid.component.html',
})
export class WebDesignerMainPageListGridComponent implements OnInit, OnDestroy {
  requestLinkPageParentGuId = '';
  requestLinkPageTemplateGuId = '';
  requestLinkPageDependencyGuId = '';
  constructor(
    public contentService: WebDesignerMainPageService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private webDesignerMainPageTemplateService: WebDesignerMainPageTemplateService,
    private coreSiteCategoryService: CoreSiteCategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public dialog: MatDialog) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
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

    /*filter Sort*/
    this.filteModelContent.sortColumn = 'CreatedDate';
    this.filteModelContent.sortType = EnumSortType.Descending;
    if (this.requestLinkPageTemplateGuId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkPageTemplateGuId';
      filter.value = this.requestLinkPageTemplateGuId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkPageDependencyGuId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkPageDependencyGuId';
      filter.value = this.requestLinkPageDependencyGuId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkPageParentGuId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkPageParentGuId';
      filter.value = this.requestLinkPageParentGuId;
      this.filteModelContent.filters.push(filter);
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

  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<WebDesignerMainPageModel> = [];
  tableRowSelected: WebDesignerMainPageModel = new WebDesignerMainPageModel();
  tableSource: MatTableDataSource<WebDesignerMainPageModel> = new MatTableDataSource<WebDesignerMainPageModel>();
  dataModelWebDesignerMainPageTemplateResult: ErrorExceptionResult<WebDesignerMainPageTemplateModel> = new ErrorExceptionResult<WebDesignerMainPageTemplateModel>();
  dataModelCoreSiteCategoryResult: ErrorExceptionResult<CoreSiteCategoryModel> = new ErrorExceptionResult<CoreSiteCategoryModel>();
  tabledisplayedColumns: string[] = [
    'ThumbnailImageSrc',
    'Id',
    'RecordStatus',
    'Title',
    // 'LinkPageParentGuId',
    // 'LinkPageDependencyGuId',
    'LinkPageTemplateGuId',
    'PageDependencyIsDefaultPage',
    'PageDependencyIsDefaultPageLinkSiteCategoryId',
    'Action'
  ];
  expandedElement: WebDesignerMainPageModel | null;
  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.filteModelContent.sortColumn = 'Title';
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.DataGetAll();
    });
    this.getModuleList();
    this.getSiteCategory();
  }
  getModuleList(): void {
    const filter = new FilterModel();
    filter.rowPerPage = 100;
    this.webDesignerMainPageTemplateService.ServiceGetAll(filter).subscribe((next) => {
      this.dataModelWebDesignerMainPageTemplateResult = next;
    });
  }
  getSiteCategory(): void {
    const filter = new FilterModel();
    filter.rowPerPage = 100;
    this.coreSiteCategoryService.ServiceGetAll(filter).subscribe((next) => {
      this.dataModelCoreSiteCategoryResult = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new WebDesignerMainPageModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    this.contentService.ServiceGetAllEditor(filterModel).subscribe(
      (next) => {
        if (next.isSuccess) {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.access);
          this.dataModelResult = next;
          this.tableSource.data = next.listItems;
          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(next.access);
          }
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
        this.filteModelContent.sortColumn = sort.active;
        this.filteModelContent.sortType = EnumSortType.Descending;
      } else if (this.tableSource.sort.start === 'desc') {
        sort.start = 'asc';
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
    const dialogRef = this.dialog.open(WebDesignerMainPageAddComponent, {
      height: '90%',
      data: { linkPageDependencyGuId: this.requestLinkPageDependencyGuId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonEditRow(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
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
    const dialogRef = this.dialog.open(WebDesignerMainPageEditComponent, {
      height: '90%',
      data: { id: this.tableRowSelected.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonDeleteRow(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
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
    const title = this.translate.instant('MESSAGE.Please_Confirm');
    const message = this.translate.instant('MESSAGE.Do_you_want_to_delete_this_content') + '?' + '<br> ( ' + this.tableRowSelected.title + ' ) ';
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          const pName = this.constructor.name + 'main';
          this.loading.Start(pName);
          this.contentService.ServiceDelete(this.tableRowSelected.id).subscribe(
            (next) => {
              if (next.isSuccess) {
                this.cmsToastrService.typeSuccessRemove();
                this.DataGetAll();
              } else {
                this.cmsToastrService.typeErrorRemove();
              }
              this.loading.Stop(pName);
            },
            (error) => {
              this.cmsToastrService.typeError(error);
              this.loading.Stop(pName);
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
    if (!model || !model.id || model.id.length === 0) {
      const message = this.translate.instant('MESSAGE.no_row_selected_to_display');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate(['/core/siteSiteCategory/', this.tableRowSelected.id]);
  }
  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set(this.translate.instant('MESSAGE.Active'), 0);
    statist.set(this.translate.instant('MESSAGE.All'), 0);
    const pName = this.constructor.name + '.ServiceStatist';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Get_the_statist'));
    this.contentService.ServiceGetCount(this.filteModelContent).subscribe(
      (next) => {
        if (next.isSuccess) {
          statist.set('All', next.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'RecordStatus';
    fastfilter.value = EnumRecordStatus.Available;
    filterStatist1.filters.push(fastfilter);
    this.contentService.ServiceGetCount(filterStatist1).subscribe(
      (next) => {
        if (next.isSuccess) {
          statist.set('Active', next.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
        this.loading.Stop(pName);
      }
      ,
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );

  }
  onActionbuttonHtmlEditor(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    const urlTemplate = environment.cmsServerConfig.configHtmlBuilderServerPath + 'htmlbuilder/?id=' + model.id
      + '&token=' + encodeURIComponent(this.tokenInfo.token);
    // this.document.location.href = urlTemplate;
    window.open(urlTemplate, '_blank');
  }
  onActionbuttonHtmlView(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    const urlTemplate = environment.cmsServerConfig.configMvcServerPath + 'page/' + model.id + '?RenderViewPageByMaster=true&preview=true';
    // this.document.location.href = urlTemplate;
    window.open(urlTemplate, '_blank');
  }
  onActionbuttonSiteRouteView(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    this.contentService.ServiceWebRoute(model.id).subscribe(
      (next) => {
        if (next.isSuccess) {
          window.open(next.item, '_blank');
        }
        else {
          this.cmsToastrService.typeError(next.errorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
      }
    );

  }
  onActionbuttonHtmlViewWithOutParent(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    const urlTemplate = environment.cmsServerConfig.configMvcServerPath + 'page/' + model.id + '?RenderViewPageByMaster=false&preview=true';
    // this.document.location.href = urlTemplate;
    window.open(urlTemplate, '_blank');
  }
  onActionbuttonExport(): void {
    //open popup
    const dialogRef = this.dialog.open(CmsExportListComponent, {
      height: "50%",
      width: "50%",
      data: {
        service: this.contentService,
        filterModel: this.filteModelContent,
        title: ''
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
    });
    //open popup 

  }
  onActionButtonPrintEntity(model: any = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessEditRow
    ) {
      this.cmsToastrService.typeErrorAccessWatch();
      return;
    }
    //open popup
    const dialogRef = this.dialog.open(CmsExportEntityComponent, {
      height: "50%",
      width: "50%",
      data: {
        service: this.contentService,
        id: this.tableRowSelected.id,
        title: this.tableRowSelected.title
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
    });
    //open popup
  }

  onActionbuttonReload(): void {
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.filters = model;
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