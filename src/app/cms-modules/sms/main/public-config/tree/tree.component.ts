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
  SmsMainApiPathPublicConfigModel,
  SmsMainApiPathPublicConfigService,
  NtkCmsApiStoreService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SmsMainApiPathPublicConfigEditComponent } from '../edit/edit.component';
import { SmsMainApiPathPublicConfigAddComponent } from '../add/add.component';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';


@Component({
  selector: 'app-sms-publicconfig-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class SmsMainApiPathPublicConfigTreeComponent implements OnInit, OnDestroy {
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: SmsMainApiPathPublicConfigService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    public dialog: MatDialog
  ) {
    this.loading.cdr = this.cdr;
  }
  @Input() set optionSelectForce(x: string | SmsMainApiPathPublicConfigModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: SmsMainApiPathPublicConfigModel = new SmsMainApiPathPublicConfigModel();
  dataModelResult: ErrorExceptionResult<SmsMainApiPathPublicConfigModel> = new ErrorExceptionResult<SmsMainApiPathPublicConfigModel>();
  filteModel = new FilterModel();
  @Input()loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<SmsMainApiPathPublicConfigModel>(node => null);
  dataSource = new MatTreeNestedDataSource<SmsMainApiPathPublicConfigModel>();
  @Output() optionChange = new EventEmitter<SmsMainApiPathPublicConfigModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionReload();

  hasChild = (_: string, node: SmsMainApiPathPublicConfigModel) => false;


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
  onActionSelect(model: SmsMainApiPathPublicConfigModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect.Id.length > 0) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new SmsMainApiPathPublicConfigModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: string | SmsMainApiPathPublicConfigModel): void {

  }

  onActionAdd(): void {
    const dialogRef = this.dialog.open(SmsMainApiPathPublicConfigAddComponent, {
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
    let id = '';
    if (this.dataModelSelect && this.dataModelSelect.Id.length > 0) {
      id = this.dataModelSelect.Id;
    }
    if (id.length === 0) {
      const message = 'دسته بندی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    const dialogRef = this.dialog.open(SmsMainApiPathPublicConfigEditComponent, {
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