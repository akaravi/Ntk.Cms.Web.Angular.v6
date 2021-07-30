import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {
  CoreEnumService,
  EnumClauseType,
  EnumFilterDataModelSearchTypes,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  HyperShopCategoryModel,
  HyperShopCategoryService
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';


@Component({
  selector: 'app-hypershop-category-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class HyperShopCategorySelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: HyperShopCategoryService) {


  }
  dataModelResult: ErrorExceptionResult<HyperShopCategoryModel> = new ErrorExceptionResult<HyperShopCategoryModel>();
  dataModelSelect: HyperShopCategoryModel = new HyperShopCategoryModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<HyperShopCategoryModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = new EventEmitter<string>();
  @Output() optionSelect = new EventEmitter<HyperShopCategoryModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: string | HyperShopCategoryModel) {
    this.onActionSelectForce(x);
  }

ngOnInit(): void {
    this.loadOptions();
  }
  loadOptions(): void {
    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(val => {
          if (typeof val === 'string' || typeof val === 'number') {
            return this.DataGetAll(val || '');
          }
          return [];
        }),
        // tap(() => this.myControl.setValue(this.options[0]))
      );
  }

  displayFn(model?: HyperShopCategoryModel): string | undefined {
    return model ? model.Name + ' # ' + model.Code : undefined;
  }
  displayOption(model?: HyperShopCategoryModel): string | undefined {
    return model ? model.Name + ' # ' + model.Code : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<HyperShopCategoryModel[]> {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    // this.loading.backdropEnabled = false;
    let filter = new FilterDataModel();
    filter.PropertyName = 'Name';
    filter.Value = text;
    filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
    filteModel.Filters.push(filter);
    /* */
    filter = new FilterDataModel();
    filter.PropertyName = 'Code';
    filter.Value = text;
    filter.SearchType = EnumFilterDataModelSearchTypes.Equal;
    filter.ClauseType = EnumClauseType.Or;
    filteModel.Filters.push(filter);

    this.loading.Globally = false;
    this.loading.display = true;
    return await this.categoryService.ServiceGetAll(filteModel)
      .pipe(
        map(response => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.Code || this.dataModelSelect.Code.length === 0) &&
            this.dataModelResult.ListItems.length > 0) {
            this.optionSelectFirstItem = false;
            setTimeout(() => { this.formControl.setValue(this.dataModelResult.ListItems[0]); }, 1000);
          }
          /*select First Item */
          return response.ListItems;
        })
      ).toPromise();
  }
  onActionSelect(model: HyperShopCategoryModel): void {
    if(this.optionDisabled)
    {
      return;
    }
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
  }
  onActionSelectClear(): void {
    if(this.optionDisabled)
    {
      return;
    }
    this.formControl.setValue(null);
    this.optionSelect.emit(null);
  }

  push(newvalue: HyperShopCategoryModel): Observable<HyperShopCategoryModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Code === newvalue.Code)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | HyperShopCategoryModel): void {
    if (typeof id === 'string' && id.length > 0) {
      if (this.dataModelSelect && this.dataModelSelect.Code === id) {
        return;
      }
      if (this.dataModelResult && this.dataModelResult.ListItems && this.dataModelResult.ListItems.find(x => x.Code === id)) {
        const item = this.dataModelResult.ListItems.find(x => x.Code === id);
        this.dataModelSelect = item;
        this.formControl.setValue(item);
        return;
      }
      this.categoryService.ServiceGetOneById(id).subscribe((next) => {
        if (next.IsSuccess) {
          this.filteredOptions = this.push(next.Item);
          this.dataModelSelect = next.Item;
          this.formControl.setValue(next.Item);
          this.optionSelect.emit(next.Item);
        }
      });
      return;
    }
    if (typeof id === typeof HyperShopCategoryModel) {
      this.filteredOptions = this.push((id as HyperShopCategoryModel));
      this.dataModelSelect = (id as HyperShopCategoryModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new HyperShopCategoryModel();
    // this.optionsData.Select = new HyperShopCategoryModel();
    this.DataGetAll(null);
  }
}
