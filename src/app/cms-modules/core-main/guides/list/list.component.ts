
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CoreGuideModel,
  CoreGuideService,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  TokenInfoModel,
  FilterDataModel,
  EnumRecordStatus,
  DataFieldInfoModel,
  EnumActionGoStep,
  EditStepDtoModel,
  CoreEnumService,
  EnumInfoModel
} from 'ntk-cms-api';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialog } from '@angular/material/dialog';
import { CmsExportListComponent } from 'src/app/shared/cms-export-list/cmsExportList.component';
import { CmsExportEntityComponent } from 'src/app/shared/cms-export-entity/cms-export-entity.component';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistModel';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { CoreGuideEditComponent } from '../edit/edit.component';
import { CoreGuideAddComponent } from '../add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-core-guide-list',
  templateUrl: './list.component.html',
})
export class CoreGuideListComponent implements OnInit, OnDestroy {
  constructor(
    public contentService: CoreGuideService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    public coreEnumService: CoreEnumService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public dialog: MatDialog) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    
    /*filter Sort*/
    this.filteModelContent.sortColumn = 'ShowInMenuOrder';
    this.filteModelContent.sortType = EnumSortType.Ascending;
  }
  comment: string;
  author: string;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreGuideModel> = new ErrorExceptionResult<CoreGuideModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreGuideModel> = [];
  tableRowSelected: CoreGuideModel = new CoreGuideModel();
  tableSource: MatTableDataSource<CoreGuideModel> = new MatTableDataSource<CoreGuideModel>();


  tabledisplayedColumns: string[] = [];
  tabledisplayedColumnsSource: string[] = [
    'Id',
    'RecordStatus',
    'Key',
    'TitleFa',
    'ShowInMenuOrder',
    'Action',
    'position'
  ];

  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModelEnumMenuPlaceTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();


  expandedElement: CoreGuideModel | null;
  cmsApiStoreSubscribe: Subscription;
  categoryModelSelected: CoreGuideModel;
  ngOnInit(): void {

    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.DataGetAll();
    });
    this.getEnumMenuPlaceType();
  }
  getEnumMenuPlaceType(): void {
    this.coreEnumService.ServiceEnumMenuPlaceType().subscribe((next) => {
      this.dataModelEnumMenuPlaceTypeResult = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }


  DataGetAll(): void {
    this.tabledisplayedColumns = this.publicHelper.TabledisplayedColumnsCheckByAllDataAccess(this.tabledisplayedColumnsSource, [], this.tokenInfo);
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreGuideModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    if (this.categoryModelSelected && this.categoryModelSelected.id > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkParentId';
      filter.value = this.categoryModelSelected.id;
      filterModel.filters.push(filter);
    }
    this.contentService.ServiceGetAllEditor(filterModel).subscribe({
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

  onTableDropRow(event: CdkDragDrop<CoreGuideModel[]>): void {
    const previousIndex = this.tableSource.data.findIndex(row => row === event.item.data);
    const model = new EditStepDtoModel<number>();
    model.id = this.tableSource.data[previousIndex].id;
    model.centerId = this.tableSource.data[event.currentIndex].id;
    if (previousIndex > event.currentIndex) {
      model.actionGo = EnumActionGoStep.GoUp;
    }
    else {
      model.actionGo = EnumActionGoStep.GoDown;
    }
    this.contentService.ServiceEditStep(model).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          moveItemInArray(this.tableSource.data, previousIndex, event.currentIndex);
          this.tableSource.data = this.tableSource.data.slice();
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
      }
    }
    );
  }
  onActionSelectorSelect(model: CoreGuideModel | null): void {
     /*filter */
    var sortColumn = this.filteModelContent.sortColumn;
    var sortType = this.filteModelContent.sortType;
    this.filteModelContent =  new FilterModel();
    this.filteModelContent.sortColumn = sortColumn;
    this.filteModelContent.sortType = sortType;
    /*filter */
    this.categoryModelSelected = model;
    this.DataGetAll();
  }
  onActionbuttonNewRow(): void {
    if (
      this.categoryModelSelected == null ||
      this.categoryModelSelected.id === 0
    ) {
      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorCategoryNotSelected');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    const dialogRef = this.dialog.open(CoreGuideAddComponent, {
      height: '90%',
      data: { parentId: this.categoryModelSelected.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonEditRow(model: CoreGuideModel = this.tableRowSelected): void {

    if (!model || !model.id || model.id === 0) {
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
    const dialogRef = this.dialog.open(CoreGuideEditComponent, {
      height: '90%',
      data: { id: this.tableRowSelected.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonDeleteRow(mode: CoreGuideModel = this.tableRowSelected): void {
    if (mode == null || !mode.id || mode.id === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.tableRowSelected = mode;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessDeleteRow
    ) {
      this.cmsToastrService.typeErrorAccessDelete();
      return;
    }
    const title = this.translate.instant('MESSAGE.Please_Confirm');
    const message = this.translate.instant('MESSAGE.Do_you_want_to_delete_this_content') + '?' + '<br> ( ' + this.tableRowSelected.titleFa + ' ) ';
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          const pName = this.constructor.name + 'main';
          this.loading.Start(pName);

          this.contentService.ServiceDelete(this.tableRowSelected.id).subscribe({
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
    this.filteModelContent.sortColumn = 'ShowInMenuOrder';
    this.filteModelContent.sortType = EnumSortType.Ascending;
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: CoreGuideModel): void {
    this.tableRowSelected = row;
  }

}
