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
  ArticleCategoryModel,
  ArticleCategoryService,
  NtkCmsApiStoreService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-article-category-treeselector',
  templateUrl: './tree-selector.component.html',
  styleUrls: ['./tree-selector.component.scss'],
})
export class ArticleCategoryTreeSelectorComponent implements OnInit, OnDestroy {
  constructor(
    private cmsApiStore: NtkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: ArticleCategoryService,
    public dialog: MatDialog,
  ) {
    //
    this.checklistSelection.changed.subscribe(x => {
      if (!this.runComplate) {
        return;
      }
      const listId = [];
      this.checklistSelection.selected.forEach(element => {
        listId.push(element.Id);
      });
      this.optionModelChange.emit(listId);
      if (x.added && x.added.length > 0) {
        x.added.forEach(element => {
          this.optionSelectChecked.emit(element.Id);
        });
      }
      if (x.removed && x.removed.length > 0) {
        x.removed.forEach(element => {
          this.optionSelectDisChecked.emit(element.Id);
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
  dataModelResult: ErrorExceptionResult<ArticleCategoryModel> = new ErrorExceptionResult<ArticleCategoryModel>();
  filteModel = new FilterModel();
  loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<ArticleCategoryModel>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<ArticleCategoryModel>();
  runComplate = false;
  @Output() optionSelectChecked = new EventEmitter<number>();
  @Output() optionSelectDisChecked = new EventEmitter<number>();
  @Output() optionModelChange = new EventEmitter<number[]>();
  cmsApiStoreSubscribe: Subscription;

  checklistSelection = new SelectionModel<ArticleCategoryModel>(true /* multiple */);


  hasChild = (_: number, node: ArticleCategoryModel) => !!node.Children && node.Children.length > 0;
  hasNoContent = (_: number, _nodeData: ArticleCategoryModel) => _nodeData.Children;


  ngOnInit(): void {
    this.DataGetAll();
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe(() => {
      this.DataGetAll();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  loadCheked(model: ArticleCategoryModel[] = this.treeControl.dataNodes): void {
    this.runComplate = false;
    if (this.treeControl.dataNodes && this.dataModelSelect && this.dataModelSelect.length > 0) {
      model.forEach(element => {
        const fItem = this.dataModelSelect.find(z => z === element.Id);
        if (fItem) {
          this.checklistSelection.select(element);
          // const descendants = this.treeControl.getDescendants(element);
          // this.checklistSelection.select(...descendants);
          // this.todoItemSelectionToggle(element);
          // this.treeControl.expand(element);
        }
        if (element.Children && element.Children.length > 0) {
          this.loadCheked(element.Children);
        }
      });
    }
    this.runComplate = true;
  }
  DataGetAll(): void {
    this.filteModel.RowPerPage = 200;
    this.filteModel.AccessLoad = true;
    this.loading.Globally = false;
    this.loading.Start('main');
    this.cdr.detectChanges();
    this.categoryService.ServiceGetAll(this.filteModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.dataSource.data = this.dataModelResult.ListItems;
          this.treeControl.dataNodes = this.dataModelResult.ListItems;
          this.loadCheked();
        }
        this.loading.Stop('main');
    this.cdr.detectChanges();
      },
      (error) => {
        this.loading.Stop('main');
    this.cdr.detectChanges();
        this.cmsToastrService.typeError(error);
      }
    );
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: ArticleCategoryModel): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }
  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ArticleCategoryModel): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }
  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: ArticleCategoryModel): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

  }


}
