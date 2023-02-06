
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CoreUserClaimCheckDtoModel, CoreUserClaimCheckModel, CoreUserClaimContentModel,
  CoreUserClaimContentService, CoreUserClaimTypeModel,
  CoreUserClaimTypeService, DataFieldInfoModel, ErrorExceptionResult,
  FilterModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchModel';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CoreUserClaimContentAddComponent } from '../add/add.component';
import { CoreUserClaimContentEditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-core-userclaimcontent-checklist',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.scss']
})
export class CoreUserClaimContentCheckListComponent implements OnInit, OnDestroy {

  requestLinkUserId = 0;
  requestLinkSiteId = 0;
  constructor(
    private coreUserClaimContentService: CoreUserClaimContentService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private coreUserClaimTypeService: CoreUserClaimTypeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public dialog: MatDialog
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.requestLinkUserId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserId'));
    this.requestLinkSiteId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkSiteId'));

  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  dataModelResult: ErrorExceptionResult<CoreUserClaimCheckModel> = new ErrorExceptionResult<CoreUserClaimCheckModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();

  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowSelected: CoreUserClaimCheckModel = new CoreUserClaimCheckModel();
  tableSource: MatTableDataSource<CoreUserClaimCheckModel> = new MatTableDataSource<CoreUserClaimCheckModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  categoryModelSelected: CoreUserClaimTypeModel = new CoreUserClaimTypeModel();
  dataModelCoreUserClaimTypeResult: ErrorExceptionResult<CoreUserClaimTypeModel> = new ErrorExceptionResult<CoreUserClaimTypeModel>();

  tabledisplayedColumns: string[] = [
    'TypeTitle',
    'IsApproved',
    'ApprovedResult',
    'ApproveCheckDate',
    'ApprovedExpireDate',
    'Action'
  ];



  expandedElement: CoreUserClaimContentModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.DataGetAll();
    });
    this.getUserClaimType();
  }
  getUserClaimType(): void {
    const filter = new FilterModel();
    filter.rowPerPage = 100;
    this.coreUserClaimTypeService.ServiceGetAll(filter).subscribe((next) => {
      this.dataModelCoreUserClaimTypeResult = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowSelected = new CoreUserClaimCheckModel();
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);



    if (this.requestLinkUserId > 0 && this.requestLinkSiteId > 0) {
      /** */
      const model = new CoreUserClaimCheckDtoModel();
      model.userId = this.requestLinkUserId;
      model.siteId = this.requestLinkSiteId;
      this.coreUserClaimContentService.setAccessLoad();
      this.coreUserClaimContentService.ServiceClaimCheck(model).subscribe({
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
      /** */
    }
    else {
      /** */
      this.coreUserClaimContentService.setAccessLoad();
      this.coreUserClaimContentService.ServiceClaimCheckCurrent().subscribe({
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
      /** */
    }

  }

  onActionbuttonNewRow(): void {

    const dialogRef = this.dialog.open(CoreUserClaimContentAddComponent, {
      height: '90%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonEditRow(model: CoreUserClaimCheckModel = this.tableRowSelected): void {
    if (!model || !model.linkTypeId || model.linkTypeId === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;
    if (model.linkContentId && model.linkContentId > 0) {
      const dialogRef = this.dialog.open(CoreUserClaimContentEditComponent, {
        height: '90%',
        data: { id: this.tableRowSelected.linkContentId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.dialogChangedDate) {
          this.DataGetAll();
        }
      });
    } else {
      const dialogRef = this.dialog.open(CoreUserClaimContentAddComponent, {
        height: '90%',
        data: { linkUserClaimTypeId: this.tableRowSelected.linkTypeId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.dialogChangedDate) {
          this.DataGetAll();
        }
      });
    }
  }



  onActionbuttonReload(): void {
    this.DataGetAll();
  }

  onActionTableRowSelect(row: CoreUserClaimCheckModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/core/user/']);
  }
}
