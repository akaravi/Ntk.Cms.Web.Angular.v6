//**msh */
import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  SmsMainApiNumberModel,
  SmsMainApiNumberService,
  EnumFilterDataModelSearchTypes,
  EnumClauseType
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-sms-api-number-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SmsMainApiNumberSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public categoryService: SmsMainApiNumberService) {
    this.loading.cdr = this.cdr;
  }

  dataModelResult: ErrorExceptionResult<SmsMainApiNumberModel> = new ErrorExceptionResult<SmsMainApiNumberModel>();
  dataModelSelect: SmsMainApiNumberModel = new SmsMainApiNumberModel();
  @Input() loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<SmsMainApiNumberModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<SmsMainApiNumberModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: string | SmsMainApiNumberModel) {
    this.onActionSelectForce(x);
  }
  @Input() optionLinkApiPathId = '';
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

  displayFn(model?: SmsMainApiNumberModel): string | undefined {
    return model ? (model.NumberChar) : undefined;
  }
  displayOption(model?: SmsMainApiNumberModel): string | undefined {
    return model ? (model.NumberChar) : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<SmsMainApiNumberModel[]> {
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
      filter.PropertyName = 'ApiPathAndApiNumbers';
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
  onActionSelect(model: SmsMainApiNumberModel): void {
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

  push(newvalue: SmsMainApiNumberModel): Observable<SmsMainApiNumberModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | SmsMainApiNumberModel): void {
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
      this.categoryService.ServiceGetOneById(id).subscribe({
        next: (ret) => {
          if (ret.IsSuccess) {
            this.filteredOptions = this.push(ret.Item);
            this.dataModelSelect = ret.Item;
            this.formControl.setValue(ret.Item);
            this.optionChange.emit(ret.Item);
          } else {
            this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
          }
        }
      });
      return;
    }
    if (typeof id === typeof SmsMainApiNumberModel) {
      this.filteredOptions = this.push((id as SmsMainApiNumberModel));
      this.dataModelSelect = (id as SmsMainApiNumberModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    this.dataModelSelect = new SmsMainApiNumberModel();
    this.DataGetAll(null);
  }
}
