//**msh */
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  ApiTelegramLogOutputModel,
  ApiTelegramLogOutputService,
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
  selector: 'app-apitelegram-bot-config-list',
  templateUrl: './list.component.html',

})
export class ApiTelegramLogOutputListComponent implements OnInit, OnDestroy {
  requestLinkBotConfigId = 0;
  constructor(
    private contentService: ApiTelegramLogOutputService,
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
    this.filteModelContent.SortColumn = 'Id';
    this.filteModelContent.SortType = EnumSortType.Ascending;
  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<ApiTelegramLogOutputModel> = new ErrorExceptionResult<ApiTelegramLogOutputModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<ApiTelegramLogOutputModel> = [];
  tableRowSelected: ApiTelegramLogOutputModel = new ApiTelegramLogOutputModel();
  tableSource: MatTableDataSource<ApiTelegramLogOutputModel> = new MatTableDataSource<ApiTelegramLogOutputModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  tabledisplayedColumns: string[] = [
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


  expandedElement: ApiTelegramLogOutputModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.requestLinkBotConfigId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkBotConfigId'));
    const filter = new FilterDataModel();
    if (this.requestLinkBotConfigId > 0) {
      filter.PropertyName = 'LinkBotConfigId';
      filter.Value = this.requestLinkBotConfigId;
      this.filteModelContent.Filters.push(filter);
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
    if (this.tokenInfo.UserAccessAdminAllowToAllData || this.tokenInfo.UserAccessAdminAllowToProfessionalData) {
      this.tabledisplayedColumns = this.publicHelper.listAddIfNotExist(
        this.tabledisplayedColumns,
        'LinkSiteId',
        0
      );
    } else {
      this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
        this.tabledisplayedColumns,
        'LinkSiteId'
      );
    }

    this.tableRowsSelected = [];
    this.tableRowSelected = new ApiTelegramLogOutputModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    this.contentService.ServiceGetAllEditor(filterModel).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);

          this.dataModelResult = ret;
          this.tableSource.data = ret.ListItems;

          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(ret.Access);
          }
        }
        else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
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

  }

  onActionbuttonEditRow(model: ApiTelegramLogOutputModel = this.tableRowSelected): void {

  }
  onActionbuttonDeleteRow(model: ApiTelegramLogOutputModel = this.tableRowSelected): void {

  }

  onActionbuttonGoToModuleList(model: ApiTelegramLogOutputModel = this.tableRowSelected): void {

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
        if (ret.IsSuccess) {
          statist.set('All', ret.TotalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
      }
    }
    );

    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.PropertyName = 'RecordStatus';
    fastfilter.Value = EnumRecordStatus.Available;
    filterStatist1.Filters.push(fastfilter);
    this.contentService.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          statist.set('Active', ret.TotalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
        else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
        }
      }
      ,
      error: (er) => {
        this.cmsToastrService.typeError(er);
      }
    }
    );

  }
  onActionbuttonSendMessage(model: ApiTelegramLogOutputModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id.length === 0) {
      const emessage = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.tableRowSelected = model;
    //open popup
    const dialogRef = this.dialog.open(ApiTelegramActionSendMessageComponent, {
      // height: "90%",
      data: {
        LinkBotConfigId: model.LinkBotConfigId,
        ChatId: model.ChatId
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.DataGetAll();

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
    this.contentService.ServiceExportFile(model).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          exportlist.set('Download', ret.LinkFile);
          this.optionsExport.childMethods.setExportLinkFile(exportlist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
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
    this.filteModelContent.Filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: ApiTelegramLogOutputModel): void {
    this.tableRowSelected = row;
  }
  onActionbuttonLinkTo(model: ApiTelegramLogOutputModel = this.tableRowSelected): void {

  }
  onActionBackToParent(): void {
    this.router.navigate(['api-telegram/bot-config']);
  }
}
