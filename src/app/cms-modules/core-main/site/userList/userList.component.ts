
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CoreUserModel,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  NtkCmsApiStoreService,
  TokenInfoModel,
  FilterDataModel,
  EnumRecordStatus,
  CoreSiteUserService,
  CoreSiteUserModel,
  DataFieldInfoModel
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
import { CoreSiteUserAddComponent } from '../userAdd/userAdd.component';
import { CoreSiteUserEditComponent } from '../userEdit/userEdit.component';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-core-site-user-list',
  templateUrl: './userList.component.html',
})
export class CoreSiteUserListComponent implements OnInit, OnDestroy {
  requestLinkSiteId = 0;
  requestLinkUserId = 0;
  requestLinkUserGroupId = 0;
  constructor(
    public contentService: CoreSiteUserService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    public dialog: MatDialog) {
    this.loading.cdr = this.cdr;
    this.requestLinkSiteId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkSiteId'));
    this.requestLinkUserId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserId'));
    this.requestLinkUserGroupId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserGroupId'));

    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    this.optionsExport.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionExport(model),
    };
    /*filter Sort*/
    this.filteModelContent.SortColumn = 'Id';
    this.filteModelContent.SortType = EnumSortType.Descending;

    if (this.requestLinkSiteId > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkSiteId';
      filter.Value = this.requestLinkSiteId;
      this.filteModelContent.Filters.push(filter);
    }
    if (this.requestLinkUserId > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkUserId';
      filter.Value = this.requestLinkUserId;
      this.filteModelContent.Filters.push(filter);
    }
    if (this.requestLinkUserGroupId > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkUserGroupId';
      filter.Value = this.requestLinkUserGroupId;
      this.filteModelContent.Filters.push(filter);
    }
  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreSiteUserModel> = new ErrorExceptionResult<CoreSiteUserModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreSiteUserModel> = [];
  tableRowSelected: CoreSiteUserModel = new CoreSiteUserModel();
  tableSource: MatTableDataSource<CoreSiteUserModel> = new MatTableDataSource<CoreSiteUserModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  tabledisplayedColumns: string[] = [
    'LinkSiteId',
    'LinkUserId',
    'LinkUserGroupId',
    'RecordStatus',
    'virtual_CmsUser.Username',
    'virtual_CmsUser.Mobile',
    'virtual_CmsUser.Email',
    'virtual_CmsUser.Name',
    'virtual_CmsUser.LastName',
    'virtual_CmsUser.CompanyName',
    'virtual_CmsUserGroup.Title',
    'virtual_CmsSite.Title',
    'virtual_CmsSite.Domain',
    'virtual_CmsSite.SubDomain',
    'Action'
  ];



  expandedElement: CoreUserModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.SortColumn = 'Title';
    this.DataGetAll();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.DataGetAll();
      this.tokenInfo = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreSiteUserModel();

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


  onActionbuttonNewRow(): void {

    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    const dialogRef = this.dialog.open(CoreSiteUserAddComponent, {
      height: '90%',
      data: {
        LinkSiteId: this.requestLinkSiteId,
        LinkUserId: this.requestLinkUserId,
        LinkUserGroupId: this.requestLinkUserGroupId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonEditRow(model: CoreSiteUserModel = this.tableRowSelected): void {

    if (!model || !model.LinkUserId || model.LinkUserId === 0 || !model.LinkSiteId || model.LinkSiteId === 0) {
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
    const dialogRef = this.dialog.open(CoreSiteUserEditComponent, {
      height: '90%',
      data: {
        LinkSiteId: model.LinkSiteId,
        LinkUserId: model.LinkUserId,
        LinkUserGroupId: model.LinkUserGroupId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonDeleteRow(model: CoreSiteUserModel = this.tableRowSelected): void {
    if (!model || !model.LinkUserId || model.LinkUserId === 0 || !model.LinkSiteId || model.LinkSiteId === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
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
    const message = 'آیا مایل به حدف این محتوا می باشید ' + '?' + '<br> ( '
      + this.tableRowSelected.virtual_CmsSite.Title + '<-->' + this.tableRowSelected.virtual_CmsUser.Username + ' ) ';
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

  onActionbuttonEditSiteRow(model: CoreSiteUserModel = this.tableRowSelected): void {

    if (!model || !model.LinkUserId || model.LinkUserId === 0 || !model.LinkSiteId || model.LinkSiteId === 0) {
      this.cmsToastrService.typeErrorSelected('ردیفی برای ویرایش انتخاب نشده است');
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate(['/core/site/edit', model.LinkSiteId]);

  }
  onActionbuttonEditUserRow(model: CoreSiteUserModel = this.tableRowSelected): void {

    if (!model || !model.LinkUserId || model.LinkUserId === 0 || !model.LinkSiteId || model.LinkSiteId === 0) {
      this.cmsToastrService.typeErrorSelected('ردیفی برای ویرایش انتخاب نشده است');
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate(['/core/user/edit', model.LinkUserId]);

  }
  onActionbuttonResllerUser(model: CoreSiteUserModel = this.tableRowSelected): void {

    if (!model || !model.LinkUserId || model.LinkUserId === 0 || !model.LinkSiteId || model.LinkSiteId === 0) {
      this.cmsToastrService.typeErrorSelected('ردیفی برای ویرایش انتخاب نشده است');
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate(['/core/user/reseller-chart/LinkUserId', model.LinkUserId]);

  }
  onActionbuttonResllerSite(model: CoreSiteUserModel = this.tableRowSelected): void {

    if (!model || !model.LinkUserId || model.LinkUserId === 0 || !model.LinkSiteId || model.LinkSiteId === 0) {
      this.cmsToastrService.typeErrorSelected('ردیفی برای ویرایش انتخاب نشده است');
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate(['/core/site/reseller-chart/LinkSiteId', model.LinkSiteId]);

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
  onActionTableRowSelect(row: CoreSiteUserModel): void {
    this.tableRowSelected = row;
  }
  onActionbuttonSiteList(model: CoreSiteUserModel = this.tableRowSelected): void {
    if (!model || !model.LinkUserId || model.LinkUserId === 0 || !model.LinkSiteId || model.LinkSiteId === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate(['/core/site/list/LinkUserId/', model.Id]);
  }
  onActionBackToParentSiteList(): void {
    this.router.navigate(['/core/site/']);
  }
  onActionBackToParentUserList(): void {
    this.router.navigate(['/core/user/']);
  }
  onActionBackToParentUserGroupList(): void {
    this.router.navigate(['/core/usergroup/']);
  }
}
