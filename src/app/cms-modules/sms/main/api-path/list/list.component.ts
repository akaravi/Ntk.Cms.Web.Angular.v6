
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  SmsMainApiPathModel,
  SmsMainApiPathService,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  TokenInfoModel,
  FilterDataModel,
  EnumRecordStatus,
  DataFieldInfoModel,
  CoreCurrencyModel,
  SmsMainApiPathCompanyModel,
  SmsMainApiPathCompanyService,
  SmsMainApiPathPublicConfigService,
  SmsMainApiPathPublicConfigModel
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
import { SmsMainApiPathAddComponent } from '../add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { SmsMainApiPathSendTestComponent } from '../sendTest/sendTest.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-sms-apipath-list',
  templateUrl: './list.component.html'
})
export class SmsMainApiPathListComponent implements OnInit, OnDestroy {
  requestLinkSiteId = 0;
  requestLinkCompanyId = '';
  requestLinkPublicConfigId = '';
  constructor(
    public contentService: SmsMainApiPathService,
    private smsMainApiPathCompanyService: SmsMainApiPathCompanyService,
    private smsMainApiPathPublicConfigService: SmsMainApiPathPublicConfigService,
    public publicHelper: PublicHelper,
    private activatedRoute: ActivatedRoute,
    private cmsToastrService: CmsToastrService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private router: Router,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public dialog: MatDialog) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
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

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<SmsMainApiPathModel> = new ErrorExceptionResult<SmsMainApiPathModel>();
  dataModelCoreCurrencyResult: ErrorExceptionResult<CoreCurrencyModel> = new ErrorExceptionResult<CoreCurrencyModel>();
  dataModelCompanyResult: ErrorExceptionResult<SmsMainApiPathCompanyModel> = new ErrorExceptionResult<SmsMainApiPathCompanyModel>();
  dataModelPublicResult: ErrorExceptionResult<SmsMainApiPathPublicConfigModel> = new ErrorExceptionResult<SmsMainApiPathPublicConfigModel>();

  categoryModelSelected: SmsMainApiPathCompanyModel;

  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<SmsMainApiPathModel> = [];
  tableRowSelected: SmsMainApiPathModel = new SmsMainApiPathModel();
  tableSource: MatTableDataSource<SmsMainApiPathModel> = new MatTableDataSource<SmsMainApiPathModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  tabledisplayedColumns: string[]=[];
  tabledisplayedColumnsSource: string[] = [
    'LinkMainImageIdSrc',
    'Id',
    'RecordStatus',
    'Title',
    'LinkApiPathCompanyId',
    'LinkPublicConfigId',
    'UpdatedDate',
    'Action'
  ];



