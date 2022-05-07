
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CoreSiteModel,
  CoreSiteService,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  NtkCmsApiStoreService,
  TokenInfoModel,
  FilterDataModel,
  EnumRecordStatus,
  CoreModuleSiteService,
  CoreModuleSiteModel,
  DataFieldInfoModel,
  EnumFilterDataModelSearchTypes,
  CoreModuleService,
  CoreModuleModel
} from 'ntk-cms-api';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ComponentOptionExportModel } from 'src/app/core/cmsComponentModels/base/componentOptionExportModel';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistModel';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CoreSiteModuleEditComponent } from '../moduleEdit/moduleEdit.component';
import { CoreSiteModuleAddComponent } from '../moduleAdd/moduleAdd.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { TranslateService } from '@ngx-translate/core';
import { CmsSiteUserCreditViewComponent } from 'src/app/shared/cms-site-user-credit-view/cms-site-user-credit-view.component';
import { CmsSiteCreditViewComponent } from 'src/app/shared/cms-site-credit-view/cms-site-credit-view.component';
@Component({
  selector: 'app-core-site-module-list',
  templateUrl: './moduleList.component.html',
})
export class CoreSiteModuleListComponent implements OnInit, OnDestroy {
  requestLinkSiteId = 0;
  requestLinkModuleId = 0;
  constructor(
    public contentService: CoreModuleSiteService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private activatedRoute: ActivatedRoute,
    private coreModuleService: CoreModuleService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    public dialog: MatDialog,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private router: Router,
  ) {
    this.loading.cdr = this.cdr;
    this.requestLinkSiteId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkSiteId'));
    this.requestLinkModuleId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkModuleId'));
    if (this.requestLinkSiteId > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkSiteId';
      filter.Value = this.requestLinkSiteId;
      this.filteModelContent.Filters.push(filter);
    }
    if (this.requestLinkModuleId > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkModuleId';
      filter.Value = this.requestLinkModuleId;
      this.filteModelContent.Filters.push(filter);
    }
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
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreModuleSiteModel> = new ErrorExceptionResult<CoreModuleSiteModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  @Input() loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreModuleSiteModel> = [];
  tableRowSelected: CoreModuleSiteModel = new CoreModuleSiteModel();
  tableSource: MatTableDataSource<CoreModuleSiteModel> = new MatTableDataSource<CoreModuleSiteModel>();

  dataModelCoreModuleResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();

  tabledisplayedColumns: string[] = [
    'LinkSiteId',
    'LinkModuleId',
    'RecordStatus',
    'virtual_CmsSite.Title',
    'virtual_CmsModule.Title',
    'CreatedDate',
    'UpdatedDate',
    'RenewDate',
    'HasBuyed',
    'ExpireDate',
    'Action'
  ];
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();



  expandedElement: CoreModuleSiteModel | null;
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

    this.getModuleList();
  }
  getModuleList(): void {
    const filter = new FilterModel();
    filter.RowPerPage = 100;
    this.coreModuleService.ServiceGetAllModuleName(filter).subscribe((next) => {
      this.dataModelCoreModuleResult = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreModuleSiteModel();

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.filteModelContent.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    this.contentService.ServiceGetAll(filterModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
          this.dataModelResult = next;
          this.tableSource.data = next.ListItems;
          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(next.Access);
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

  onActionbuttonReNewModule(): void {
    this.router.navigate(['core/modulesale/serial/checklist/']);
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
    var LinkSiteId = this.requestLinkSiteId;
    var LinkModuleId = this.requestLinkModuleId;
    if (LinkSiteId <= 0) {
      LinkSiteId = this.tokenInfo.SiteId;
    }
    const dialogRef = this.dialog.open(CoreSiteModuleAddComponent, {
      height: '90%',
      data: {
        LinkSiteId: LinkSiteId,
        LinkModuleId: LinkModuleId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonEditRow(model: CoreModuleSiteModel = this.tableRowSelected): void {

    if (!model || !model.LinkModuleId || model.LinkModuleId === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    if (!model || !model.LinkSiteId || model.LinkSiteId === 0) {
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
    const dialogRef = this.dialog.open(CoreSiteModuleEditComponent, {
      height: '90%',
      data: {
        LinkSiteId: model.LinkSiteId,
        LinkModuleId: model.LinkModuleId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonDeleteRow(model: CoreModuleSiteModel = this.tableRowSelected): void {
    if (!model || !model.LinkModuleId || model.LinkModuleId === 0 || !model.LinkSiteId || model.LinkSiteId === 0) {
      const emessage = this.translate.instant('MESSAGE.no_row_selected_to_delete');
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


    const title = this.translate.instant('MESSAGE.Please_Confirm');
    const message = 'آیا مایل به حدف این محتوا می باشید ' + '?' + '<br> ( ' + this.tableRowSelected.Title + ' ) ';
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          const pName = this.constructor.name + 'main';
          this.loading.Start(pName);

          this.contentService.ServiceDeleteEntity(this.tableRowSelected).subscribe(
            (next) => {
              if (next.IsSuccess) {
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



  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set('Active', 0);
    statist.set('Expired Date', 0);
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
    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastFilter2 = new FilterDataModel();
    fastFilter2.PropertyName = 'ExpireDate';
    fastFilter2.Value = new Date();
    fastFilter2.SearchType = EnumFilterDataModelSearchTypes.GreaterThan;
    filterStatist2.Filters.push(fastFilter2);
    this.contentService.ServiceGetCount(filterStatist2).subscribe(
      (next) => {
        if (next.IsSuccess) {
          statist.set('Expired Date', next.TotalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
      }
      ,
      (error) => {
      }
    );
  }
  onActionbuttonConfigSiteRow(model: CoreModuleSiteModel = this.tableRowSelected): void {
    if (!model || !model.LinkModuleId || model.LinkModuleId === 0 || !model.LinkSiteId || model.LinkSiteId === 0) {
      const emessage = 'ردیفی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate([model.virtual_CmsModule.ClassName.toLowerCase() + '/config/site/', model.LinkSiteId]);
  }
  onActionbuttonConfigMainAdminRow(model: CoreModuleSiteModel = this.tableRowSelected): void {
    if (!model || !model.LinkModuleId || model.LinkModuleId === 0 || !model.LinkSiteId || model.LinkSiteId === 0) {
      const emessage = 'ردیفی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate([model.virtual_CmsModule.ClassName.toLowerCase() + '/config/mainadmin/']);
  }
  onActionbuttonSiteCreditAccountRow(model: CoreModuleSiteModel = this.tableRowSelected): void {
    if (!model || !model.LinkModuleId || model.LinkModuleId === 0 || !model.LinkSiteId || model.LinkSiteId === 0) {
      const emessage = 'ردیفی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;

    const dialogRef = this.dialog.open(CmsSiteCreditViewComponent, {
      // height: '90%',
      data: {
        LinkModuleId: model.LinkModuleId,
      }
    });
  }
  onActionbuttonSiteUserCreditAccountRow(model: CoreModuleSiteModel = this.tableRowSelected): void {
    if (!model || !model.LinkModuleId || model.LinkModuleId === 0 || !model.LinkSiteId || model.LinkSiteId === 0) {
      const emessage = 'ردیفی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;

    const dialogRef = this.dialog.open(CmsSiteUserCreditViewComponent, {
      // height: '90%',
      data: {
        LinkModuleId: model.LinkModuleId,
      }
    });
  }
  onActionbuttonExport(): void {
    this.optionsExport.data.show = !this.optionsExport.data.show;
    this.optionsExport.childMethods.setExportFilterModel(this.filteModelContent);
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
  onActionTableRowSelect(row: CoreModuleSiteModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/core/site/']);
  }
  onActionBackToParentModuleList(): void {
    this.router.navigate(['/core/module/']);
  }

}


