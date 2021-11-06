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
  BankPaymentPublicConfigModel,
  BankPaymentPublicConfigService,
  NtkCmsApiStoreService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BankPaymentPublicConfigEditComponent } from '../edit/edit.component';
import { BankPaymentPublicConfigAddComponent } from '../add/add.component';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';


@Component({
  selector: 'app-bankpayment-publicconfig-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class BankPaymentPublicConfigTreeComponent implements OnInit, OnDestroy {
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: BankPaymentPublicConfigService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    public dialog: MatDialog
  ) {
    this.loading.cdr = this.cdr;
  }
  @Input() set optionSelectForce(x: number | BankPaymentPublicConfigModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: BankPaymentPublicConfigModel = new BankPaymentPublicConfigModel();
  dataModelResult: ErrorExceptionResult<BankPaymentPublicConfigModel> = new ErrorExceptionResult<BankPaymentPublicConfigModel>();
  filteModel = new FilterModel();
  @Input()loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<BankPaymentPublicConfigModel>(node => null);
  dataSource = new MatTreeNestedDataSource<BankPaymentPublicConfigModel>();
  @Output() optionSelect = new EventEmitter<BankPaymentPublicConfigModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionReload();

  hasChild = (_: number, node: BankPaymentPublicConfigModel) => false;


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

    this.categoryService.ServiceGetAll(this.filteModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.dataSource.data = this.dataModelResult.ListItems;
        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);

      }
    );
  }
  onActionSelect(model: BankPaymentPublicConfigModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new BankPaymentPublicConfigModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | BankPaymentPublicConfigModel): void {

  }

  onActionAdd(): void {
    const dialogRef = this.dialog.open(BankPaymentPublicConfigAddComponent, {
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
      const message = 'دسته بندی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    const dialogRef = this.dialog.open(BankPaymentPublicConfigEditComponent, {
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