  expandedElement: SmsMainApiPathModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.paramMap.get('LinkCompanyId')) {
      this.requestLinkCompanyId = this.activatedRoute.snapshot.paramMap.get('LinkCompanyId');
    }
    if (this.activatedRoute.snapshot.paramMap.get('LinkSiteId')) {
      this.requestLinkSiteId = +this.activatedRoute.snapshot.paramMap.get('LinkSiteId') || 0;
    }
    if (this.activatedRoute.snapshot.paramMap.get('LinkPublicConfigId')) {
      this.requestLinkPublicConfigId = this.activatedRoute.snapshot.paramMap.get('LinkPublicConfigId');
    }
    const filter = new FilterDataModel();
    if (this.requestLinkPublicConfigId?.length > 0) {
      filter.propertyName = 'LinkPublicConfigId';
      filter.value = this.requestLinkPublicConfigId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkCompanyId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkApiPathCompanyId';
      filter.value = this.requestLinkCompanyId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkSiteId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkSiteId';
      filter.value = this.requestLinkSiteId;
      this.filteModelContent.filters.push(filter);
    }
    this.filteModelContent.sortColumn = 'Title';
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.DataGetAll();
    });
    this.getApiCopmanyList();
    this.getPublicConfig();
  }
  getPublicConfig(): void {
    const filter = new FilterModel();
    filter.rowPerPage = 100;
    this.smsMainApiPathPublicConfigService.ServiceGetAll(filter).subscribe((next) => {
      this.dataModelPublicResult = next;
    });
  }
  getApiCopmanyList(): void {
    const filter = new FilterModel();
    filter.rowPerPage = 100;
    this.smsMainApiPathCompanyService.ServiceGetAll(filter).subscribe((next) => {
      this.dataModelCompanyResult = next;
    });
  }

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tabledisplayedColumns = this.publicHelper.TabledisplayedColumnsCheckByAllDataAccess(this.tabledisplayedColumnsSource, [], this.tokenInfo);
    this.tableRowsSelected = [];
    this.tableRowSelected = new SmsMainApiPathModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    /** filter Category */
    if (this.categoryModelSelected && this.categoryModelSelected.id.length > 0) {
      let fastfilter = new FilterDataModel();
      fastfilter.propertyName = 'LinkApiPathCompanyId';
      fastfilter.value = this.categoryModelSelected.id;
      filterModel.filters.push(fastfilter);
    }
    /** filter Category */
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
      (!this.requestLinkCompanyId) || (this.requestLinkCompanyId && this.requestLinkCompanyId.length == 0)) {
      if (this.categoryModelSelected == null || this.categoryModelSelected.id.length === 0) {
        const message = this.translate.instant('MESSAGE.Company_not_selected');
        this.cmsToastrService.typeErrorSelected(message);
        return;
      }
    }

    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    var linkCompanyId = '';
    if (this.categoryModelSelected && this.categoryModelSelected.id.length > 0)
      linkCompanyId = this.categoryModelSelected.id;
    if (this.requestLinkCompanyId && this.requestLinkCompanyId.length > 0)
      linkCompanyId = this.requestLinkCompanyId;
    const dialogRef = this.dialog.open(SmsMainApiPathAddComponent, {
      height: '90%',
      data: { linkApiPathCompanyId: linkCompanyId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonEditRow(model: SmsMainApiPathModel = this.tableRowSelected): void {

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
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }
    this.router.navigate(['/sms/main/api-path/edit', this.tableRowSelected.id]);

  }
  onActionbuttonDeleteRow(model: SmsMainApiPathModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
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

  onActionSelectorSelect(model: SmsMainApiPathCompanyModel | null): void {
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
  onActionbuttonSuperSedersList(model: SmsMainApiPathModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {

      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    this.router.navigate(['/bankpayment/privatesiteconfig/LinkPublicConfigId', this.tableRowSelected.id]);
  }
  onActionbuttonMustSuperSedersList(model: SmsMainApiPathModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {

      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    this.router.navigate(['/bankpayment/privatesiteconfig/LinkPublicConfigId', this.tableRowSelected.id]);
  }
  onActionbuttonNumbersList(model: SmsMainApiPathModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {

      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    this.router.navigate(['/bankpayment/privatesiteconfig/LinkPublicConfigId', this.tableRowSelected.id]);
  }
  onActionbuttonPermitionList(model: SmsMainApiPathModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {

      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    this.router.navigate(['/sms/main/api-path-permission/LinkApiPathId', this.tableRowSelected.id]);
  }
  onActionbuttonOutBoxQueue(model: SmsMainApiPathModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {

      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    this.router.navigate(['/sms/log/outbox-queue/LinkApiPathId', this.tableRowSelected.id]);
  }
  onActionbuttonCopy(model: SmsMainApiPathModel = this.tableRowSelected): void {
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
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    const dialogRef = this.dialog.open(SmsMainApiPathAddComponent, {
      height: '90%',
      data: { id: this.tableRowSelected.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonPriceServicesList(model: SmsMainApiPathModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {

      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    this.router.navigate(['/sms/main/api-path-price-service/LinkApiPathId', this.tableRowSelected.id]);
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
  
  onActionbuttonSendTest(model: SmsMainApiPathModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {

      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    
    const dialogRef = this.dialog.open(SmsMainApiPathSendTestComponent, {
      height: '90%',
      data: { linkApiPathId: this.tableRowSelected.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonReportsRow(model: SmsMainApiPathModel = this.tableRowSelected): void {
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
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }
    this.router.navigate(["/sms/log/api-path/LinkApiPathId", this.tableRowSelected.id]);
  }
  onActionbuttonReload(): void {
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: SmsMainApiPathModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/sms/main/api-path-company']);
  }
}
