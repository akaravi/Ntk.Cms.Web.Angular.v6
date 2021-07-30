import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  BankPaymentPrivateSiteConfigModel,
  BankPaymentPrivateSiteConfigService,
  ApplicationSourceModel,
  EnumFilterDataModelSearchTypes,
  EnumClauseType
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';


@Component({
  selector: 'app-bankpayment-privatesiteconfig-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class BankPaymentPrivateSiteConfigSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: BankPaymentPrivateSiteConfigService) {


  }
  @Input() set optionSelectForce(x: number | BankPaymentPrivateSiteConfigModel) {
    this.onActionSelectForce(x);
  }
  @Input() set optionSelectParentForce(x: number) {
    this.onActionSelectParentForce(x);
  }
  dataModelResult: ErrorExceptionResult<BankPaymentPrivateSiteConfigModel> = new ErrorExceptionResult<BankPaymentPrivateSiteConfigModel>();
  dataModelSelect: BankPaymentPrivateSiteConfigModel = new BankPaymentPrivateSiteConfigModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<BankPaymentPrivateSiteConfigModel[]>;
  parentId = 0;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = new EventEmitter<string>();
  @Output() optionSelect = new EventEmitter<BankPaymentPrivateSiteConfigModel>();

  @Input() optionReload = () => this.onActionReload();
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

  displayFn(model?: BankPaymentPrivateSiteConfigModel): string | undefined {
    return model ? model.Title : undefined;
  }
  displayOption(model?: BankPaymentPrivateSiteConfigModel): string | undefined {
    return model ? model.Title : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<BankPaymentPrivateSiteConfigModel[]> {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    const filters = new Array<FilterDataModel>();
    let filter = new FilterDataModel();
    filter.PropertyName = 'Title';
    filter.Value = text;
    filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
    filter.ClauseType = EnumClauseType.Or;
    filteModel.Filters.push(filter);
    if (text && typeof +text === 'number' && +text > 0) {
      filter = new FilterDataModel();
      filter.PropertyName = 'Id';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Equal;
      filter.ClauseType = EnumClauseType.Or;
      filteModel.Filters.push(filter);
    }
    if (this.parentId > 0) {
      const parent = {
        PropertyName: 'LinkSourceId',
        Value: this.parentId.toString(),
        ClauseType: 2,
        SearchType: 0
      };
      filteModel.Filters.push(parent as FilterDataModel);
      const tree = {
        Filters: filters,
      };
      if (filters && filters.length > 0) {
        filteModel.Filters.push(tree as FilterDataModel);
      }
    }
    else if (filters && filters.length > 0) {
      filteModel.Filters = filters as FilterDataModel[];
    }
    this.loading.Globally = false;
    this.loading.display = true;
    return await this.categoryService.ServiceGetAll(filteModel)
      .pipe(
        map(response => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.Id || this.dataModelSelect.Id <= 0) &&
            this.dataModelResult.ListItems.length > 0) {
            this.optionSelectFirstItem = false;
            setTimeout(() => { this.formControl.setValue(this.dataModelResult.ListItems[0]); }, 1000);
          }
          /*select First Item */
          return response.ListItems;
        })
      ).toPromise();
  }
  onActionSelect(model: BankPaymentPrivateSiteConfigModel): void {
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

  push(newvalue: BankPaymentPrivateSiteConfigModel): Observable<BankPaymentPrivateSiteConfigModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | BankPaymentPrivateSiteConfigModel): void {
    if (typeof id === 'number' && id > 0) {
      if (this.dataModelSelect && this.dataModelSelect.Id === id) {
        return;
      }
      if (this.dataModelResult && this.dataModelResult.ListItems && this.dataModelResult.ListItems.find(x => x.Id === id)) {
        const item = this.dataModelResult.ListItems.find(x => x.Id === id);
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
    if (typeof id === typeof BankPaymentPrivateSiteConfigModel) {
      this.filteredOptions = this.push((id as BankPaymentPrivateSiteConfigModel));
      this.dataModelSelect = (id as BankPaymentPrivateSiteConfigModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }
  onActionSelectParentForce(id: number): void {
    const befor = this.parentId;
    this.parentId = 0;
    if (id > 0) {
      this.parentId = id;
    }
    if (this.parentId === befor) {
      return;
    }
    this.DataGetAll(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new BankPaymentPrivateSiteConfigModel();
    // this.optionsData.Select = new BankPaymentPrivateSiteConfigModel();
    this.DataGetAll(null);
  }
}
