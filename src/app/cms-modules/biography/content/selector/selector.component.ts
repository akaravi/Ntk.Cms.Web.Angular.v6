import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  BiographyContentModel,
  BiographyContentService,
  EnumFilterDataModelSearchTypes,
  EnumClauseType
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';




@Component({
  selector: 'app-biography-content-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class BiographyContentSelectorComponent implements OnInit {
  constructor(
    public coreEnumService: CoreEnumService,
    public contentService: BiographyContentService) {


  }
  dataModelResult: ErrorExceptionResult<BiographyContentModel> = new ErrorExceptionResult<BiographyContentModel>();
  dataModelSelect: BiographyContentModel = new BiographyContentModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<BiographyContentModel[]>;
  @Input() optionPlaceholder = new EventEmitter<string>();
  @Input() optionSelectFirstItem = false;
  @Output() optionSelect = new EventEmitter<BiographyContentModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | BiographyContentModel) {
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

  displayFn(model?: BiographyContentModel): string | undefined {
    return model ? model.Title : undefined;
  }
  displayOption(model?: BiographyContentModel): string | undefined {
    return model ? model.Title : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<BiographyContentModel[]> {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    // this.loading.backdropEnabled = false;
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
    this.loading.Globally = false;
    this.loading.display = true;
    return this.contentService.ServiceGetAll(filteModel)
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
        })).toPromise();
  }
  onActionSelect(model: BiographyContentModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);

  }
  onActionSelectClear(): void{
    this.formControl.setValue(null);
    this.optionSelect.emit(null);
  }
  push(newvalue: BiographyContentModel): Observable<BiographyContentModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | BiographyContentModel): void {
    if (typeof id === 'number' && id > 0) {
      this.contentService.ServiceGetOneById(id).subscribe((next) => {
        if (next.IsSuccess) {
          this.filteredOptions = this.push(next.Item);
          this.dataModelSelect = next.Item;
          this.formControl.setValue(next.Item);
        }
      });
      return;
    }
    if (typeof id === typeof BiographyContentModel) {
      this.filteredOptions = this.push((id as BiographyContentModel));
      this.dataModelSelect = (id as BiographyContentModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new BiographyContentModel();
    // this.optionsData.Select = new BiographyContentModel();
    this.DataGetAll(null);
  }
}
