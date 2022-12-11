
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  ApiTelegramLogInputModel,
  ApiTelegramLogInputService,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  TokenInfoModel,
  FilterDataModel,
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
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ApiTelegramActionSendMessageComponent } from '../../action/send-message/send-message.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-apitelegram-log-input-list',
  templateUrl: './list.component.html',
})
export class ApiTelegramLogInputListComponent implements OnInit, OnDestroy {
  requestLinkBotConfigId = 0;
  constructor(
    private apiTelegramLogInputService: ApiTelegramLogInputService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private activatedRoute: ActivatedRoute,
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
    this.optionsExport.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionExport(model),

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
  dataModelResult: ErrorExceptionResult<ApiTelegramLogInputModel> = new ErrorExceptionResult<ApiTelegramLogInputModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<ApiTelegramLogInputModel> = [];
  tableRowSelected: ApiTelegramLogInputModel = new ApiTelegramLogInputModel();
  tableSource: MatTableDataSource<ApiTelegramLogInputModel> = new MatTableDataSource<ApiTelegramLogInputModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  tabledisplayedColumns: string[]=[];
  tabledisplayedColumnsSource: string[] = [
    'Id',
    'RecordStatus',
    'LinkBotConfigId',
    'Username',
    'ChatId',
    'StatusWebhook',
    'CreatedDate',
    'UpdatedDate',
    'Action',
  ];


  expandedElement: ApiTelegramLogInputModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.requestLinkBotConfigId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkBotConfigId'));
    const filter = new FilterDataModel();
    if (this.requestLinkBotConfigId > 0) {
      filter.propertyName = 'LinkBotConfigId';
      filter.value = this.requestLinkBotConfigId;
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
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
   this.tabledisplayedColumns=this.publicHelper.TabledisplayedColumnsCheckByAllDataAccess(this.tabledisplayedColumnsSource,[],this.tokenInfo);

    this.tableRowsSelected = [];
    this.tableRowSelected = new ApiTelegramLogInputModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    this.apiTelegramLogInputService.ServiceGetAllEditor(filterModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          this.dataModelResult = ret;
          this.tableSource.data = ret.listItems;

          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(ret.access);
          }
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
  }

  onActionbuttonEditRow(model: ApiTelegramLogInputModel = this.tableRowSelected): void {

  }
  onActionbuttonDeleteRow(model: ApiTelegramLogInputModel = this.tableRowSelected): void {

  }

  onActionbuttonGoToModuleList(model: ApiTelegramLogInputModel = this.tableRowSelected): void {

  }
  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set('Active', 0);
    statist.set('All', 0);
    this.apiTelegramLogInputService.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          statist.set('All', ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
        else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
      },
      error:(er) => {
        this.cmsToastrService.typeError(er);
      }
    }
    );

    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'RecordStatus';
    fastfilter.value = EnumRecordStatus.Available;
    filterStatist1.filters.push(fastfilter);
    this.apiTelegramLogInputService.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          statist.set('Active', ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
        else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
      },
      error:(er) => {
        this.cmsToastrService.typeError(er);
      }
    }
    );

  }
  onActionbuttonSendMessage(model: ApiTelegramLogInputModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      const emessage = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;
    //open popup
    const dialogRef = this.dialog.open(ApiTelegramActionSendMessageComponent, {
      // height: "90%",
      data: {
        linkBotConfigId: model.linkBotConfigId,
        chatId: model.chatId
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {

      }
    });
    //open popup
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
    this.apiTelegramLogInputService.ServiceExportFile(model).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          exportlist.set('Download', ret.linkFile);
          this.optionsExport.childMethods.setExportLinkFile(exportlist);
        }
        else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.optionsExport.data.inProcess=false;
        this.loading.Stop(pName);
      },
      error:(er) => {
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
  onActionTableRowSelect(row: ApiTelegramLogInputModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['api-telegram/bot-config']);
  }
}
