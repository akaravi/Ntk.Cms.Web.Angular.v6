import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreLocationModel,
  CoreLocationService, EnumClauseType, EnumFilterDataModelSearchTypes, ErrorExceptionResult,
  FilterDataModel,
  FilterModel
} from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';


@Component({
  selector: 'app-cms-location-selector',
  templateUrl: './cms-location-selector.component.html',
})
export class CmsLocationSelectorComponent implements OnInit {
  static nextId = 0;
  id = ++CmsLocationSelectorComponent.nextId;
  constructor(
    public coreEnumService: CoreEnumService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public categoryService: CoreLocationService) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  dataModelResult: ErrorExceptionResult<CoreLocationModel> = new ErrorExceptionResult<CoreLocationModel>();
  dataModelSelect: CoreLocationModel = new CoreLocationModel();
  formControl = new FormControl();
  filteredOptions: Observable<CoreLocationModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<CoreLocationModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | CoreLocationModel) {
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
            return this.DataGetAll(val);
          }
          return this.DataGetAll('');
        }),
        // tap(() => this.myControl.setValue(this.options[0]))
      );
  }

  displayFn(model?: CoreLocationModel): string | undefined {
    if (model && model.virtual_Parent && model.virtual_Parent.title.length > 0
      && model.virtual_Parent.virtual_Parent && model.virtual_Parent.virtual_Parent.title.length > 0
      && model.virtual_Parent.virtual_Parent.virtual_Parent && model.virtual_Parent.virtual_Parent.virtual_Parent.title.length > 0) {
      return model.virtual_Parent.virtual_Parent.virtual_Parent.titleML + ' > ' + model.virtual_Parent.virtual_Parent.titleML + ' > ' + model.virtual_Parent.titleML + ' > ' + model.titleML;
    }
    if (model && model.virtual_Parent && model.virtual_Parent.title.length > 0 && model.virtual_Parent.virtual_Parent && model.virtual_Parent.virtual_Parent.title.length > 0) {
      return model.virtual_Parent.virtual_Parent.titleML + ' > ' + model.virtual_Parent.titleML + ' > ' + model.titleML;
    }
    if (model && model.virtual_Parent && model.virtual_Parent.title.length > 0) {
      return model.virtual_Parent.titleML + ' > ' + model.titleML;
    }
    return model ? (model.titleML) : undefined;
  }
  displayOption(model?: CoreLocationModel): string | undefined {
    if (model && model.virtual_Parent && model.virtual_Parent.title.length > 0
      && model.virtual_Parent.virtual_Parent && model.virtual_Parent.virtual_Parent.title.length > 0
      && model.virtual_Parent.virtual_Parent.virtual_Parent && model.virtual_Parent.virtual_Parent.virtual_Parent.title.length > 0) {
      return model.virtual_Parent.virtual_Parent.virtual_Parent.titleML + ' > ' + model.virtual_Parent.virtual_Parent.titleML + ' > ' + model.virtual_Parent.titleML + ' > ' + model.titleML;
    }
    if (model && model.virtual_Parent && model.virtual_Parent.title.length > 0 && model.virtual_Parent.virtual_Parent && model.virtual_Parent.virtual_Parent.title.length > 0) {
      return model.virtual_Parent.virtual_Parent.titleML + ' > ' + model.virtual_Parent.titleML + ' > ' + model.titleML;
    }
    if (model && model.virtual_Parent && model.virtual_Parent.title.length > 0) {
      return model.virtual_Parent.titleML + ' > ' + model.titleML;
    }
    return model ? (model.titleML) : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<CoreLocationModel[]> {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;
    // this.loading.backdropEnabled = false;
    if (text && text.length > 0) {
      let filter = new FilterDataModel();
      /*Filters */
      filter = new FilterDataModel();
      filter.propertyName = 'Symbol';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Contains;
      filter.clauseType = EnumClauseType.Or;
      filterModel.filters.push(filter);
      /*Filters */
      filter = new FilterDataModel();
      filter.propertyName = 'Title';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Contains;
      filter.clauseType = EnumClauseType.Or;
      filterModel.filters.push(filter);

      if (text && typeof +text === 'number' && +text > 0) {
        /*Filters */
        filter = new FilterDataModel();
        filter.propertyName = 'Id';
        filter.value = text;
        filter.searchType = EnumFilterDataModelSearchTypes.Equal;
        filter.clauseType = EnumClauseType.Or;
        filterModel.filters.push(filter);

      }
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
  onActionSelect(model: CoreLocationModel): void {
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
  push(newvalue: CoreLocationModel): Observable<CoreLocationModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | CoreLocationModel): void {
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
      this.categoryService.ServiceGetOneIncludeParent(id).subscribe((next) => {
        if (next.isSuccess) {
          this.filteredOptions = this.push(next.item);
          this.dataModelSelect = next.item;
          this.formControl.setValue(next.item);
          this.optionChange.emit(next.item);
        }
      });
      return;
    }
    if (typeof id === typeof CoreLocationModel) {
      this.filteredOptions = this.push((id as CoreLocationModel));
      this.dataModelSelect = (id as CoreLocationModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new CoreLocationModel();
    // this.optionsData.Select = new CoreLocationModel();
    this.loadOptions();
  }
}
