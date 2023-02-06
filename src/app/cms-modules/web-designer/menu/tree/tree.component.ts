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
  CoreEnumService, EnumSortType, ErrorExceptionResult,
  FilterModel,
  WebDesignerMainMenuModel,
  WebDesignerMainMenuService
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { WebDesignerMainMenuAddComponent } from '../add/add.component';
import { WebDesignerMainMenuEditComponent } from '../edit/edit.component';
@Component({
  selector: 'app-webdesigner-menu-tree',
  templateUrl: './tree.component.html',
})
export class WebDesignerMainMenuTreeComponent implements OnInit, OnDestroy {
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: WebDesignerMainMenuService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.filterModel.sortColumn = 'ShowInMenuOrder';
    this.filterModel.sortType = EnumSortType.Ascending;
  }
  @Input() set optionSelectForce(x: number | WebDesignerMainMenuModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: WebDesignerMainMenuModel = new WebDesignerMainMenuModel();
  dataModelResult: ErrorExceptionResult<WebDesignerMainMenuModel> = new ErrorExceptionResult<WebDesignerMainMenuModel>();
  filterModel = new FilterModel();
  @Input() loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<WebDesignerMainMenuModel>(node => node.children);
  dataSource = new MatTreeNestedDataSource<WebDesignerMainMenuModel>();
  @Output() optionChange = new EventEmitter<WebDesignerMainMenuModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionReload();
  hasChild = (_: number, node: WebDesignerMainMenuModel) => !!node.children && node.children.length > 0;
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
    this.categoryService.ServiceGetAllTree(this.filterModel).subscribe(
      (next) => {
        if (next.isSuccess) {
          this.dataModelResult = next;
          this.dataSource.data = this.dataModelResult.listItems;
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
  }
  onActionSelect(model: WebDesignerMainMenuModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect?.id?.length > 0) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new WebDesignerMainMenuModel();
    // this.optionsData.data.Select = new WebDesignerMainMenuModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | WebDesignerMainMenuModel): void {
  }
  onActionAdd(): void {
    let parentId = '';
    if (this.dataModelSelect && this.dataModelSelect?.id?.length > 0) {
      parentId = this.dataModelSelect.id;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { parentId };
    const dialogRef = this.dialog.open(WebDesignerMainMenuAddComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionEdit(): void {
    let id = '';
    if (this.dataModelSelect && this.dataModelSelect?.id?.length > 0) {
      id = this.dataModelSelect.id;
    }
    if (id.length === 0) {
      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorCategoryNotSelected');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    const dialogRef = this.dialog.open(WebDesignerMainMenuEditComponent, {
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
    let id = '';
    if (this.dataModelSelect && this.dataModelSelect?.id?.length > 0) {
      id = this.dataModelSelect.id;
    }
    if (id.length === 0) {
      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorCategoryNotSelected');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
  }
}
