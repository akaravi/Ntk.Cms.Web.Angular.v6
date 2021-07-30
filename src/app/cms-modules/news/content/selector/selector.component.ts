import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {
  CoreEnumService,
  EnumClauseType,
  EnumFilterDataModelSearchTypes,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  NewsContentModel,
  NewsContentService
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';




@Component({
  selector: 'app-news-content-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class NewsContentSelectorComponent implements OnInit {
  constructor(
    public coreEnumService: CoreEnumService,
    public contentService: NewsContentService) {


  }
  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
  dataModelSelect: NewsContentModel = new NewsContentModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<NewsContentModel[]>;
  @Input() optionPlaceholder = new EventEmitter<string>();
  @Input() optionSelectFirstItem = false;
  @Output() optionSelect = new EventEmitter<NewsContentModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | NewsContentModel) {
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

  displayFn(model?: NewsContentModel): string | undefined {
    return model ? model.Title : undefined;
  }
  displayOption(model?: NewsContentModel): string | undefined {
    return model ? model.Title : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<NewsContentModel[]> {
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
  onActionSelect(model: NewsContentModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);

  }
  onActionSelectClear(): void {
    this.formControl.setValue(null);
    this.optionSelect.emit(null);
  }
  push(newvalue: NewsContentModel): Observable<NewsContentModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | NewsContentModel): void {
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
    if (typeof id === typeof NewsContentModel) {
      this.filteredOptions = this.push((id as NewsContentModel));
      this.dataModelSelect = (id as NewsContentModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new NewsContentModel();
    // this.optionsData.Select = new NewsContentModel();
    this.DataGetAll(null);
  }
}
