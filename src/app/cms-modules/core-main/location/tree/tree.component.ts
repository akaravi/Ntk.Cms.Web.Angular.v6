
import { NestedTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  MatTreeNestedDataSource
} from '@angular/material/tree';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreLocationModel,
  CoreLocationService, ErrorExceptionResult, FilterDataModel, FilterModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CoreLocationAddComponent } from '../add/add.component';
import { CoreLocationEditComponent } from '../edit/edit.component';


@Component({
  selector: 'app-core-location-tree',
  templateUrl: './tree.component.html',
})
export class CoreLocationTreeComponent implements OnInit, OnDestroy {
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: CoreLocationService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  @Input() set optionSelectForce(x: number | CoreLocationModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: CoreLocationModel = new CoreLocationModel();
  dataModelResult: ErrorExceptionResult<CoreLocationModel> = new ErrorExceptionResult<CoreLocationModel>();
  filterModel = new FilterModel();
  @Input() loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<CoreLocationModel>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CoreLocationModel>();
  @Output() optionChange = new EventEmitter<CoreLocationModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionReload();

  hasChild = (_: number, node: CoreLocationModel) => !!node.children && node.children.length > 0;


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
    this.filterModel.rowPerPage = 200;
    this.filterModel.accessLoad = true;

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.categoryService.ServiceGetAllTree(this.filterModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.dataSource.data = this.dataModelResult.listItems;
          this.cdr.detectChanges();
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
  DataGetAllChild(parentModel: CoreLocationModel): void {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 200;
    filterModel.accessLoad = true;
    const filter = new FilterDataModel();
    filter.propertyName = 'LinkParentId';
    filter.value = parentModel.id;
    filterModel.filters.push(filter);

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.categoryService.ServiceGetAllTree(filterModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          parentModel.children = ret.listItems;
          this.dataSource.data = null;
          this.dataSource.data = this.dataModelResult.listItems;
          this.cdr.detectChanges();
          this.loading.Stop(pName);
          return;

        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        return;
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
        return;
      }
    }
    );
  }
  onActionSelect(model: CoreLocationModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
    if (this.dataModelSelect && this.dataModelSelect.id > 0 && (this.dataModelSelect.children == null || this.dataModelSelect.children?.length == 0)) {
      this.DataGetAllChild(this.dataModelSelect)
    }
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect.id > 0) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new CoreLocationModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | CoreLocationModel): void {

  }

  onActionAdd(): void {
    let parentId = 0;
    if (this.dataModelSelect && this.dataModelSelect.id > 0) {
      parentId = this.dataModelSelect.id;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { id: parentId };


    const dialogRef = this.dialog.open(CoreLocationAddComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionEdit(): void {
    let id = 0;
    if (this.dataModelSelect && this.dataModelSelect.id > 0) {
      id = this.dataModelSelect.id;
    }
    if (id === 0) {
      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorCategoryNotSelected');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    const dialogRef = this.dialog.open(CoreLocationEditComponent, {
      height: '90%',
      data: { id }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionDelete(): void {

    let id = 0;
    if (this.dataModelSelect && this.dataModelSelect.id > 0) {
      id = this.dataModelSelect.id;
    }
    if (id === 0) {
      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorCategoryNotSelected');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }

  }

}
