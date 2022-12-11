
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  MemberPropertyDetailModel,
  MemberPropertyDetailService,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  TokenInfoModel,
  EnumRecordStatus,
  FilterDataModel,
  DataFieldInfoModel,
  MemberPropertyDetailGroupModel,
  MemberPropertyTypeModel,
  MemberPropertyDetailGroupService,
  MemberPropertyTypeService,
  EditStepDtoModel,
  EnumActionGoStep
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
import { MemberPropertyDetailEditComponent } from '../edit/edit.component';
import { MemberPropertyDetailAddComponent } from '../add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { TranslateService } from '@ngx-translate/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-member-propertydetail-list',
  templateUrl: './list.component.html'
})
export class MemberPropertyDetailListComponent implements OnInit, OnDestroy {
  requestLinkPropertyTypeId = 0;
  constructor(
    private memberPropertyDetailService: MemberPropertyDetailService,
    private memberPropertyDetailGroupService: MemberPropertyDetailGroupService,
    private memberPropertyTypeService: MemberPropertyTypeService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    public publicHelper: PublicHelper,
    private activatedRoute: ActivatedRoute,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public dialog: MatDialog) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.requestLinkPropertyTypeId = +this.activatedRoute.snapshot.paramMap.get('LinkPropertyId');
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    this.optionsExport.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionExport(model),
    };
    /*filter Sort*/
    this.filteModelContent.sortColumn = 'Id';
    this.filteModelContent.sortType = EnumSortType.Descending;
    const filter = new FilterDataModel();
    if (this.requestLinkPropertyTypeId && this.requestLinkPropertyTypeId > 0) {
      filter.propertyName = 'LinkPropertyTypeId';
      filter.value = this.requestLinkPropertyTypeId;
      this.filteModelContent.filters.push(filter);
    }
  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<MemberPropertyDetailModel> = new ErrorExceptionResult<MemberPropertyDetailModel>();
  dataModelMemberPropertyTypeResult: ErrorExceptionResult<MemberPropertyTypeModel>
    = new ErrorExceptionResult<MemberPropertyTypeModel>();
  dataModelMemberPropertyDetailGroupResult: ErrorExceptionResult<MemberPropertyDetailGroupModel>
    = new ErrorExceptionResult<MemberPropertyDetailGroupModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<MemberPropertyDetailModel> = [];
  tableRowSelected: MemberPropertyDetailModel = new MemberPropertyDetailModel();
  tableSource: MatTableDataSource<MemberPropertyDetailModel> = new MatTableDataSource<MemberPropertyDetailModel>();
  categoryModelSelected: MemberPropertyDetailGroupModel;

  tabledisplayedColumns: string[]=[];
  tabledisplayedColumnsSource: string[] = [
    'IconFont',
    'Title',
    'Unit',
    'ShowInFormOrder',
    'LinkPropertyTypeId',
    'LinkPropertyDetailGroupId',
    'Action'
  ];

  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();



  expandedElement: MemberPropertyDetailModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.sortColumn = 'Title';
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.DataGetAll();
    });
    this.getPropertyType();
    this.getPropertyDetailGroup();
  }
  getPropertyType(): void {
    const filter = new FilterModel();
    filter.rowPerPage = 100;
    this.memberPropertyTypeService.ServiceGetAll(filter).subscribe((next) => {
      this.dataModelMemberPropertyTypeResult = next;
    });
  }
  getPropertyDetailGroup(): void {
    const filter = new FilterModel();
    filter.rowPerPage = 100;
    this.memberPropertyDetailGroupService.ServiceGetAll(filter).subscribe((next) => {
      this.dataModelMemberPropertyDetailGroupResult = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tabledisplayedColumns = this.publicHelper.TabledisplayedColumnsCheckByAllDataAccess(this.tabledisplayedColumnsSource, [], this.tokenInfo);
    this.tableRowsSelected = [];
    this.tableRowSelected = new MemberPropertyDetailModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    if (this.categoryModelSelected && this.categoryModelSelected.id > 0) {
      const fastfilter = new FilterDataModel();
      fastfilter.propertyName = 'LinkPropertyDetailGroupId';
      fastfilter.value = this.categoryModelSelected.id;
      filterModel.filters.push(fastfilter);
    }
    this.memberPropertyDetailService.ServiceGetAllEditor(filterModel).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
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
  // onTableDropRow(event: CdkDragDrop<MemberPropertyDetailModel[]>): void {
  //   const previousIndex = this.tableSource.data.findIndex(row => row === event.item.data);
  //   const model = new EditStepDtoModel<number>();
  //   model.id = this.tableSource.data[previousIndex].id;
  //   model.centerId = this.tableSource.data[event.currentIndex].id;
  //   if (previousIndex > event.currentIndex) {
  //     model.actionGo = EnumActionGoStep.GoUp;
  //   }
  //   else {
  //     model.actionGo = EnumActionGoStep.GoDown;
  //   }
  //   this.memberPropertyDetailService.ServiceEditStep(model).subscribe({
  //     next: (ret) => {
  //       if (ret.isSuccess) {
  //         moveItemInArray(this.tableSource.data, previousIndex, event.currentIndex);
  //         this.tableSource.data = this.tableSource.data.slice();
  //       } else {
  //         this.cmsToastrService.typeErrorMessage(ret.errorMessage);
  //       }
  //     },
  //     error: (er) => {
  //       this.cmsToastrService.typeError(er);
  //     }
  //   }
  //   );
  // }
  onActionSelectorSelect(model: MemberPropertyDetailGroupModel | null): void {
    this.filteModelContent = new FilterModel();
    this.categoryModelSelected = model;

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
    const dialogRef = this.dialog.open(MemberPropertyDetailAddComponent, {
      height: '90%',
      data: {
        linkPropertyTypeId: this.requestLinkPropertyTypeId,
        linkPropertyDetailGroupId: this.categoryModelSelected.id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonEditRow(model: MemberPropertyDetailModel = this.tableRowSelected): void {

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
    const dialogRef = this.dialog.open(MemberPropertyDetailEditComponent, {
      height: '90%',
      data: { id: this.tableRowSelected.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonDeleteRow(model: MemberPropertyDetailModel = this.tableRowSelected): void {
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

          this.memberPropertyDetailService.ServiceDelete(this.tableRowSelected.id).subscribe({
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
  onActionbuttonContentList(model: MemberPropertyDetailModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id === 0) {
      const message = this.translate.instant('MESSAGE.no_row_selected_to_display');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    this.router.navigate(['/hypershop/content/PareintId/', this.tableRowSelected.id]);
  }

  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set('Active', 0);
    statist.set('All', 0);
    this.memberPropertyDetailService.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          statist.set('All', ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
      }
    }
    );

    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'RecordStatus';
    fastfilter.value = EnumRecordStatus.Available;
    filterStatist1.filters.push(fastfilter);
    this.memberPropertyDetailService.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          statist.set('Active', ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
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
  onActionbuttonExport(): void {
    this.optionsExport.data.show = !this.optionsExport.data.show;
    this.optionsExport.childMethods.setExportFilterModel(this.filteModelContent);
  }
  onSubmitOptionExport(model: FilterModel): void {
    const exportlist = new Map<string, string>();
    exportlist.set('Download', 'loading ... ');
    const pName = this.constructor.name + '.ServiceExportFile';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Get_the_output_file'));
    this.optionsExport.data.inProcess=true;
    this.memberPropertyDetailService.ServiceExportFile(model).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          exportlist.set('Download', ret.linkFile);
          this.optionsExport.childMethods.setExportLinkFile(exportlist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.optionsExport.data.inProcess=false;
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.optionsExport.data.inProcess=false;
        this.loading.Stop(pName);
      }
    }
    );
  }

  onActionbuttonReload(): void {
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: MemberPropertyDetailModel): void {
    this.tableRowSelected = row;
  }
  // onActionBackToParent(): void {
  //   this.router.navigate(['/estate/property-type-landuse/']);
  // }
}
