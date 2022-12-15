
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  EnumRecordStatus,
  EnumSortType,
  ErrorExceptionResult,
  BiographyCommentModel,
  BiographyCommentService,
  TokenInfoModel,
  DataFieldInfoModel,
  EnumFilterDataModelSearchTypes,
  BiographyContentService
} from 'ntk-cms-api';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterModel, FilterDataModel } from 'ntk-cms-api';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchModel';
import { MatTableDataSource } from '@angular/material/table';
import { CmsExportListComponent } from 'src/app/shared/cms-export-list/cmsExportList.component';
import { CmsExportEntityComponent } from 'src/app/shared/cms-export-entity/cms-export-entity.component';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistModel';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BiographyCommentEditComponent } from '../edit/edit.component';
import { Subscription } from 'rxjs';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsLinkToComponent } from 'src/app/shared/cms-link-to/cms-link-to.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-biography-comment-list',
  templateUrl: './list.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BiographyCommentListComponent implements OnInit, OnDestroy {
  constructor(
    public contentService: BiographyCommentService,
    private biographyContentService: BiographyContentService,
    private activatedRoute: ActivatedRoute,
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
    if (this.activatedRoute.snapshot.paramMap.get("InChecking")) {
      this.searchInChecking =
        this.activatedRoute.snapshot.paramMap.get("InChecking") === "true";
    }
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    
    /*filter Sort*/
    this.filteModelContent.sortColumn = 'Id';
    this.filteModelContent.sortType = EnumSortType.Descending;
  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];
  searchInChecking = false;
  searchInCheckingChecked = false;
  requestContentId = 0;
  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<BiographyCommentModel> = new ErrorExceptionResult<BiographyCommentModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<BiographyCommentModel> = [];
  tableRowSelected: BiographyCommentModel = new BiographyCommentModel();
  tableSource: MatTableDataSource<BiographyCommentModel> = new MatTableDataSource<BiographyCommentModel>();
  tabledisplayedColumns: string[]=[];
  tabledisplayedColumnsSource: string[] = [
    'Id',
    'RecordStatus',
    'Writer',
    'CreatedDate',
    'UpdatedDate',
    'Action',
    "LinkTo",
  ];
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  expandedElement: BiographyCommentModel | null;
  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.requestContentId = + Number(this.activatedRoute.snapshot.paramMap.get('ContentId'));
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.DataGetAll();
    });
  }
  ngAfterViewInit(): void {
    if (this.searchInChecking) {
      this.searchInCheckingChecked = true;
    }
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tabledisplayedColumns=this.publicHelper.TabledisplayedColumnsCheckByAllDataAccess(this.tabledisplayedColumnsSource,[],this.tokenInfo);
    if (this.requestContentId === 0) {
      this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
        this.tabledisplayedColumns,
        'LinkContentId'
      );
    }
    this.tableRowsSelected = [];
    this.tableRowSelected = new BiographyCommentModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    if (this.requestContentId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'linkContentId';
      filter.value = this.requestContentId;
      filterModel.filters.push(filter);
    }
    if (this.searchInChecking) {
      const filter = new FilterDataModel();
      filter.propertyName = "RecordStatus";
      filter.value = EnumRecordStatus.Available;
      filter.searchType = EnumFilterDataModelSearchTypes.NotEqual;
      filterModel.filters.push(filter);
    }
    this.contentService.ServiceGetAllEditor(filterModel).subscribe({
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
  onActionbuttonNewRow(): void {
    if (
      this.requestContentId == null ||
      this.requestContentId === 0
    ) {
      const message = this.translate.instant('MESSAGE.Content_not_selected');
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
    const dialogRef = this.dialog.open(BiographyCommentEditComponent, {
      height: '90%',
      data: { contentId: this.requestContentId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonEditRow(model: BiographyCommentModel = this.tableRowSelected): void {
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
    const dialogRef = this.dialog.open(BiographyCommentEditComponent, {
      height: '90%',
      data: { id: this.tableRowSelected.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonDeleteRow(model: BiographyCommentModel = this.tableRowSelected): void {
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
    const message = this.translate.instant('MESSAGE.Do_you_want_to_delete_this_content') + '?' + ' <br> نویسنده:( ' + this.tableRowSelected.writer + ' ) ' + ' <br> نظر:( ' + this.tableRowSelected.comment + ' ) '; this.cmsConfirmationDialogService.confirm(title, message)
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
    statist.set('Active', 0);
    statist.set('All', 0);
    this.contentService.ServiceGetCount(this.filteModelContent).subscribe({
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
    this.contentService.ServiceGetCount(filterStatist1).subscribe({
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
  onActionbuttonInChecking(model: boolean): void {
    this.searchInChecking = model;
    this.DataGetAll();
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
  onActionTableRowSelect(row: BiographyCommentModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/biography/content/']);
  }
  onActionbuttonViewContent(model: BiographyCommentModel): void {
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
    const pName = this.constructor.name + "ServiceGetOneById";
    this.loading.Start(pName, this.translate.instant('MESSAGE.Get_biographical_information'));
    this.biographyContentService
      .ServiceGetOneById(this.tableRowSelected.linkContentId)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            //open popup
            const dialogRef = this.dialog.open(CmsLinkToComponent, {
              // height: "90%",
              data: {
                title: ret.item.title,
                urlViewContentQRCodeBase64: ret.item.urlViewContentQRCodeBase64,
                urlViewContent: ret.item.urlViewContent,
              },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result && result.dialogChangedDate) {
                this.DataGetAll();
              }
            });
            //open poup
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
  onActionbuttonEditContent(model: BiographyCommentModel): void {
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
    this.router.navigate(['/biography/content/edit', this.tableRowSelected.linkContentId]);
  }
  onActionbuttonLinkTo(
    model: BiographyCommentModel = this.tableRowSelected
  ): void {
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
    const pName = this.constructor.name + "ServiceGetOneById";
    this.loading.Start(pName, this.translate.instant('MESSAGE.Get_biographical_information'));
    this.biographyContentService
      .ServiceGetOneById(this.tableRowSelected.linkContentId)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            //open popup
            const dialogRef = this.dialog.open(CmsLinkToComponent, {
              height: "90%",
              width: "90%",
              data: {
                title: ret.item.title,
                urlViewContentQRCodeBase64: ret.item.urlViewContentQRCodeBase64,
                urlViewContent: ret.item.urlViewContent,
              },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result && result.dialogChangedDate) {
                this.DataGetAll();
              }
            });
            //open popup
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
}