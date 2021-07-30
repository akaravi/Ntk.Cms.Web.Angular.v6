import {
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
  CoreModuleSaleHeaderModel,
  CoreModuleSaleHeaderService,
  NtkCmsApiStoreService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CoreModuleSaleHeaderEditComponent } from '../edit/edit.component';
import { CoreModuleSaleHeaderAddComponent } from '../add/add.component';


@Component({
  selector: 'app-core-modulesaleheader-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class CoreModuleSaleHeaderTreeComponent implements OnInit, OnDestroy {
  constructor(
    private cmsApiStore: NtkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: CoreModuleSaleHeaderService,
    private router: Router,
    public dialog: MatDialog
  ) {
  }
  @Input() set optionSelectForce(x: number | CoreModuleSaleHeaderModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: CoreModuleSaleHeaderModel = new CoreModuleSaleHeaderModel();
  dataModelResult: ErrorExceptionResult<CoreModuleSaleHeaderModel> = new ErrorExceptionResult<CoreModuleSaleHeaderModel>();
  filteModel = new FilterModel();
  loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<CoreModuleSaleHeaderModel>(node => null);
  dataSource = new MatTreeNestedDataSource<CoreModuleSaleHeaderModel>();
  @Output() optionSelect = new EventEmitter<CoreModuleSaleHeaderModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionReload();

  hasChild = (_: number, node: CoreModuleSaleHeaderModel) => false;


  ngOnInit(): void {
    this.DataGetAll();
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe(() => {
      this.DataGetAll();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.filteModel.RowPerPage = 200;
    this.filteModel.AccessLoad = true;
    this.loading.Globally = false;
    this.loading.display = true;
    this.categoryService.ServiceGetAll(this.filteModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.dataSource.data = this.dataModelResult.ListItems;
        }
        this.loading.display = false;

      },
      (error) => {
        this.loading.display = false;

        this.cmsToastrService.typeError(error);

      }
    );
  }
  onActionSelect(model: CoreModuleSaleHeaderModel): void {
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
    this.dataModelSelect = new CoreModuleSaleHeaderModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | CoreModuleSaleHeaderModel): void {

  }

  onActionAdd(): void {
    const dialogRef = this.dialog.open(CoreModuleSaleHeaderAddComponent, {
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
    const dialogRef = this.dialog.open(CoreModuleSaleHeaderEditComponent, {
      data: { id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
}
