
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  EstatePropertyDetailModel,
  EstatePropertyDetailService,
  CoreAuthService,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  NtkCmsApiStoreService,
  TokenInfoModel,
  EnumRecordStatus,
  FilterDataModel,
  DataFieldInfoModel,
  EstatePropertyTypeLanduseService,
  EstatePropertyTypeLanduseModel,
  EstatePropertyDetailGroupModel,
  EstatePropertyDetailGroupService,
  EnumActionGoStep,
  EditStepDtoModel
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
import { EstatePropertyDetailEditComponent } from '../edit/edit.component';
import { EstatePropertyDetailAddComponent } from '../add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-hypershop-category-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EstatePropertyDetailListComponent implements OnInit, OnDestroy {
  requestLinkPropertyTypeLanduseId = '';
  constructor(
    private estatePropertyDetailService: EstatePropertyDetailService,
    private estatePropertyDetailGroupService: EstatePropertyDetailGroupService,
    private estatePropertyTypeLanduseService: EstatePropertyTypeLanduseService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private activatedRoute: ActivatedRoute,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public dialog: MatDialog) {
    this.requestLinkPropertyTypeLanduseId = this.activatedRoute.snapshot.paramMap.get('LinkPropertyTypeLanduseId');
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    this.optionsExport.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionExport(model),
    };
    /*filter Sort*/
    this.filteModelContent.SortColumn = 'Id';
    this.filteModelContent.SortType = EnumSortType.Descending;
    const filter = new FilterDataModel();
    if (this.requestLinkPropertyTypeLanduseId && this.requestLinkPropertyTypeLanduseId.length > 0) {
      filter.PropertyName = 'LinkPropertyTypeLanduseId';
      filter.Value = this.requestLinkPropertyTypeLanduseId;
      this.filteModelContent.Filters.push(filter);
    }
  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<EstatePropertyDetailModel> = new ErrorExceptionResult<EstatePropertyDetailModel>();
  dataModelEstatePropertyTypeLanduseResult: ErrorExceptionResult<EstatePropertyTypeLanduseModel> = new ErrorExceptionResult<EstatePropertyTypeLanduseModel>();
  dataModelEstatePropertyDetailGroupResult: ErrorExceptionResult<EstatePropertyDetailGroupModel> = new ErrorExceptionResult<EstatePropertyDetailGroupModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<EstatePropertyDetailModel> = [];
  tableRowSelected: EstatePropertyDetailModel = new EstatePropertyDetailModel();
  tableSource: MatTableDataSource<EstatePropertyDetailModel> = new MatTableDataSource<EstatePropertyDetailModel>();
  categoryModelSelected: EstatePropertyDetailGroupModel;

  tabledisplayedColumns: string[] = [
    'IconFont',
    'Title',
    'Unit',
    'ShowInFormOrder',
    'LinkPropertyTypeLanduseId',
    'LinkPropertyDetailGroupId',
    'Action'
  ];

  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();



  expandedElement: EstatePropertyDetailModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.SortColumn = 'Title';
    this.DataGetAll();
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.DataGetAll();
      this.tokenInfo = next;
    });
    this.getPropertyType();
    this.getPropertyDetailGroup();
  }
  getPropertyType(): void {
    const filter = new FilterModel();
    filter.RowPerPage = 100;
    this.estatePropertyTypeLanduseService.ServiceGetAll(filter).subscribe((next) => {
      this.dataModelEstatePropertyTypeLanduseResult = next;
    });
  }
  getPropertyDetailGroup(): void {
    const filter = new FilterModel();
    filter.RowPerPage = 100;
    this.estatePropertyDetailGroupService.ServiceGetAll(filter).subscribe((next) => {
      this.dataModelEstatePropertyDetailGroupResult = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new EstatePropertyDetailModel();

    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    if (this.categoryModelSelected && this.categoryModelSelected.Id.length > 0) {
      const fastfilter = new FilterDataModel();
      fastfilter.PropertyName = 'LinkPropertyDetailGroupId';
      fastfilter.Value = this.categoryModelSelected.Id;
      filterModel.Filters.push(fastfilter);
    }
    this.estatePropertyDetailService.ServiceGetAll(filterModel).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
        if (next.IsSuccess) {
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
  onTableDropRow(event: CdkDragDrop<EstatePropertyDetailModel[]>): void {
    const previousIndex = this.tableSource.data.findIndex(row => row === event.item.data);
    const model = new EditStepDtoModel<string>();
    model.Id = this.tableSource.data[previousIndex].Id;
    model.CenterId = this.tableSource.data[event.currentIndex].Id;
    if (previousIndex > event.currentIndex) {
      model.ActionGo = EnumActionGoStep.GoUp;
    }
    else {
      model.ActionGo = EnumActionGoStep.GoDown;
    }
    this.estatePropertyDetailService.ServiceEditStep(model).subscribe(
      (next) => {
        if (next.IsSuccess) {
          moveItemInArray(this.tableSource.data, previousIndex, event.currentIndex);
          this.tableSource.data = this.tableSource.data.slice();
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);

      }
    );
  }
  onActionSelectorSelect(model: EstatePropertyDetailGroupModel | null): void {
    this.filteModelContent = new FilterModel();
    this.categoryModelSelected = model;

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
    const dialogRef = this.dialog.open(EstatePropertyDetailAddComponent, {
      data: {
        LinkPropertyTypeLanduseId: this.requestLinkPropertyTypeLanduseId,
        LinkPropertyDetailGroupId: this.categoryModelSelected.Id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonEditRow(model: EstatePropertyDetailModel = this.tableRowSelected): void {

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
    const dialogRef = this.dialog.open(EstatePropertyDetailEditComponent, {
      data: { id: this.tableRowSelected.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonDeleteRow(model: EstatePropertyDetailModel = this.tableRowSelected): void {
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
          this.estatePropertyDetailService.ServiceDelete(this.tableRowSelected.Id).subscribe(
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
  onActionbuttonContentList(model: EstatePropertyDetailModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id.length === 0) {
      const message = 'ردیفی برای نمایش انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    this.router.navigate(['/hypershop/content/PareintId/', this.tableRowSelected.Id]);
  }

  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set('Active', 0);
    statist.set('All', 0);
    this.estatePropertyDetailService.ServiceGetCount(this.filteModelContent).subscribe(
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
    this.estatePropertyDetailService.ServiceGetCount(filterStatist1).subscribe(
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
    this.estatePropertyDetailService.ServiceExportFile(model).subscribe(
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
  onActionTableRowSelect(row: EstatePropertyDetailModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/estate/property-type-landuse/']);
  }
}
