
import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CoreModuleModel,
  CoreModuleService,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  TokenInfoModel,
  FilterDataModel,
  EnumRecordStatus,
  DataFieldInfoModel,
  EditStepDtoModel,
  EnumActionGoStep
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
import { CoreModuleEditComponent } from '../edit/edit.component';
import { CoreModuleAddComponent } from '../add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-core-module-list',
  templateUrl: './list.component.html',
})
export class CoreModuleListComponent implements OnInit, OnDestroy {
  constructor(
    public contentService: CoreModuleService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private tokenHelper: TokenHelper,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public dialog: MatDialog) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    
    /*filter Sort*/
    this.filteModelContent.sortColumn = 'Id';
    this.filteModelContent.sortType = EnumSortType.Ascending;
  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreModuleModel> = [];
  tableRowSelected: CoreModuleModel = new CoreModuleModel();
  tableSource: MatTableDataSource<CoreModuleModel> = new MatTableDataSource<CoreModuleModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  tabledisplayedColumns: string[]=[];
  tabledisplayedColumnsSource: string[] = [
    'LinkMainImageIdSrc',
    'Id',
    'RecordStatus',
    'Title',
    'ClassName',
    'ShowInOrder',
    'CreatedDate',
    'UpdatedDate',
    'ExpireDate',
    'position',
    'Action'
  ];


  expandedElement: CoreModuleModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.sortColumn = 'ShowInMenuOrder';
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
    this.tabledisplayedColumns = this.publicHelper.TabledisplayedColumnsCheckByAllDataAccess(this.tabledisplayedColumnsSource, [], this.tokenInfo);
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreModuleModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
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
    const dialogRef = this.dialog.open(CoreModuleAddComponent, {
      height: '90%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonNewRowAuto(): any {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.contentService.ServiceAutoAdd().subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.cmsToastrService.typeSuccessAdd();
          this.DataGetAll();
        }
        else {
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
  onActionbuttonEditRow(model: CoreModuleModel = this.tableRowSelected): void {

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
    const dialogRef = this.dialog.open(CoreModuleEditComponent, {
      height: '90%',
      data: { id: this.tableRowSelected.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonDeleteRow(model: CoreModuleModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id === 0) {
      const emessage = this.translate.instant('MESSAGE.no_row_selected_to_delete');
      this.cmsToastrService.typeErrorSelected(emessage);
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
    const message = this.translate.instant('MESSAGE.Do_you_want_to_delete_this_content') + '?' + '<br> ( ' + this.tableRowSelected.title + ' ) ';
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

  onActionbuttonGoToModuleList(model: CoreModuleModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id === 0) {
      const message = this.translate.instant('MESSAGE.no_row_selected_to_display');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    this.router.navigate(['/core/siteModule/', this.tableRowSelected.id]);
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

  onTableDropRow(event: CdkDragDrop<CoreModuleModel[]>): void {
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
  onActionbuttonConfigMainAdminRow(model: CoreModuleModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id === 0) {
      const emessage = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate([model.className + '/config/mainadmin/']);
  }
  onActionbuttonSiteList(model: CoreModuleModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id === 0) {
      const emessage = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate(['core/site/modulelist/LinkModuleId/', model.id]);
  }
  onActionbuttonSiteCategoryList(model: CoreModuleModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id === 0) {
      const emessage = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate(['core/sitecategorymodule/LinkCmsModuleId/', model.id]);
  }
  onActionbuttonModuleEntityList(model: CoreModuleModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id === 0) {
      const emessage = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate(['core/module-entity/LinkModuleId/', model.id]);
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
        title: this.tableRowSelected.title
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
  onActionTableRowSelect(row: CoreModuleModel): void {
    this.tableRowSelected = row;
  }

}
