
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthRenewTokenModel,
  CoreAuthService, CoreSiteUserModel, CoreSiteUserService, CoreUserModel, DataFieldInfoModel, EnumRecordStatus, EnumSortType,
  ErrorExceptionResult, FilterDataModel, FilterModel,
  TokenInfoModel
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
import { CoreUserChangePasswordComponent } from '../../user/changePassword/changePassword.component';
import { CoreSiteUserAddComponent } from '../userAdd/userAdd.component';
import { CoreSiteUserEditComponent } from '../userEdit/userEdit.component';
@Component({
  selector: 'app-core-site-user-list',
  templateUrl: './userList.component.html',
  styleUrls: ["./userlist.component.scss"],
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
    private coreAuthService: CoreAuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public dialog: MatDialog) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.requestLinkSiteId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkSiteId'));
    this.requestLinkUserId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserId'));
    this.requestLinkUserGroupId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserGroupId'));

    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };

    /*filter Sort*/
    this.filteModelContent.sortColumn = 'Id';
    this.filteModelContent.sortType = EnumSortType.Descending;

    if (this.requestLinkSiteId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkSiteId';
      filter.value = this.requestLinkSiteId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkUserId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkUserId';
      filter.value = this.requestLinkUserId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkUserGroupId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkUserGroupId';
      filter.value = this.requestLinkUserGroupId;
      this.filteModelContent.filters.push(filter);
    }
  }
  link: string;
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreSiteUserModel> = new ErrorExceptionResult<CoreSiteUserModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();

  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreSiteUserModel> = [];
  tableRowSelected: CoreSiteUserModel = new CoreSiteUserModel();
  tableSource: MatTableDataSource<CoreSiteUserModel> = new MatTableDataSource<CoreSiteUserModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  tabledisplayedColumns: string[] = [];
  tabledisplayedColumnsSource: string[] = [
    'LinkSiteId',
    'LinkUserId',
    'LinkUserGroupId',
    'RecordStatus',
    'CreatedDate',
    'virtual_CmsUser.name',
    'virtual_CmsUser.lastName',
    'virtual_CmsUserGroup.title',
    'virtual_CmsSite.title',
    'virtual_CmsSite.domain',
    'virtual_CmsSite.subDomain',
    'Action'
  ];



  expandedElement: CoreUserModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.sortColumn = 'Title';
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
      this.tokenHelper.CheckIsAdmin();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.DataGetAll();
      this.tokenHelper.CheckIsAdmin();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tabledisplayedColumns = this.publicHelper.TabledisplayedColumnsCheckByAllDataAccess(this.tabledisplayedColumnsSource, [], this.tokenInfo);
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreSiteUserModel();

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    this.contentService.ServiceGetAll(filterModel).subscribe({
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
    const dialogRef = this.dialog.open(CoreSiteUserAddComponent, {
      height: '90%',
      data: {
        linkSiteId: this.requestLinkSiteId,
        linkUserId: this.requestLinkUserId,
        linkUserGroupId: this.requestLinkUserGroupId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonEditRow(model: CoreSiteUserModel = this.tableRowSelected): void {

    if (!model || !model.linkUserId || model.linkUserId === 0 || !model.linkSiteId || model.linkSiteId === 0) {
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
    const dialogRef = this.dialog.open(CoreSiteUserEditComponent, {
      height: '90%',
      data: {
        linkSiteId: model.linkSiteId,
        linkUserId: model.linkUserId,
        linkUserGroupId: model.linkUserGroupId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonDeleteRow(model: CoreSiteUserModel = this.tableRowSelected): void {
    if (!model || !model.linkUserId || model.linkUserId === 0 || !model.linkSiteId || model.linkSiteId === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
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
    const message = this.translate.instant('MESSAGE.Do_you_want_to_delete_this_content') + '?' + '<br> ( '
      + this.tableRowSelected.virtual_CmsSite.title + '<-->' + this.tableRowSelected.virtual_CmsUser.username + ' ) ';
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

  onActionbuttonEditSiteRow(model: CoreSiteUserModel = this.tableRowSelected, event?: MouseEvent): void {

    if (!model || !model.linkUserId || model.linkUserId === 0 || !model.linkSiteId || model.linkSiteId === 0) {
      this.cmsToastrService.typeErrorSelected(this.translate.instant('MESSAGE.No_row_selected_for_editing'));
      return;
    }
    this.tableRowSelected = model;

    if (event?.ctrlKey) {
      this.link = "/#/core/site/edit/" + model.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(['/core/site/edit/', model.linkSiteId]);
    }
  }

  onActionbuttonChangePassword(model: CoreSiteUserModel = this.tableRowSelected): void {
    if (!model || !model.linkUserId || model.linkUserId === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;
    if (this.tokenInfo.userId != model.linkUserId &&
      (
        this.dataModelResult == null ||
        this.dataModelResult.access == null ||
        !this.dataModelResult.access.accessEditRow
      )) {
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }
    const dialogRef = this.dialog.open(CoreUserChangePasswordComponent, {
      //height: '90%',
      data: { linkUserId: this.tableRowSelected.linkUserId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonEditUserRow(model: CoreSiteUserModel = this.tableRowSelected, event?: MouseEvent): void {

    if (!model || !model.linkUserId || model.linkUserId === 0 || !model.linkSiteId || model.linkSiteId === 0) {
      this.cmsToastrService.typeErrorSelected(this.translate.instant('MESSAGE.No_row_selected_for_editing'));
      return;
    }
    this.tableRowSelected = model;

    if (event?.ctrlKey) {
      this.link = "/#/core/user/edit/" + model.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(['/core/user/edit', model.linkUserId]);
    }

  }
  onActionbuttonResllerUser(model: CoreSiteUserModel = this.tableRowSelected, event?: MouseEvent): void {

    if (!model || !model.linkUserId || model.linkUserId === 0 || !model.linkSiteId || model.linkSiteId === 0) {
      this.cmsToastrService.typeErrorSelected(this.translate.instant('MESSAGE.No_row_selected_for_editing'));
      return;
    }
    this.tableRowSelected = model;

    if (event?.ctrlKey) {
      this.link = "/#/core/user/reseller-chart/LinkUserId/" + model.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(['/core/user/reseller-chart/LinkUserId/', model.linkUserId]);
    }

  }
  onActionbuttonResllerSite(model: CoreSiteUserModel = this.tableRowSelected, event?: MouseEvent): void {

    if (!model || !model.linkUserId || model.linkUserId === 0 || !model.linkSiteId || model.linkSiteId === 0) {
      this.cmsToastrService.typeErrorSelected(this.translate.instant('MESSAGE.No_row_selected_for_editing'));
      return;
    }
    this.tableRowSelected = model;

    if (event?.ctrlKey) {
      this.link = "/#/core/site/reseller-chart/LinkSiteId/" + model.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(['/core/site/reseller-chart/LinkSiteId/', model.linkSiteId]);
    }
  }
  onActionbuttonLoginToRow(model: CoreSiteUserModel = this.tableRowSelected): void {
    if (!model || !model.linkUserId || model.linkUserId === 0) {

      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    let authModel: AuthRenewTokenModel;
    authModel = new AuthRenewTokenModel();
    authModel.userId = this.tableRowSelected.linkUserId;
    authModel.siteId = this.tableRowSelected.linkSiteId;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.cmsToastrService.typeSuccessSelected();
          this.router.navigate(['/']);
        }
        else {
          this.cmsToastrService.typeErrorSelected();
        }
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
      }
    }
    );
  }
  onActionbuttonUserSupportList(row: CoreSiteUserModel, event?: MouseEvent): void {
    if (event?.ctrlKey) {
      this.link = "/#/core/user-support-access/list/LinkSiteId/" + row.linkSiteId + "/LinkUserId/" + row.linkUserId;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(['/core/user-support-access/list/LinkSiteId/', row.linkSiteId, 'LinkUserId', row.linkUserId]);
    }
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
    this.contentService.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          statist.set(this.translate.instant('MESSAGE.All'), ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
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

    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'RecordStatus';
    fastfilter.value = EnumRecordStatus.Available;
    filterStatist1.filters.push(fastfilter);
    this.contentService.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          statist.set(this.translate.instant('MESSAGE.Active'), ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
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
        title: ''
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
  onActionTableRowSelect(row: CoreSiteUserModel): void {
    this.tableRowSelected = row;

    if (!row["expanded"])
      row["expanded"] = false;
    row["expanded"] = !row["expanded"]
  }
  onActionTableRowMouseEnter(row: CoreSiteUserModel): void {
    this.tableRowSelected = row;
    row["expanded"] = true;
  }
  onActionTableRowMouseLeave(row: CoreSiteUserModel): void {
    row["expanded"] = false;
  }
  onActionbuttonSiteList(model: CoreSiteUserModel = this.tableRowSelected, event?: MouseEvent): void {
    if (!model || !model.linkUserId || model.linkUserId === 0 || !model.linkSiteId || model.linkSiteId === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;

    if (event?.ctrlKey) {
      this.link = "/#/core/site/list/LinkUserId/" + model.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(['/core/site/list/LinkUserId/', model.id]);
    }
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


  onActionGridExpandRows(flag: boolean) {
    this.tableSource.data.forEach(row => {
      row['expanded'] = flag;
    })
  }
}
