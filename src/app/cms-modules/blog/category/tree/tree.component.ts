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
  BlogCategoryModel,
  BlogCategoryService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BlogCategoryEditComponent } from '../edit/edit.component';
import { BlogCategoryDeleteComponent } from '../delete/delete.component';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Subscription } from 'rxjs';
import { BlogCategoryAddComponent } from '../add/add.component';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-blog-category-tree',
  templateUrl: './tree.component.html',
})
export class BlogCategoryTreeComponent implements OnInit, OnDestroy {
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: BlogCategoryService,
    public dialog: MatDialog,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  @Input() set optionSelectForce(x: number | BlogCategoryModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: BlogCategoryModel = new BlogCategoryModel();
  dataModelResult: ErrorExceptionResult<BlogCategoryModel> = new ErrorExceptionResult<BlogCategoryModel>();
  filteModel = new FilterModel();
  @Input() loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<BlogCategoryModel>(node => node.children);
  dataSource = new MatTreeNestedDataSource<BlogCategoryModel>();
  @Output() optionChange = new EventEmitter<BlogCategoryModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionReload();

  hasChild = (_: number, node: BlogCategoryModel) => !!node.children && node.children.length > 0;


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
    this.filteModel.rowPerPage = 200;
    this.filteModel.accessLoad = true;

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.categoryService.ServiceGetAll(this.filteModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.dataSource.data = this.dataModelResult.listItems;
        } else {
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
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
  onActionSelect(model: BlogCategoryModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect.id > 0) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new BlogCategoryModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | BlogCategoryModel): void {

  }

  onActionAdd(): void {
    let parentId = 0;
    if (this.dataModelSelect && this.dataModelSelect.id > 0) {
      parentId = this.dataModelSelect.id;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { parentId };


    const dialogRef = this.dialog.open(BlogCategoryAddComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
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
    const dialogRef = this.dialog.open(BlogCategoryEditComponent, {
      height: '90%',
      data: { id }
    });
    dialogRef.afterClosed().subscribe(result => {
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
    const dialogRef = this.dialog.open(BlogCategoryDeleteComponent, {
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
