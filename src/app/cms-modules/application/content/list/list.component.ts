import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  ApplicationAppModel,
  ApplicationAppService,
  ApplicationSourceModel,
  CoreAuthService,
  DataFieldInfoModel,
  EnumRecordStatus,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  NtkCmsApiStoreService,
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
import { ApplicationAppDownloadComponent } from '../download/download.component';
import { ApplicationAppUploadAppComponent } from '../uploadApp/uploadApp.component';
import { ApplicationAppUploadUpdateComponent } from '../uploadUpdate/uploadUpdate.component';
import { Subscription } from 'rxjs';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { ApplicationLogNotificationActionSendComponent } from '../../notification/action-send/action-send.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-application-app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ApplicationAppListComponent implements OnInit, OnDestroy {
  requestLinkSourceId = 0;
  requestLinkThemeConfigId = 0;
  constructor(
    private applicationAppService: ApplicationAppService,
    private activatedRoute: ActivatedRoute,
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private translate: TranslateService,
    private router: Router,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    public dialog: MatDialog) {
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
  dataModelResult: ErrorExceptionResult<ApplicationAppModel> = new ErrorExceptionResult<ApplicationAppModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<ApplicationAppModel> = [];
  tableRowSelected: ApplicationAppModel = new ApplicationAppModel();
  tableSource: MatTableDataSource<ApplicationAppModel> = new MatTableDataSource<ApplicationAppModel>();
  categoryModelSelected: ApplicationSourceModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  tabledisplayedColumns: string[] = [
    'Id',
    'RecordStatus',
    'Title',
    'AppVersion',
    'LinkSourceId',
    'CreatedDate',
    'UpdatedDate',
    'LastSuccessfullyBuildDate',
    'Action'
  ];



  expandedElement: ApplicationAppModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.requestLinkSourceId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkSourceId'));
    this.requestLinkThemeConfigId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkThemeConfigId'));
    const filter = new FilterDataModel();
    if (this.requestLinkSourceId > 0) {
      filter.PropertyName = 'LinkSourceId';
      filter.Value = this.requestLinkSourceId;
      this.filteModelContent.Filters.push(filter);
    }
    if (this.requestLinkThemeConfigId > 0) {
      filter.PropertyName = 'LinkThemeConfigId';
      filter.Value = this.requestLinkThemeConfigId;
      this.filteModelContent.Filters.push(filter);
    }
    this.DataGetAll();
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.DataGetAll();
      this.tokenInfo = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }

  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new ApplicationAppModel();
    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    const filter = new FilterDataModel();
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    if (this.categoryModelSelected && this.categoryModelSelected.Id > 0) {
      filter.PropertyName = 'LinkSourceId';
      filter.Value = this.categoryModelSelected.Id;
      filterModel.Filters.push(filter);
    }

    this.applicationAppService.ServiceGetAll(filterModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

          this.dataModelResult = next;
          this.tableSource.data = next.ListItems;
          if (this.tokenInfo.UserAccessAdminAllowToAllData) {
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
          if (this.requestLinkSourceId === 0) {
            this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
              this.tabledisplayedColumns,
              'LinkSourceId'
            );
          }
          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(next.Access);
          }
        }
        else {
          this.cmsToastrService.typeErrorGetAll(next.ErrorMessage);

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
    let sourceId = 0;

    if (
      this.requestLinkSourceId &&
      this.requestLinkSourceId > 0
    ) {
      sourceId = this.requestLinkSourceId;
    }
    if (
      this.categoryModelSelected &&
      this.categoryModelSelected.Id > 0
    ) {
      sourceId = this.categoryModelSelected.Id;
    }
    if (sourceId === 0) {
      const message = 'نوع سورس اپلیکیشن انتخاب نشده است';
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
    this.router.navigate(['/application/app/add/', sourceId]);
  }

  onActionSelectorSelect(model: ApplicationSourceModel | null): void {
    this.filteModelContent = new FilterModel();
    this.categoryModelSelected = model;

    this.DataGetAll();
  }
  onActionbuttonEditRow(mode: ApplicationAppModel = this.tableRowSelected): void {
    if (!mode || !mode.Id || mode.Id === 0) {

      this.cmsToastrService.typeErrorSelected(this.translate.instant('MESSAGE.No_row_selected_for_editing'));
      return;
    }
    this.tableRowSelected = mode;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessEditRow
    ) {
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }

    // const dialogRef = this.dialog.open(NewsCommentEditComponent, {
    //   data: { id: this.tableRowSelected.Id }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log(`Dialog result: ${result}`);
    //   if (result && result.dialogChangedDate) {
    //     this.DataGetAll();
    //   }
    // });
    this.router.navigate(['/application/app/edit/', this.tableRowSelected.Id]);

  }
  onActionbuttonDeleteRow(mode: ApplicationAppModel = this.tableRowSelected): void {
    if (mode == null || !mode.Id || mode.Id === 0) {
      const emessage = 'ردیفی برای ویرایش انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = mode;
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
          this.applicationAppService.ServiceDelete(this.tableRowSelected.Id).subscribe(
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
    this.applicationAppService.ServiceGetCount(this.filteModelContent).subscribe(
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
    this.applicationAppService.ServiceGetCount(filterStatist1).subscribe(
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
    this.applicationAppService.ServiceExportFile(model).subscribe(
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
  onActionTableRowSelect(row: ApplicationAppModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/application/source/']);
  }
  onActionBackToParentTheme(): void {
    this.router.navigate(['/application/themeconfig/']);
  }
  onActionbuttonUploadApp(mode: ApplicationAppModel = this.tableRowSelected): void {
    if (mode == null || !mode.Id || mode.Id === 0) {
      const message = 'ردیفی  انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = mode;
    const dialogRef = this.dialog.open(ApplicationAppUploadAppComponent, {
      data: this.tableRowSelected,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonUploadUpdate(mode: ApplicationAppModel = this.tableRowSelected): void {
    if (mode == null || !mode.Id || mode.Id === 0) {
      const message = 'ردیفی  انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = mode;
    const dialogRef = this.dialog.open(ApplicationAppUploadUpdateComponent, {
      data: this.tableRowSelected,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });



  }
  onActionbuttonBuildApp(mode: ApplicationAppModel = this.tableRowSelected): void {
    if (mode == null || !mode.Id || mode.Id === 0) {
      const message = 'ردیفی  انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = mode;
    this.loading.display = true;
    this.loading.Globally = false;
    this.applicationAppService.ServiceBuild(this.tableRowSelected.Id).subscribe(
      (next) => {
        this.loading.display = false;
        if (next.IsSuccess) {
          this.cmsToastrService.typeSuccessAppBuild(next.ErrorMessage);
        }
        else {
          this.cmsToastrService.typeErrorGetAll(next.ErrorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);

        this.loading.display = false;
      }
    );

  }
  onActionbuttonDownloadApp(mode: ApplicationAppModel = this.tableRowSelected): void {
    if (mode == null || !mode.Id || mode.Id === 0) {

      const message = 'ردیفی  انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = mode;
    const dialogRef = this.dialog.open(ApplicationAppDownloadComponent, {
      data: this.tableRowSelected,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });

  }
  onActionbuttonNotifictionActionSend(model: ApplicationAppModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      this.cmsToastrService.typeErrorSelected();
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
      data: { LinkApplicationId: this.tableRowSelected.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {

      }
    });
  }
  onActionbuttonMemberList(mode: ApplicationAppModel = this.tableRowSelected): void {
    if (mode == null || !mode.Id || mode.Id === 0) {

      const message = 'ردیفی  انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = mode;
    this.router.navigate(['/application/memberinfo/LinkApplicationId/', this.tableRowSelected.Id]);
  }
  onActionbuttonIntroList(mode: ApplicationAppModel = this.tableRowSelected): void {
    if (mode == null || !mode.Id || mode.Id === 0) {

      const message = 'ردیفی  انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = mode;
    this.router.navigate(['/application/intro/LinkApplicationId/', this.tableRowSelected.Id]);
  }
}
