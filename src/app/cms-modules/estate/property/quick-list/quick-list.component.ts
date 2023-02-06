
import {
  AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit
} from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import {
  DataFieldInfoModel, EnumClauseType, EnumFilterDataModelSearchTypes,
  EnumManageUserAccessDataTypes, EnumRecordStatus, EnumSortType,
  ErrorExceptionResult, EstatePropertyModel,
  EstatePropertyService, EstatePropertyTypeLanduseModel, FilterDataModel,
  FilterModel, FormInfoModel, TokenInfoModel
} from "ntk-cms-api";
import { Subscription } from "rxjs";
import { ComponentOptionSearchModel } from "src/app/core/cmsComponentModels/base/componentOptionSearchModel";
import { ComponentOptionStatistModel } from "src/app/core/cmsComponentModels/base/componentOptionStatistModel";
import { PublicHelper } from "src/app/core/helpers/publicHelper";
import { TokenHelper } from "src/app/core/helpers/tokenHelper";
import { ProgressSpinnerModel } from "src/app/core/models/progressSpinnerModel";
import { CmsToastrService } from "src/app/core/services/cmsToastr.service";
import { CmsConfirmationDialogService } from "src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service";
import { CmsExportEntityComponent } from "src/app/shared/cms-export-entity/cms-export-entity.component";
import { CmsExportListComponent } from "src/app/shared/cms-export-list/cmsExportList.component";
import { CmsLinkToComponent } from "src/app/shared/cms-link-to/cms-link-to.component";
import { EstatePropertyQuickViewComponent } from "../quick-view/quick-view.component";


