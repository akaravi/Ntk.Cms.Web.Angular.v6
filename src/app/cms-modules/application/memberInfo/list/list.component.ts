//**msh */
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  ApplicationAppModel,
  ApplicationMemberInfoModel,
  ApplicationMemberInfoService,
  DataFieldInfoModel,
  EnumRecordStatus,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  TokenInfoModel
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
import { ApplicationMemberInfoViewComponent } from '../view/view.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { ApplicationLogNotificationActionSendComponent } from '../../notification/action-send/action-send.component';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-application-memberinfo-list',
  templateUrl: './list.component.html',
})
export class ApplicationMemberInfoListComponent implements OnInit, OnDestroy {
  requestLinkApplicationId = 0;
  requestLinkMemberId = 0;
  constructor(
    public contentService: ApplicationMemberInfoService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private tokenHelper: TokenHelper,
    public dialog: MatDialog) {
    this.loading.cdr = this.cdr;
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
  dataModelResult: ErrorExceptionResult<ApplicationMemberInfoModel> = new ErrorExceptionResult<ApplicationMemberInfoModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  categoryModelSelected: ApplicationAppModel;
  tableRowsSelected: Array<ApplicationMemberInfoModel> = [];
  tableRowSelected: ApplicationMemberInfoModel = new ApplicationMemberInfoModel();
  tableSource: MatTableDataSource<ApplicationMemberInfoModel> = new MatTableDataSource<ApplicationMemberInfoModel>();
  tabledisplayedColumns: string[] = [
    'Id',
    'RecordStatus',
    'LinkUserId',
    'LinkMemberId',
    'DeviceStatus',
    'DeviceId',
    'DeviceBrand',
    'SimCard',
    'AppBuildVer',
    'AppSourceVer',
    'ScorePercent',
    'LinkApplicationId',
    'CreatedDate',
    'Action'
  ];
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  expandedElement: ApplicationMemberInfoModel | null;
  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.requestLinkApplicationId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkApplicationId'));
    this.requestLinkMemberId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkMemberId'));
    const filter = new FilterDataModel();
    if (this.requestLinkApplicationId > 0) {
      filter.PropertyName = 'LinkApplicationId';
      filter.Value = this.requestLinkApplicationId;
      this.filteModelContent.Filters.push(filter);
    }
    if (this.requestLinkMemberId > 0) {
      filter.PropertyName = 'LinkMemberId';
      filter.Value = this.requestLinkMemberId;
      this.filteModelContent.Filters.push(filter);
    }
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
    this.tableRowSelected = new ApplicationMemberInfoModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName,this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    const filter = new FilterDataModel();
    if (this.categoryModelSelected && this.categoryModelSelected.Id) {
      filter.PropertyName = 'LinkApplicationId';
      filter.Value = this.categoryModelSelected.Id;
      filterModel.Filters.push(filter);
    }
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
          if (this.requestLinkApplicationId === 0) {
            this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
              this.tabledisplayedColumns,
              'LinkApplicationId'
            );
          }
          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(ret.Access);
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
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
  onActionbuttonViewRow(model: ApplicationMemberInfoModel = this.tableRowSelected): void {
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
    const dialogRef = this.dialog.open(ApplicationMemberInfoViewComponent, {
      height: '90%',
      data: { id: this.tableRowSelected.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
      }
    });
  }
  onActionbuttonEditRow(model: ApplicationMemberInfoModel = this.tableRowSelected): void {
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
  }
  onActionbuttonDeleteRow(model: ApplicationMemberInfoModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id.length === 0) {
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
    const message = 'آیا مایل به حدف این محتوا می باشید ' + '?' +
      '<br> ( ' + this.tableRowSelected.Id + ' ) ';
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          const pName = this.constructor.name + 'main';
          this.loading.Start(pName);

          this.contentService.ServiceDelete(this.tableRowSelected.Id).subscribe({
            next: (ret) => {
              if (ret.IsSuccess) {
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
  onActionbuttonNotifictionList(model: ApplicationMemberInfoModel = this.tableRowSelected): void {
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
    this.router.navigate(['/application/notification/LinkApplicationMemberId', this.tableRowSelected.Id]);
  }
  onActionbuttonNotifictionActionSend(model: ApplicationMemberInfoModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    if (!model.NotificationId || model.NotificationId.length === 0) {
      this.cmsToastrService.typeErrorSelected('ردیف انتخاب شده داری نوتیفیکیشن آی دی نمی باشد');
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
    const dialogRef = this.dialog.open(ApplicationLogNotificationActionSendComponent, {
      height: '90%',
      data: { LinkApplicationMemberId: this.tableRowSelected.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
      }
    });
  }
  onActionSelectorSelect(model: ApplicationAppModel | null): void {
    this.filteModelContent = new FilterModel();
    this.categoryModelSelected = model;
    this.DataGetAll();
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
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
      }
    }
    );
    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.PropertyName = 'RecordStatus';
    fastfilter.Value = EnumRecordStatus.Available;
    filterStatist1.Filters.push(fastfilter);
    this.contentService.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          statist.set('Active', ret.TotalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
      },
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
  onSubmitOptionExport(model: FilterModel): void {
    const exportlist = new Map<string, string>();
    exportlist.set('Download', 'loading ... ');
    this.contentService.ServiceExportFile(model).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          exportlist.set('Download', ret.LinkFile);
          this.optionsExport.childMethods.setExportLinkFile(exportlist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
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
    this.filteModelContent.Filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: ApplicationMemberInfoModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/application/app/']);
  }
}