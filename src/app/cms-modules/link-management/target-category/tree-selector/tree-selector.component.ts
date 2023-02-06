
import { SelectionModel } from '@angular/cdk/collections';
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
import { MatDialog } from '@angular/material/dialog';
import {
  MatTreeNestedDataSource
} from '@angular/material/tree';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterModel,
  LinkManagementTargetCategoryModel,
  LinkManagementTargetCategoryService
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-linkmanagement-target-category-treeselector',
  templateUrl: './tree-selector.component.html',
  styleUrls: ['./tree-selector.component.scss'],
})
export class LinkManagementTargetCategoryTreeSelectorComponent implements OnInit, OnDestroy {
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: LinkManagementTargetCategoryService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
    public dialog: MatDialog,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.checklistSelection.changed.subscribe(x => {
      if (!this.runComplate) {
        return;
      }
      const listId = [];
      this.checklistSelection.selected.forEach(element => {
        listId.push(element.id);
      });
      this.optionModelChange.emit(listId);
      if (x.added && x.added.length > 0) {
        x.added.forEach(element => {
          this.optionSelectChecked.emit(element.id);
        });
      }
      if (x.removed && x.removed.length > 0) {
        x.removed.forEach(element => {
          this.optionSelectDisChecked.emit(element.id);
        });
      }
    });
  }
  @Input()
  set optionModel(model: number[]) {
    this.dataModelSelect = model;
    this.loadCheked();
  }

  dataModelSelect: number[] = [];
  dataModelResult: ErrorExceptionResult<LinkManagementTargetCategoryModel> = new ErrorExceptionResult<LinkManagementTargetCategoryModel>();
  filterModel = new FilterModel();
  loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<LinkManagementTargetCategoryModel>(node => node.children);
  dataSource = new MatTreeNestedDataSource<LinkManagementTargetCategoryModel>();
  runComplate = false;
  @Output() optionSelectChecked = new EventEmitter<number>();
  @Output() optionSelectDisChecked = new EventEmitter<number>();
  @Output() optionModelChange = new EventEmitter<number[]>();
  cmsApiStoreSubscribe: Subscription;

  checklistSelection = new SelectionModel<LinkManagementTargetCategoryModel>(true /* multiple */);


  hasChild = (_: number, node: LinkManagementTargetCategoryModel) => !!node.children && node.children.length > 0;
  hasNoContent = (_: number, nodeData: LinkManagementTargetCategoryModel) => nodeData.children;


  ngOnInit(): void {
    this.DataGetAll();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.DataGetAll();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  loadCheked(model: LinkManagementTargetCategoryModel[] = this.treeControl.dataNodes): void {
    this.runComplate = false;
    if (this.treeControl.dataNodes && this.dataModelSelect && this.dataModelSelect.length > 0) {
      model.forEach(element => {
        const fItem = this.dataModelSelect.find(z => z === element.id);
        if (fItem) {
          this.checklistSelection.select(element);
          // const descendants = this.treeControl.getDescendants(element);
          // this.checklistSelection.select(...descendants);
          // this.todoItemSelectionToggle(element);
          // this.treeControl.expand(element);
        }
        if (element.children && element.children.length > 0) {
          this.loadCheked(element.children);
        }
      });
    }
    this.runComplate = true;
  }
  DataGetAll(): void {
    this.filterModel.rowPerPage = 200;
    this.filterModel.accessLoad = true;

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.categoryService.ServiceGetAll(this.filterModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.dataSource.data = this.dataModelResult.listItems;
          this.treeControl.dataNodes = this.dataModelResult.listItems;
          this.loadCheked();
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.loading.Stop(pName);

        this.cmsToastrService.typeError(er);
      }
    }
    );
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: LinkManagementTargetCategoryModel): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }
  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: LinkManagementTargetCategoryModel): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }
  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: LinkManagementTargetCategoryModel): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

  }


}
