import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  SmsMainCustomerNumberModel,
  SmsMainCustomerNumberService,
  EnumFilterDataModelSearchTypes,
  EnumClauseType
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';


@Component({
  selector: 'app-sms-customer-number-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SmsMainCustomerNumberSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    private cdr: ChangeDetectorRef,
    public categoryService: SmsMainCustomerNumberService) {
    this.loading.cdr = this.cdr;
  }

  dataModelResult: ErrorExceptionResult<SmsMainCustomerNumberModel> = new ErrorExceptionResult<SmsMainCustomerNumberModel>();
  dataModelSelect: SmsMainCustomerNumberModel = new SmsMainCustomerNumberModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<SmsMainCustomerNumberModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<SmsMainCustomerNumberModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: string | SmsMainCustomerNumberModel) {
    this.onActionSelectForce(x);
  }
@Input() optionLinkApiPathId='';
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

  displayFn(model?: SmsMainCustomerNumberModel): string | undefined {
    return model ? (model.NumberChar) : undefined;
  }
  displayOption(model?: SmsMainCustomerNumberModel): string | undefined {
    return model ? (model.NumberChar) : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<SmsMainCustomerNumberModel[]> {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    let filter = new FilterDataModel();
    filter.PropertyName = 'NumberChar';
    filter.Value = text;
    filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
    filter.ClauseType = EnumClauseType.Or;
    filteModel.Filters.push(filter);
    if (this.optionLinkApiPathId && this.optionLinkApiPathId.length > 0) {
      filter = new FilterDataModel();
      filter.PropertyName = 'ApiPathAndCustomerNumbers';
      filter.PropertyAnyName = 'LinkApiPathId';
      filter.Value = this.optionLinkApiPathId;
      filter.SearchType = EnumFilterDataModelSearchTypes.Equal;
      filteModel.Filters.push(filter);
    }
    this.loading.Start('DataGetAll');
    return await this.categoryService.ServiceGetAll(filteModel)
      .pipe(
        map(response => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.Id || this.dataModelSelect.Id.length <= 0) &&
            this.dataModelResult.ListItems.length > 0) {
            this.optionSelectFirstItem = false;
            setTimeout(() => { this.formControl.setValue(this.dataModelResult.ListItems[0]); }, 1000);
            this.onActionSelect(this.dataModelResult.ListItems[0]);
          }
          /*select First Item */
          this.loading.Stop('DataGetAll');
          return response.ListItems;
        })
      ).toPromise();
  }
  onActionSelect(model: SmsMainCustomerNumberModel): void {
    if (this.optionDisabled) {
      return;
    }
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionSelectClear(): void {
    if (this.optionDisabled) {
      return;
    }
    this.formControl.setValue(null);
    this.optionChange.emit(null);
  }

  push(newvalue: SmsMainCustomerNumberModel): Observable<SmsMainCustomerNumberModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | SmsMainCustomerNumberModel): void {
    if (typeof id === 'string' && id.length > 0) {
      if (this.dataModelSelect && this.dataModelSelect.Id === id) {
        return;
      }
      if (this.dataModelResult && this.dataModelResult.ListItems && this.dataModelResult.ListItems.find(x => x.Id === id)) {
        const item = this.dataModelResult.ListItems.find(x => x.Id === id);
        this.dataModelSelect = item;
        this.formControl.setValue(item);
        return;
      }
      if (this.dataModelResult && this.dataModelResult.ListItems && this.dataModelResult.ListItems.find(x => x.NumberChar === id)) {
        const item = this.dataModelResult.ListItems.find(x => x.NumberChar === id);
        this.dataModelSelect = item;
        this.formControl.setValue(item);
        return;
      }
      this.categoryService.ServiceGetOneById(id).subscribe((next) => {
        if (next.IsSuccess) {
          this.filteredOptions = this.push(next.Item);
          this.dataModelSelect = next.Item;
          this.formControl.setValue(next.Item);
          this.optionChange.emit(next.Item);
        }
      });
      return;
    }
    if (typeof id === typeof SmsMainCustomerNumberModel) {
      this.filteredOptions = this.push((id as SmsMainCustomerNumberModel));
      this.dataModelSelect = (id as SmsMainCustomerNumberModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    this.dataModelSelect = new SmsMainCustomerNumberModel();
    this.DataGetAll(null);
  }
}
