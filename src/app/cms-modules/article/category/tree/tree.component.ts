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
  ArticleCategoryModel,
  ArticleCategoryService,
  NtkCmsApiStoreService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ArticleCategoryEditComponent } from '../edit/edit.component';
import { ArticleCategoryDeleteComponent } from '../delete/delete.component';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Subscription } from 'rxjs';
import { ArticleCategoryAddComponent } from '../add/add.component';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-article-category-tree',
  templateUrl: './tree.component.html',
})
export class ArticleCategoryTreeComponent implements OnInit, OnDestroy {
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: ArticleCategoryService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
  }
  @Input() set optionSelectForce(x: number | ArticleCategoryModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: ArticleCategoryModel = new ArticleCategoryModel();
  dataModelResult: ErrorExceptionResult<ArticleCategoryModel> = new ErrorExceptionResult<ArticleCategoryModel>();
  filteModel = new FilterModel();
  @Input() loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<ArticleCategoryModel>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<ArticleCategoryModel>();
  @Output() optionChange = new EventEmitter<ArticleCategoryModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionReload();
  hasChild = (_: number, node: ArticleCategoryModel) => !!node.Children && node.Children.length > 0;
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
  onActionSelect(model: ArticleCategoryModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
    // if (this.optionsData) {
    //   this.optionsData.data.Select = this.dataModelSelect;
    //   if (this.optionsData.parentMethods && this.optionsData.parentMethods.onActionSelect) {
    //     this.optionsData.parentMethods.onActionSelect(this.dataModelSelect);
    //   }
    // }
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new ArticleCategoryModel();
    // this.optionsData.data.Select = new ArticleCategoryModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | ArticleCategoryModel): void {
  }
  onActionAdd(): void {
    let parentId = 0;
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      parentId = this.dataModelSelect.Id;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { parentId };
    const dialogRef = this.dialog.open(ArticleCategoryAddComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
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
    const dialogRef = this.dialog.open(ArticleCategoryEditComponent, {
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
    // this.categoryService.ServiceDelete(this.getNodeOfId.id).subscribe((res) => {
    //   if (res.IsSuccess) {
    //   }
    // });
    let id = 0;
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      id = this.dataModelSelect.Id;
    }
    if (id === 0) {
      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorCategoryNotSelected');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    const dialogRef = this.dialog.open(ArticleCategoryDeleteComponent, {
      data: { id }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

}