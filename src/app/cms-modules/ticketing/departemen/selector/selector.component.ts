import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {
  CoreEnumService,
  EnumClauseType,
  EnumFilterDataModelSearchTypes,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  TicketingDepartemenModel,
  TicketingDepartemenService
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-ticketing-departemen-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class TicketingDepartemenSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public categoryService: TicketingDepartemenService) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  dataModelResult: ErrorExceptionResult<TicketingDepartemenModel> = new ErrorExceptionResult<TicketingDepartemenModel>();
  dataModelSelect: TicketingDepartemenModel = new TicketingDepartemenModel();
  formControl = new FormControl();
  filteredOptions: Observable<TicketingDepartemenModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<TicketingDepartemenModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | TicketingDepartemenModel) {
    this.onActionSelectForce(x);
  }

  _loading: ProgressSpinnerModel = new ProgressSpinnerModel();
  get loading(): ProgressSpinnerModel {
    return this._loading;
  }
  @Input() set loading(value: ProgressSpinnerModel) {
    this._loading = value;
  }

  ngOnInit(): void {
    this.loadOptions();
  }
  loadOptions(): void {
    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1500),
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

  displayFn(model?: TicketingDepartemenModel): string | undefined {
    return model ? model.title : undefined;
  }
  displayOption(model?: TicketingDepartemenModel): string | undefined {
    return model ? model.title : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<TicketingDepartemenModel[]> {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;
    // this.loading.backdropEnabled = false;
    let filter = new FilterDataModel();
    filter.propertyName = 'Title';
    filter.value = text;
    filter.searchType = EnumFilterDataModelSearchTypes.Contains;
    filter.clauseType = EnumClauseType.Or;
    filterModel.filters.push(filter);
    if (text && typeof +text === 'number' && +text > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Equal;
      filter.clauseType = EnumClauseType.Or;
      filterModel.filters.push(filter);
    }
    
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    return await this.categoryService.ServiceGetAll(filterModel)
      .pipe(
        map(response => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.id || this.dataModelSelect.id <= 0) &&
            this.dataModelResult.listItems.length > 0) {
            this.optionSelectFirstItem = false;
            setTimeout(() => { this.formControl.setValue(this.dataModelResult.listItems[0]); }, 1000);
            this.onActionSelect(this.dataModelResult.listItems[0]);
          }
          /*select First Item */
          this.loading.Stop(pName);

          return response.listItems;
        })
      ).toPromise();
  }
  onActionSelect(model: TicketingDepartemenModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionSelectClear(): void {
    this.formControl.setValue(null);
    this.optionChange.emit(null);
  }

  push(newvalue: TicketingDepartemenModel): Observable<TicketingDepartemenModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | TicketingDepartemenModel): void {
    if (typeof id === 'number' && id > 0) {
      if (this.dataModelSelect && this.dataModelSelect.id === id) {
        return;
      }
      if (this.dataModelResult && this.dataModelResult.listItems && this.dataModelResult.listItems.find(x => x.id === id)) {
        const item = this.dataModelResult.listItems.find(x => x.id === id);
        this.dataModelSelect = item;
        this.formControl.setValue(item);
        return;
      }
      this.categoryService.ServiceGetOneById(id).subscribe((next) => {
        if (next.isSuccess) {
          this.filteredOptions = this.push(next.item);
          this.dataModelSelect = next.item;
          this.formControl.setValue(next.item);
          this.optionChange.emit(next.item);
        }
      });
      return;
    }
    if (typeof id === typeof TicketingDepartemenModel) {
      this.filteredOptions = this.push((id as TicketingDepartemenModel));
      this.dataModelSelect = (id as TicketingDepartemenModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new TicketingDepartemenModel();
    // this.optionsData.Select = new TicketingDepartemenModel();
    this.loadOptions();
  }
}
