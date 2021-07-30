
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
  CoreTokenUserLogService,
  CoreTokenUserLogModel,
  DataFieldInfoModel,
  EnumModel,
  CoreEnumService
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
import { CoreTokenUserLogEditComponent } from '../edit/edit.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CoreTokenUserLogViewComponent } from '../view/view.component';

@Component({
  selector: 'app-coretoken-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CoreTokenUserLogListComponent implements OnInit, OnDestroy {
  requestLinkSiteId = 0;
  requestLinkUserId = 0;
  requestLinkDeviceId = 0;
  constructor(
    private coreEnumService: CoreEnumService,
    private coreTokenUserLogService: CoreTokenUserLogService,
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
  ) {
    this.requestLinkSiteId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkSiteId'));
    this.requestLinkUserId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserId'));
    this.requestLinkDeviceId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkDeviceId'));

    if (this.requestLinkSiteId > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkCmsSiteId';
      filter.Value = this.requestLinkSiteId;
      this.filteModelContent.Filters.push(filter);
    }
    if (this.requestLinkUserId > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkUserId';
      filter.Value = this.requestLinkUserId;
      this.filteModelContent.Filters.push(filter);
    }
    if (this.requestLinkDeviceId > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkDeviceId';
      filter.Value = this.requestLinkDeviceId;
      this.filteModelContent.Filters.push(filter);
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
  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreTokenUserLogModel> = new ErrorExceptionResult<CoreTokenUserLogModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreTokenUserLogModel> = [];
  tableRowSelected: CoreTokenUserLogModel = new CoreTokenUserLogModel();
  tableSource: MatTableDataSource<CoreTokenUserLogModel> = new MatTableDataSource<CoreTokenUserLogModel>();


  tabledisplayedColumns: string[] = [
    'Id',
    'LinkSiteId',
    'LinkUserId',
    'LinkMemberUserId',
    'UserAccessAreaType',
    'UserType',
    'UserAccessAdminAllowToAllData',
    'UserAccessAdminAllowToProfessionalData',
    'RememberOnDevice',
    'CreatedDate',
    'ExpireDate',
    'Action'
  ];
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModelEnumManageUserAccessAreaTypesResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelEnumManageUserAccessControllerTypesResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();


  expandedElement: CoreSiteModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.SortColumn = 'Id';
    this.filteModelContent.SortType = EnumSortType.Descending;
    this.DataGetAll();
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.DataGetAll();
      this.tokenInfo = next;
    });
    this.getEnumManageUserAccessAreaTypes();
    this.getEnumManageUserAccessControllerTypes();
  }

  getEnumManageUserAccessAreaTypes(): void {
    // this.coreEnumService.ServiceEnumManageUserAccessAreaTypes().subscribe((next) => {
    //   this.dataModelEnumManageUserAccessAreaTypesResult = next;
    // });
  }
  // {{row.UserAccessAreaType | enums : dataModelEnumManageUserAccessAreaTypesResult.ListItems}}
  getEnumManageUserAccessControllerTypes(): void {
    // this.coreEnumService.ServiceEnumManageUserAccessControllerTypes().subscribe((next) => {
    //   this.dataModelEnumManageUserAccessControllerTypesResult = next;
    // });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreTokenUserLogModel();

    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    this.coreTokenUserLogService.ServiceGetAll(filterModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

          this.dataModelResult = next;
          this.tableSource.data = next.ListItems;
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


  onActionbuttonViewRow(model: CoreTokenUserLogModel = this.tableRowSelected): void {

    if (!model || !model.Id || model.Id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessWatchRow
    ) {
      this.cmsToastrService.typeErrorAccessWatch();
      return;
    }
    const dialogRef = this.dialog.open(CoreTokenUserLogViewComponent, {
      data: { id: this.tableRowSelected.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        // this.DataGetAll();
      }
    });
  }

  onActionbuttonEditRow(model: CoreTokenUserLogModel = this.tableRowSelected): void {

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
    const dialogRef = this.dialog.open(CoreTokenUserLogEditComponent, {
      data: { id: this.tableRowSelected.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonDeleteRow(model: CoreTokenUserLogModel = this.tableRowSelected): void {
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
    const message = 'آیا مایل به حدف این محتوا می باشید ' + '?' +
      '<br> ( ' + this.tableRowSelected.Id + ' ) ';
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          this.loading.display = true;
          this.coreTokenUserLogService.ServiceDelete(this.tableRowSelected.Id).subscribe(
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




  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set('Active', 0);
    statist.set('All', 0);
    this.coreTokenUserLogService.ServiceGetCount(this.filteModelContent).subscribe(
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
    this.coreTokenUserLogService.ServiceGetCount(filterStatist1).subscribe(
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

  onActionbuttonViewUserRow(model: CoreTokenUserLogModel = this.tableRowSelected): void {

    if (!model || !model.Id || model.Id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;
    if (!this.tableRowSelected.LinkUserId || this.tableRowSelected.LinkUserId === 0) {
      this.cmsToastrService.typeErrorSelected('محتوا شامل اطلاعات کاربر نمی باشد');
      return;
    }
    this.router.navigate(['/core/user/edit', this.tableRowSelected.LinkUserId]);
  }

  onActionbuttonViewMemberRow(model: CoreTokenUserLogModel = this.tableRowSelected): void {

    if (!model || !model.Id || model.Id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;
    if (!this.tableRowSelected.LinkDeviceId || this.tableRowSelected.LinkDeviceId === 0) {
      this.cmsToastrService.typeErrorSelected('محتوا شامل اطلاعات دستگاه نمی باشد');
      return;
    }
    this.router.navigate(['/member/user/edit', this.tableRowSelected.LinkMemberUserId]);
  }

  onActionbuttonViewSiteRow(model: CoreTokenUserLogModel = this.tableRowSelected): void {

    if (!model || !model.Id || model.Id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;
    if (!this.tableRowSelected.LinkSiteId || this.tableRowSelected.LinkSiteId === 0) {
      this.cmsToastrService.typeErrorSelected('محتوا شامل اطلاعات سایت نمی باشد');
      return;
    }
    this.router.navigate(['/core/site/edit', this.tableRowSelected.LinkSiteId]);
  }
  onActionbuttonViewDeviceRow(model: CoreTokenUserLogModel = this.tableRowSelected): void {

    if (!model || !model.Id || model.Id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;
    if (!this.tableRowSelected.LinkDeviceId || this.tableRowSelected.LinkDeviceId === 0) {
      this.cmsToastrService.typeErrorSelected('محتوا شامل اطلاعات دستگاه نمی باشد');
      return;
    }
    this.router.navigate(['/core/site/edit', this.tableRowSelected.LinkDeviceId]);
  }
  onActionbuttonExport(): void {
    this.optionsExport.data.show = !this.optionsExport.data.show;
    this.optionsExport.childMethods.setExportFilterModel(this.filteModelContent);
  }
  onSubmitOptionExport(model: FilterModel): void {
    const exportlist = new Map<string, string>();
    exportlist.set('Download', 'loading ... ');
    this.coreTokenUserLogService.ServiceExportFile(model).subscribe(
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
  onActionTableRowSelect(row: CoreTokenUserLogModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/core/site/']);
  }
}
