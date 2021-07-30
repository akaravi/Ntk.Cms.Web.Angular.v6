
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CoreUserClaimGroupDetailModel,
  CoreUserClaimGroupDetailService,
  CoreAuthService,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  NtkCmsApiStoreService,
  TokenInfoModel,
  FilterDataModel,
  EnumRecordStatus,
  DataFieldInfoModel,
  CoreUserClaimGroupModel,
  CoreUserClaimGroupService,
  CoreUserClaimTypeService,
  CoreUserClaimTypeModel,
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
import { CoreUserClaimGroupDetailEditComponent } from '../edit/edit.component';
import { CoreUserClaimGroupDetailAddComponent } from '../add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';

@Component({
  selector: 'app-core-userclaimgroupdetail-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CoreUserClaimGroupDetailListComponent implements OnInit, OnDestroy {
  requestLinkUserClaimGroupId = 0;
  requestLinkUserClaimTypeId = 0;
  constructor(
    private coreUserClaimGroupDetailService: CoreUserClaimGroupDetailService,
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private activatedRoute: ActivatedRoute,
    private coreUserClaimTypeService: CoreUserClaimTypeService,
    private coreUserClaimGroupService: CoreUserClaimGroupService,
    private router: Router,
    public dialog: MatDialog) {
    this.requestLinkUserClaimTypeId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserClaimTypeId'));
    this.requestLinkUserClaimGroupId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserClaimGroupId'));

    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    this.optionsExport.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionExport(model),
    };
    /*filter Sort*/
    this.filteModelContent.SortColumn = 'Id';
    this.filteModelContent.SortType = EnumSortType.Descending;
    if (this.requestLinkUserClaimTypeId > 0) {
      const fastfilter = new FilterDataModel();
      fastfilter.PropertyName = 'LinkUserClaimTypeId';
      fastfilter.Value = this.requestLinkUserClaimTypeId;
      this.filteModelContent.Filters.push(fastfilter);
    }
    if (this.requestLinkUserClaimGroupId > 0) {
      const fastfilter = new FilterDataModel();
      fastfilter.PropertyName = 'LinkUserClaimGroupId';
      fastfilter.Value = this.requestLinkUserClaimGroupId;
      this.filteModelContent.Filters.push(fastfilter);
    }
  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreUserClaimGroupDetailModel> = new ErrorExceptionResult<CoreUserClaimGroupDetailModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreUserClaimGroupDetailModel> = [];
  tableRowSelected: CoreUserClaimGroupDetailModel = new CoreUserClaimGroupDetailModel();
  tableSource: MatTableDataSource<CoreUserClaimGroupDetailModel> = new MatTableDataSource<CoreUserClaimGroupDetailModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  categoryModelSelected: CoreUserClaimGroupModel = new CoreUserClaimGroupModel();
  dataModelCoreUserClaimTypeResult: ErrorExceptionResult<CoreUserClaimTypeModel> = new ErrorExceptionResult<CoreUserClaimTypeModel>();
  dataModelCoreUserClaimGroupResult: ErrorExceptionResult<CoreUserClaimGroupModel> = new ErrorExceptionResult<CoreUserClaimGroupModel>();

  tabledisplayedColumns: string[] = [
    'RecordStatus',
    'LinkUserClaimGroupId',
    'LinkUserClaimTypeId',
    'IsRequired',
    'Action'
  ];



  expandedElement: CoreUserClaimGroupDetailModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.SortColumn = 'Title';
    this.DataGetAll();
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.DataGetAll();
      this.tokenInfo = next;
    });
    this.getUserClaimType();
    this.getUserClaimGroup();
  }
  getUserClaimType(): void {
    const filter = new FilterModel();
    filter.RowPerPage = 100;
    this.coreUserClaimTypeService.ServiceGetAll(filter).subscribe((next) => {
      this.dataModelCoreUserClaimTypeResult = next;
    });
  }
  getUserClaimGroup(): void {
    const filter = new FilterModel();
    filter.RowPerPage = 100;
    this.coreUserClaimGroupService.ServiceGetAll(filter).subscribe((next) => {
      this.dataModelCoreUserClaimGroupResult = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreUserClaimGroupDetailModel();

    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/

    if (this.categoryModelSelected && this.categoryModelSelected.Id > 0) {
      const fastfilter = new FilterDataModel();
      fastfilter.PropertyName = 'LinkUserClaimHeaderId';
      fastfilter.Value = this.categoryModelSelected.Id;
      filterModel.Filters.push(fastfilter);
    }
    this.coreUserClaimGroupDetailService.ServiceGetAll(filterModel).subscribe(
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
    const dialogRef = this.dialog.open(CoreUserClaimGroupDetailAddComponent, {
      data: {
        LinkUserClaimGroupId: this.requestLinkUserClaimGroupId,
        LinkUserClaimTypeId: this.requestLinkUserClaimTypeId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonEditRow(model: CoreUserClaimGroupDetailModel = this.tableRowSelected): void {

    if (!model || !model.LinkUserClaimGroupId || model.LinkUserClaimGroupId === 0
      || !model.LinkUserClaimTypeId || model.LinkUserClaimTypeId === 0) {
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
    const dialogRef = this.dialog.open(CoreUserClaimGroupDetailEditComponent, {
      data: { model: this.tableRowSelected }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionSelectorSelect(model: CoreUserClaimGroupModel | null): void {
    this.filteModelContent = new FilterModel();
    this.categoryModelSelected = model;

    this.DataGetAll();
  }
  onActionbuttonDeleteRow(model: CoreUserClaimGroupDetailModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
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
    const message = 'آیا مایل به حدف این محتوا می باشید ' + '?' + '<br> ( ' + this.tableRowSelected.Id + ' ) ';
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          this.loading.display = true;
          this.coreUserClaimGroupDetailService.ServiceDeleteEntity(this.tableRowSelected).subscribe(
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
    this.coreUserClaimGroupDetailService.ServiceGetCount(this.filteModelContent).subscribe(
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
    this.coreUserClaimGroupDetailService.ServiceGetCount(filterStatist1).subscribe(
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
    this.coreUserClaimGroupDetailService.ServiceExportFile(model).subscribe(
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
  onActionTableRowSelect(row: CoreUserClaimGroupDetailModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParentType(): void {
    this.router.navigate(['/core/userclaim/type/']);
  }
  onActionBackToParentGroup(): void {
    this.router.navigate(['/core/userclaim/group/']);
  }
}
