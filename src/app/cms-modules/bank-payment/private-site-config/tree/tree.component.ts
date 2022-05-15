//**msh */
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import {
  MatTreeNestedDataSource,
} from '@angular/material/tree';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterModel,
  BankPaymentPrivateSiteConfigModel,
  BankPaymentPrivateSiteConfigService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BankPaymentPrivateSiteConfigEditComponent } from '../edit/edit.component';
import { BankPaymentPrivateSiteConfigAddComponent } from '../add/add.component';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-bankpayment-privatesiteconfig-tree',
  templateUrl: './tree.component.html',
})
export class BankPaymentPrivateSiteConfigTreeComponent implements OnInit, OnDestroy {
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: BankPaymentPrivateSiteConfigService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
    public dialog: MatDialog
  ) {
    this.loading.cdr = this.cdr;
  }
  @Input() set optionSelectForce(x: number | BankPaymentPrivateSiteConfigModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: BankPaymentPrivateSiteConfigModel = new BankPaymentPrivateSiteConfigModel();
  dataModelResult: ErrorExceptionResult<BankPaymentPrivateSiteConfigModel> = new ErrorExceptionResult<BankPaymentPrivateSiteConfigModel>();
  filteModel = new FilterModel();
  @Input() loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<BankPaymentPrivateSiteConfigModel>(node => null);
  dataSource = new MatTreeNestedDataSource<BankPaymentPrivateSiteConfigModel>();
  @Output() optionChange = new EventEmitter<BankPaymentPrivateSiteConfigModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionReload();
  hasChild = (_: number, node: BankPaymentPrivateSiteConfigModel) => false;
  ngOnInit(): void {
    this.DataGetAll();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.DataGetAll();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.filteModel.RowPerPage = 200;
    this.filteModel.AccessLoad = true;
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.categoryService.ServiceGetAll(this.filteModel).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.dataModelResult = ret;
          this.dataSource.data = this.dataModelResult.ListItems;
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
  onActionSelect(model: BankPaymentPrivateSiteConfigModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new BankPaymentPrivateSiteConfigModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | BankPaymentPrivateSiteConfigModel): void {
  }
  onActionAdd(): void {
    const dialogRef = this.dialog.open(BankPaymentPrivateSiteConfigAddComponent, {
      height: '90%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionEdit(): void {
    let id = 0;
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      id = this.dataModelSelect.Id;
    }
    if (id === 0) {
      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorCategoryNotSelected');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    const dialogRef = this.dialog.open(BankPaymentPrivateSiteConfigEditComponent, {
      height: '90%',
      data: { id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
}