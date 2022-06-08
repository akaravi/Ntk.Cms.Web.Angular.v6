//**msh */
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  ApplicationAppModel,
  BankPaymentTransactionModel,
  BankPaymentTransactionService,
  DataFieldInfoModel,
  EnumInfoModel,
  EnumRecordStatus,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  TokenInfoModel,
  BankPaymentEnumService
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
import { BankPaymentTransactionViewComponent } from '../view/view.component';
import { BankPaymentTransactionEditComponent } from '../edit/edit.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
@Component({
  selector: 'app-bankpayment-transaction-list',
  templateUrl: './list.component.html',
})
export class BankPaymentTransactionListComponent implements OnInit, OnDestroy {
  requestLinkPrivateSiteConfigId = 0;
  requestLinkUserId = 0;
  constructor(
    @Inject(DOCUMENT) private document: any,
    public contentService: BankPaymentTransactionService,
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private bankPaymentEnumService: BankPaymentEnumService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private router: Router,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    this.optionsExport.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionExport(model),
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
  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<BankPaymentTransactionModel> = new ErrorExceptionResult<BankPaymentTransactionModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  categoryModelSelected: ApplicationAppModel;
  tableRowsSelected: Array<BankPaymentTransactionModel> = [];
  tableRowSelected: BankPaymentTransactionModel = new BankPaymentTransactionModel();
  tableSource: MatTableDataSource<BankPaymentTransactionModel> = new MatTableDataSource<BankPaymentTransactionModel>();
  tabledisplayedColumns: string[] = [
    'Id',
    'LinkUserId',
    'RecordStatus',
    'TransactionStatus',
    'BankStatus',
    'Amount',
    'AmountPure',
    'UpdatedDate',
    'Action'
  ];
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModelEnumTransactionRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumTransactionBankStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  expandedElement: BankPaymentTransactionModel | null;
  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.requestLinkPrivateSiteConfigId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkPrivateSiteConfigId'));
    this.requestLinkUserId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserId'));
    if (this.requestLinkPrivateSiteConfigId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkPrivateSiteConfigId';
      filter.value = this.requestLinkPrivateSiteConfigId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkUserId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkUserId';
      filter.value = this.requestLinkUserId;
      this.filteModelContent.filters.push(filter);
    }
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.DataGetAll();
    });
    this.getEnumTransactionRecordStatus();
    this.getEnumTransactionBankStatus();
  }
  getEnumTransactionRecordStatus(): void {
    this.bankPaymentEnumService.ServiceEnumTransactionRecordStatus().subscribe((next) => {
      this.dataModelEnumTransactionRecordStatusResult = next;
    });
  }
  getEnumTransactionBankStatus(): void {
    this.bankPaymentEnumService.ServiceEnumTransactionBankStatus().subscribe((next) => {
      this.dataModelEnumTransactionBankStatusResult = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new BankPaymentTransactionModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    const filter = new FilterDataModel();
    if (this.categoryModelSelected && this.categoryModelSelected.id > 0) {
      filter.propertyName = 'LinkPrivateSiteConfigId';
      filter.value = this.categoryModelSelected.id;
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
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
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
  onActionbuttonViewRow(model: BankPaymentTransactionModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id <= 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorAccessWatch();
      return;
    }
    const dialogRef = this.dialog.open(BankPaymentTransactionViewComponent, {
      height: '90%',
      data: { id: this.tableRowSelected.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
      }
    });
  }
  onActionbuttonEditRow(model: BankPaymentTransactionModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id <= 0) {
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
    const dialogRef = this.dialog.open(BankPaymentTransactionEditComponent, {
      height: '90%',
      data: { id: this.tableRowSelected.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonDeleteRow(model: BankPaymentTransactionModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id <= 0) {
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
    const message = this.translate.instant('MESSAGE.Do_you_want_to_delete_this_content') + '?' + '<br> ( ' + this.tableRowSelected.id + ' ) ';
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
  onActionbuttonLog(model: BankPaymentTransactionModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id <= 0) {
      const emessage = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;
    this.router.navigate(['/bankpayment/transactionlog/LinkTransactionId/', this.tableRowSelected.id]);
  }
  onActionbuttonGotoBank(model: BankPaymentTransactionModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id <= 0) {
      const emessage = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Transferring_to_the_payment_gateway'));
    this.document.location.href = this.contentService.ServiceGoToBank(model.id);
  }
  onActionbuttonNotifictionActionSend(model: BankPaymentTransactionModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id <= 0) {
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
        if (ret.isSuccess) {
          statist.set('All', ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        } else {
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
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
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
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
        if (ret.isSuccess) {
          exportlist.set('Download', ret.linkFile);
          this.optionsExport.childMethods.setExportLinkFile(exportlist);
        } else {
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
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
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: BankPaymentTransactionModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/bankpayment/privatesiteconfig/']);
  }
  onActionBackToParentMember(): void {
    this.router.navigate(['/core/user/']);
  }
}