@Component({
  selector: "app-estate-property-quick-list",
  templateUrl: "./quick-list.component.html",
})
export class EstatePropertyQuickListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  requestSearchTitle = "";
  requestSearchCustomerTel = "";
  requestSearchCaseCode = "";
  requestLinkPropertyTypeLanduseId = "";
  requestLinkPropertyTypeUsageId = "";
  requestLinkContractTypeId = "";
  requestLinkBillboardId = "";
  requestLinkCustomerOrderId = "";
  requestLinkProjectId = "";
  requestLinkUserId = 0;
  requestInChecking = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstatePropertyQuickListComponent>,
    public contentService: EstatePropertyService,
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    public tokenHelper: TokenHelper,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public translate: TranslateService,
    // private CoreModuleLogMemoModel : CoreModuleLogMemoModel,
  ) {
    this.loading.cdr = this.cdr;
    if (data) {
      if (data.searchTitle)
        this.requestSearchTitle = data.searchTitle + '';
      if (data.searchCustomerTel)
        this.requestSearchCustomerTel = data.searchCustomerTel + '';
      if (data.searchCaseCode)
        this.requestSearchCaseCode = data.searchCaseCode + '';
    }

    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.requestLinkPropertyTypeLanduseId =
      this.activatedRoute.snapshot.paramMap.get("LinkPropertyTypeLanduseId");
    this.requestLinkPropertyTypeUsageId =
      this.activatedRoute.snapshot.paramMap.get("LinkPropertyTypeUsageId");
    this.requestLinkContractTypeId =
      this.activatedRoute.snapshot.paramMap.get("LinkContractTypeId");
    this.requestLinkBillboardId =
      this.activatedRoute.snapshot.paramMap.get("LinkBillboardId");
    this.requestLinkCustomerOrderId = this.activatedRoute.snapshot.paramMap.get(
      "LinkCustomerOrderId"
    );
    this.requestLinkProjectId = this.activatedRoute.snapshot.paramMap.get(
      "LinkProjectId"
    );
    this.requestLinkUserId = +this.activatedRoute.snapshot.paramMap.get(
      "LinkUserId"
    ) | 0;
    if (this.activatedRoute.snapshot.paramMap.get("InChecking")) {
      this.searchInChecking =
        this.activatedRoute.snapshot.paramMap.get("InChecking") === "true";
    }
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };

    /*filter Sort*/
    this.filteModelContent.sortColumn = "CreatedDate";
    this.filteModelContent.sortType = EnumSortType.Descending;
    if (
      this.requestLinkPropertyTypeLanduseId &&
      this.requestLinkPropertyTypeLanduseId.length > 0
    ) {
      const filter = new FilterDataModel();
      filter.propertyName = "LinkPropertyTypeLanduseId";
      filter.value = this.requestLinkPropertyTypeLanduseId;
      this.filteModelContent.filters.push(filter);
    }
    if (
      this.requestLinkPropertyTypeUsageId &&
      this.requestLinkPropertyTypeUsageId.length > 0
    ) {
      const filter = new FilterDataModel();
      filter.propertyName = "LinkPropertyTypeUsageId";
      filter.value = this.requestLinkPropertyTypeUsageId;
      this.filteModelContent.filters.push(filter);
    }
    if (
      this.requestLinkContractTypeId &&
      this.requestLinkContractTypeId.length > 0
    ) {
      const filter = new FilterDataModel();
      filter.propertyName = "Contracts";
      filter.propertyAnyName = "LinkEstateContractTypeId";
      filter.value = this.requestLinkContractTypeId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkUserId && this.requestLinkUserId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = "linkCmsUserId";
      filter.value = this.requestLinkUserId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkProjectId && this.requestLinkProjectId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = "linkPropertyProjectId";
      filter.value = this.requestLinkProjectId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestSearchTitle && this.requestSearchTitle.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = "Title";
      filter.value = this.requestSearchTitle;
      filter.searchType = EnumFilterDataModelSearchTypes.Contains
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestSearchCaseCode && this.requestSearchCaseCode.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = "caseCode";
      filter.value = this.requestSearchCaseCode;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestSearchCustomerTel && this.requestSearchCustomerTel.length > 0) {

      const filter = new FilterDataModel();
      const filterClild1 = new FilterDataModel();
      filterClild1.propertyName = "aboutCustomerTel";
      filterClild1.value = this.requestSearchCustomerTel;
      filterClild1.searchType = EnumFilterDataModelSearchTypes.Contains;
      filterClild1.clauseType = EnumClauseType.Or;
      filter.filters.push(filterClild1);

      const filterClild2 = new FilterDataModel();
      filterClild2.propertyName = "aboutCustomerMobile";
      filterClild2.value = this.requestSearchCustomerTel;
      filterClild2.searchType = EnumFilterDataModelSearchTypes.Contains
      filterClild2.clauseType = EnumClauseType.Or;
      filter.filters.push(filterClild2);

      this.filteModelContent.filters.push(filter);
    }
  }
  @Input() optionloadComponent = true;
  @Input() optionloadByRoute = true;

  @Input() set optionLinkCustomerOrderId(id: string) {
    if (id && id.length > 0) {
      this.requestLinkCustomerOrderId = id;
    }
  }
  @Input() set optionLinkBillboardId(id: string) {
    if (id && id.length > 0) {
      this.requestLinkBillboardId = id;
    }
  }
  // SubjectTitle : string
  link: string;
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tablePropertySelected = [];
  searchInChecking = false;
  searchInCheckingChecked = false;
  filteModelContent = new FilterModel();
  formInfo: FormInfoModel = new FormInfoModel();

  dataModelResult: ErrorExceptionResult<EstatePropertyModel> =
    new ErrorExceptionResult<EstatePropertyModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel =
    new ComponentOptionStatistModel();

  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<EstatePropertyModel> = [];
  tableRowSelected: EstatePropertyModel = new EstatePropertyModel();
  tableSource: MatTableDataSource<EstatePropertyModel> =
    new MatTableDataSource<EstatePropertyModel>();
  categoryModelSelected: EstatePropertyTypeLanduseModel;
  tabledisplayedColumns: string[] = [];
  tabledisplayedColumnsSource: string[] = [
    "LinkMainImageIdSrc",
    "Id",
    "RecordStatus",
    "MainAdminRecordStatus",
    "IsSoldIt",
    "ViewConfigHiddenInList",
    "LinkSiteId",
    "AdsActive",
    "ViewCount",
    "CaseCode",
    "CreatedDate",
    "UpdatedDate",
    "Action",
    "LinkTo",
    "QuickView",
  ];
  tabledisplayedColumnsMobileSource: string[] = [
    "LinkMainImageIdSrc",
    "CaseCode",
    "IsSoldIt",
    'Action',
    "LinkTo",
    "QuickView",
  ];
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<
    string,
    DataFieldInfoModel
  >();
  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.QUICK_VIEW');

    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
      this.tokenHelper.CheckIsAdmin();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper
      .getCurrentTokenOnChange()
      .subscribe((next) => {
        this.tokenInfo = next;
        this.DataGetAll();
        this.tokenHelper.CheckIsAdmin();
      });

    // this.SubjectTitle = this.CoreModuleLogMemoModel.SubjectTitle;
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
    this.tabledisplayedColumns = this.publicHelper.TableDisplayedColumns(this.tabledisplayedColumnsSource, this.tabledisplayedColumnsMobileSource, [], this.tokenInfo);
    if (!this.optionloadComponent) {
      return;
    }
    this.tableRowsSelected = [];
    this.tableRowSelected = new EstatePropertyModel();
    const pName = this.constructor.name + "main";
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    if (
      this.categoryModelSelected &&
      this.categoryModelSelected.id &&
      this.categoryModelSelected.id.length > 0
    ) {
      const filter = new FilterDataModel();
      filter.propertyName = "LinkPropertyTypeLanduseId";
      filter.value = this.categoryModelSelected.id;
      filterModel.filters.push(filter);
    }
    if (this.searchInChecking) {
      const filter1 = new FilterDataModel();
      filter1.propertyName = "RecordStatus";
      filter1.value = EnumRecordStatus.Available;
      filter1.searchType = EnumFilterDataModelSearchTypes.NotEqual;
      filterModel.filters.push(filter1);
      const filter2 = new FilterDataModel();
      filter2.propertyName = "RecordStatus";
      filter2.value = EnumRecordStatus.DeniedConfirmed;
      filter2.searchType = EnumFilterDataModelSearchTypes.NotEqual;
      filterModel.filters.push(filter2);
    }

    if (this.requestLinkBillboardId && this.requestLinkBillboardId.length > 0) {
      // ** */
      this.contentService
        .ServiceGetAllWithBillboardId(this.requestLinkBillboardId, filterModel)
        .subscribe({
          next: (ret) => {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
            if (ret.isSuccess) {
              this.dataModelResult = ret;
              this.tableSource.data = ret.listItems;
              if (this.optionsSearch.childMethods) {
                this.optionsSearch.childMethods.setAccess(ret.access);
              }
            } else {
              this.cmsToastrService.typeErrorGetAll(ret.errorMessage);
            }
            this.loading.Stop(pName);
          },
          error: (er) => {
            this.cmsToastrService.typeError(er);
            this.loading.Stop(pName);
          }
        }
        );
      // ** */
    } else if (
      this.requestLinkCustomerOrderId &&
      this.requestLinkCustomerOrderId.length > 0
    ) {
      // ** */
      this.contentService
        .ServiceGetAllWithCustomerOrderId(
          this.requestLinkCustomerOrderId,
          filterModel
        )
        .subscribe({
          next: (ret) => {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
            if (ret.isSuccess) {
              this.dataModelResult = ret;
              this.tableSource.data = ret.listItems;
              if (this.optionsSearch.childMethods) {
                this.optionsSearch.childMethods.setAccess(ret.access);
              }
            } else {
              this.cmsToastrService.typeErrorGetAll(ret.errorMessage);
            }
            this.loading.Stop(pName);
          },
          error: (er) => {
            this.cmsToastrService.typeError(er)
            this.loading.Stop(pName);
          }
        }
        );
      // ** */
    } else {
      // ** */
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
            this.cmsToastrService.typeErrorGetAll(ret.errorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
      );
      //** */
    }
  }

  onTableSortData(sort: MatSort): void {
    if (
      this.tableSource &&
      this.tableSource.sort &&
      this.tableSource.sort.active === sort.active
    ) {
      if (this.tableSource.sort.start === "asc") {
        sort.start = "desc";
        this.filteModelContent.sortColumn = sort.active;
        this.filteModelContent.sortType = EnumSortType.Descending;
      } else if (this.tableSource.sort.start === "desc") {
        sort.start = 'asc';
        this.filteModelContent.sortColumn = "";
        this.filteModelContent.sortType = EnumSortType.Ascending;
      } else {
        sort.start = "desc";
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
      this.categoryModelSelected == null &&
      this.categoryModelSelected &&
      this.categoryModelSelected.id &&
      this.categoryModelSelected.id.length === 0 &&
      (this.requestLinkPropertyTypeLanduseId == null ||
        this.requestLinkPropertyTypeLanduseId.length === 0)
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
    let parentId: string = this.requestLinkPropertyTypeLanduseId;
    if (
      this.categoryModelSelected &&
      this.categoryModelSelected.id.length > 0
    ) {
      parentId = this.categoryModelSelected.id;
    }
    if (parentId && parentId.length > 0) {
      this.router.navigate([
        "/estate/property/add/LinkPropertyTypeLanduseId",
        parentId,
      ]);
    } else {
      this.router.navigate(["/estate/property/add"]);
    }
  }

  onActionSelectorSelect(model: EstatePropertyTypeLanduseModel | null): void {
    /*filter */
    var sortColumn = this.filteModelContent.sortColumn;
    var sortType = this.filteModelContent.sortType;
    this.filteModelContent = new FilterModel();
    this.filteModelContent.sortColumn = sortColumn;
    this.filteModelContent.sortType = sortType;
    /*filter */
    this.categoryModelSelected = model;

    this.DataGetAll();
  }

  onActionbuttonEditRow(
    mode: EstatePropertyModel = this.tableRowSelected, event?: MouseEvent
  ): void {
    if (!mode || !mode.id || mode.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = mode;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessEditRow
    ) {
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }
    if (event?.ctrlKey) {
      this.link = "/#/estate/property/edit/" + this.tableRowSelected.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(["/estate/property/edit", this.tableRowSelected.id]);
    }
  }

  onActionbuttonQuickViewRow(model: EstatePropertyModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorAccessWatch();
      return;
    }
    const dialogRef = this.dialog.open(EstatePropertyQuickViewComponent, {
      height: '90%',
      data: { id: this.tableRowSelected.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
      }
    });
  }

  onActionbuttonAdsRow(
    mode: EstatePropertyModel = this.tableRowSelected, event?: MouseEvent
  ): void {
    if (!mode || !mode.id || mode.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = mode;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessEditRow
    ) {
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }

    if (event?.ctrlKey) {
      this.link = "/#/estate/property-ads/LinkPropertyId/" + this.tableRowSelected.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(["/estate/property-ads/LinkPropertyId", this.tableRowSelected.id]);
    }
  }
  onActionbuttonHistoryRow(
    mode: EstatePropertyModel = this.tableRowSelected, event?: MouseEvent
  ): void {
    if (!mode || !mode.id || mode.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = mode;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessEditRow
    ) {
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }

    if (event?.ctrlKey) {
      this.link = "/#/estate/property-history/LinkPropertyId/" + this.tableRowSelected.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(["/estate/property-history/LinkPropertyId", this.tableRowSelected.id]);
    }
  }

  onActionbuttonDeleteRow(
    mode: EstatePropertyModel = this.tableRowSelected
  ): void {

    if (mode == null || !mode.id || mode.id.length === 0) {
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
    var message = this.translate.instant('MESSAGE.Do_you_want_to_delete_this_content');
    message += "?" + "<br> ( " + this.tableRowSelected.title + " ) ";
    this.cmsConfirmationDialogService
      .confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          const pName = this.constructor.name + "main";
          this.loading.Start(pName, this.translate.instant('MESSAGE.Deleting_information'));
          this.contentService
            .ServiceDelete(this.tableRowSelected.id)
            .subscribe({
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
            });
        }
      })
      .catch(() => {
        // console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
      });
  }
  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set("Active", 0);
    statist.set("All", 0);
    this.contentService
      .ServiceGetCount(this.filteModelContent)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            statist.set("All", ret.totalRowCount);
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
    fastfilter.propertyName = "RecordStatus";
    fastfilter.value = EnumRecordStatus.Available;
    filterStatist1.filters.push(fastfilter);
    this.contentService.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          statist.set("Active", ret.totalRowCount);
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
  onActionbuttonActionSendSmsToCustomerOrder(model: EstatePropertyModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    const pName = this.constructor.name + "main";
    this.loading.Start(pName, this.translate.instant('ACTION.ActionSendSmsToCustomerOrder'));
    // ** */
    this.contentService
      .ServiceActionSendSmsToCustomerOrder(model.id)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.cmsToastrService.typeSuccessMessage(ret.errorMessage);
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
    // ** */
  }
  onActionbuttonViewOtherUserAdvertise(model: EstatePropertyModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.requestLinkUserId = model.linkCmsUserId;
    if (this.requestLinkUserId && this.requestLinkUserId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = "linkCmsUserId";
      filter.value = this.requestLinkUserId;
      this.filteModelContent.filters.push(filter);
    }
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
  onActionButtonPrintEntity(model: EstatePropertyModel = this.tableRowSelected): void {
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
  onActionbuttonInChecking(model: boolean): void {
    this.searchInChecking = model;
    this.DataGetAll();
  }


  onActionbuttonReload(): void {
    this.optionloadComponent = true;
    this.DataGetAll();
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: EstatePropertyModel): void {
    this.tableRowSelected = row;

    if (!row["expanded"])
      row["expanded"] = false;
    row["expanded"] = !row["expanded"]
  }
  onActionTableRowMouseEnter(row: EstatePropertyModel): void {
    this.tableRowSelected = row;
    row["expanded"] = true;
  }
  onActionTableRowMouseLeave(row: EstatePropertyModel): void {
    row["expanded"] = false;
  }
  onActionBackToParent(): void {
    this.router.navigate(["/ticketing/departemen/"]);
  }
  onActionbuttonLinkTo(
    model: EstatePropertyModel = this.tableRowSelected
  ): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    if (model.recordStatus != EnumRecordStatus.Available) {
      this.cmsToastrService.typeWarningRecordStatusNoAvailable();
      return;
    }
    this.tableRowSelected = model;


    const pName = this.constructor.name + "ServiceGetOneById";
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_state_information'));
    this.contentService.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
    this.contentService
      .ServiceGetOneById(this.tableRowSelected.id)
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
  expandedElement: any;



  onActionGridExpandRows(flag: boolean) {
    this.tableSource.data.forEach(row => {
      row['expanded'] = flag;
    })
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
