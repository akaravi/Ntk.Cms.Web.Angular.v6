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
  CoreAuthService,
  CoreEnumService,
  ErrorExceptionResult,
  FilterModel,
  LinkManagementTargetCategoryModel,
  LinkManagementTargetCategoryService,
  NtkCmsApiStoreService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LinkManagementTargetCategoryEditComponent } from '../edit/edit.component';
import { LinkManagementTargetCategoryDeleteComponent } from '../delete/delete.component';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Subscription } from 'rxjs';
import { LinkManagementTargetCategoryAddComponent } from '../add/add.component';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-linkmanagement-target-category-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class LinkManagementTargetCategoryTreeComponent implements OnInit, OnDestroy {
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: LinkManagementTargetCategoryService,
    public dialog: MatDialog,
    private tokenHelper: TokenHelper,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loading.cdr = this.cdr;
  }
  @Input() set optionSelectForce(x: number | LinkManagementTargetCategoryModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: LinkManagementTargetCategoryModel = new LinkManagementTargetCategoryModel();
  dataModelResult: ErrorExceptionResult<LinkManagementTargetCategoryModel> = new ErrorExceptionResult<LinkManagementTargetCategoryModel>();
  filteModel = new FilterModel();
  @Input() loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<LinkManagementTargetCategoryModel>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<LinkManagementTargetCategoryModel>();
  @Output() optionChange = new EventEmitter<LinkManagementTargetCategoryModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionReload();

  hasChild = (_: number, node: LinkManagementTargetCategoryModel) => !!node.Children && node.Children.length > 0;


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
  onActionSelect(model: LinkManagementTargetCategoryModel): void {
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
    this.dataModelSelect = new LinkManagementTargetCategoryModel();
    // this.optionsData.data.Select = new LinkManagementTargetCategoryModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | LinkManagementTargetCategoryModel): void {

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


    const dialogRef = this.dialog.open(LinkManagementTargetCategoryAddComponent, dialogConfig);
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
    const dialogRef = this.dialog.open(LinkManagementTargetCategoryEditComponent, {
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
    const dialogRef = this.dialog.open(LinkManagementTargetCategoryDeleteComponent, {
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

}
