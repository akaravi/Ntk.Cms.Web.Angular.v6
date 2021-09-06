import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  EstatePropertyModel,
  EstatePropertyService,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  NtkCmsApiStoreService,
  TokenInfoModel,
  EstatePropertyTypeLanduseModel,
  EnumRecordStatus,
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
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';

@Component({
  selector: 'app-application-app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EstatePropertyListComponent implements OnInit, OnDestroy {
  requestLinkPropertyTypeLanduseId = '';
  requestLinkContractTypeId = '';
  constructor(
    private estatePropertyService: EstatePropertyService,
    private activatedRoute: ActivatedRoute,
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private tokenHelper: TokenHelper,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog) {
    this.loading.cdr = this.cdr;
    this.requestLinkPropertyTypeLanduseId = this.activatedRoute.snapshot.paramMap.get('LinkPropertyTypeLanduseId');
    this.requestLinkContractTypeId = this.activatedRoute.snapshot.paramMap.get('LinkContractTypeId');

    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    this.optionsExport.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionExport(model),
    };
    /*filter Sort*/
    this.filteModelProperty.SortColumn = 'CreatedDate';
    this.filteModelProperty.SortType = EnumSortType.Descending;
    if (this.requestLinkPropertyTypeLanduseId && this.requestLinkPropertyTypeLanduseId.length > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkPropertyTypeLanduseId';
      filter.Value = this.requestLinkPropertyTypeLanduseId;
      this.filteModelProperty.Filters.push(filter);
    }
    if (this.requestLinkContractTypeId && this.requestLinkContractTypeId.length > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'Contracts';
      filter.PropertyAnyName = 'LinkEstateContractTypeId';
      filter.Value = this.requestLinkContractTypeId;
      this.filteModelProperty.Filters.push(filter);
    }
  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tablePropertySelected = [];

  filteModelProperty = new FilterModel();
  dataModelResult: ErrorExceptionResult<EstatePropertyModel> = new ErrorExceptionResult<EstatePropertyModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<EstatePropertyModel> = [];
  tableRowSelected: EstatePropertyModel = new EstatePropertyModel();
  tableSource: MatTableDataSource<EstatePropertyModel> = new MatTableDataSource<EstatePropertyModel>();
  categoryModelSelected: EstatePropertyTypeLanduseModel;
  tabledisplayedColumns: string[] = [
    'LinkMainImageIdSrc',
    'Id',
    'RecordStatus',
    'LinkSiteId',
    'Title',
    'ViewCount',
    'CreatedDate',
    'UpdatedDate',
    'Action'
  ];
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {



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
    this.tableRowSelected = new EstatePropertyModel();

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.filteModelProperty.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelProperty));
    /*filter CLone*/
    if (this.categoryModelSelected && this.categoryModelSelected.Id && this.categoryModelSelected.Id.length > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkPropertyTypeLanduseId';
      filter.Value = this.categoryModelSelected.Id;
      filterModel.Filters.push(filter);
    }

    this.estatePropertyService.ServiceGetAll(filterModel).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);


        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.tableSource.data = next.ListItems;
          if (this.tokenInfo.UserAccessAdminAllowToAllData) {
            this.tabledisplayedColumns = this.publicHelper.listAddIfNotExist(
              this.tabledisplayedColumns,
              'LinkSiteId',
              0
            );
            this.tabledisplayedColumns = this.publicHelper.listAddIfNotExist(
              this.tabledisplayedColumns,
              'Id',
              0
            );
          } else {
            this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
              this.tabledisplayedColumns,
              'LinkSiteId'
            );
            this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
              this.tabledisplayedColumns,
              'Id'
            );
          }
          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(next.Access);
          }
        }
        else {
          this.cmsToastrService.typeErrorGetAll(next.ErrorMessage);

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
        this.filteModelProperty.SortColumn = sort.active;
        this.filteModelProperty.SortType = EnumSortType.Descending;
      } else if (this.tableSource.sort.start === 'desc') {
        this.filteModelProperty.SortColumn = '';
        this.filteModelProperty.SortType = EnumSortType.Ascending;
      } else {
        sort.start = 'desc';
      }
    } else {
      this.filteModelProperty.SortColumn = sort.active;
      this.filteModelProperty.SortType = EnumSortType.Ascending;
    }
    this.tableSource.sort = sort;
    this.filteModelProperty.CurrentPageNumber = 0;
    this.DataGetAll();
  }
  onTablePageingData(event?: PageEvent): void {
    this.filteModelProperty.CurrentPageNumber = event.pageIndex + 1;
    this.filteModelProperty.RowPerPage = event.pageSize;
    this.DataGetAll();
  }


  onActionbuttonNewRow(): void {
    if (this.categoryModelSelected == null &&
      (this.categoryModelSelected && this.categoryModelSelected.Id && this.categoryModelSelected.Id.length === 0) && (
        this.requestLinkPropertyTypeLanduseId == null ||
        this.requestLinkPropertyTypeLanduseId.length === 0)
    ) {
      const message = 'محتوا انتخاب نشده است';
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
    let parentId: string = this.requestLinkPropertyTypeLanduseId;
    if (this.categoryModelSelected && this.categoryModelSelected.Id.length > 0) {
      parentId = this.categoryModelSelected.Id;
    }
    if (parentId && parentId.length > 0) {
      this.router.navigate(['/estate/property/add/LinkPropertyTypeLanduseId', parentId]);
    } else {
      this.router.navigate(['/estate/property/add']);
    }
  }

  onActionSelectorSelect(model: EstatePropertyTypeLanduseModel | null): void {
    this.filteModelProperty = new FilterModel();
    this.categoryModelSelected = model;

    this.DataGetAll();
  }

  onActionbuttonEditRow(mode: EstatePropertyModel = this.tableRowSelected): void {
    if (!mode || !mode.Id || mode.Id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
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
    this.router.navigate(['/estate/property/edit', this.tableRowSelected.Id]);

    // const dialogRef = this.dialog.open(EstatePropertyEditComponent, {
    //   data: { id: this.tableRowSelected.Id }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log(`Dialog result: ${result}`);
    //   if (result && result.dialogChangedDate) {
    //     this.DataGetAll();
    //   }
    // });
  }
  onActionbuttonAdsRow(mode: EstatePropertyModel = this.tableRowSelected): void {
    if (!mode || !mode.Id || mode.Id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
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
    this.router.navigate(['/estate/property-ads/LinkPropertyId', this.tableRowSelected.Id]);
  }

  onActionbuttonDeleteRow(mode: EstatePropertyModel = this.tableRowSelected): void {
    if (mode == null || !mode.Id || mode.Id.length === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
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
          const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

          this.estatePropertyService.ServiceDelete(this.tableRowSelected.Id).subscribe(
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
    statist.set('All', 0);
    this.estatePropertyService.ServiceGetCount(this.filteModelProperty).subscribe(
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

    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelProperty));
    const fastfilter = new FilterDataModel();
    fastfilter.PropertyName = 'RecordStatus';
    fastfilter.Value = EnumRecordStatus.Available;
    filterStatist1.Filters.push(fastfilter);
    this.estatePropertyService.ServiceGetCount(filterStatist1).subscribe(
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
    this.optionsExport.childMethods.setExportFilterModel(this.filteModelProperty);
  }
  onSubmitOptionExport(model: FilterModel): void {
    const exportlist = new Map<string, string>();
    exportlist.set('Download', 'loading ... ');
    this.estatePropertyService.ServiceExportFile(model).subscribe(
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
    this.filteModelProperty.Filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: EstatePropertyModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/ticketing/departemen/']);
  }

}
