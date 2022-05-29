import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  WebDesignerMainPageModel,
  WebDesignerMainPageService,
  EnumFilterDataModelSearchTypes,
  EnumClauseType,
  EnumPageAbilityType
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-webdesigner-page-selector',
  templateUrl: './selector.component.html',
})
export class WebDesignerMainPageSelectorComponent implements OnInit {
  constructor(
    public coreEnumService: CoreEnumService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public categoryService: WebDesignerMainPageService) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  @Input() set optionMasterTemplateId(x: string) {
    this.masterTemplateId = x;
    this.loadOptions();
  }
  @Input() set optionSelectForce(x: string | WebDesignerMainPageModel) {
    this.onActionSelectForce(x);
  }
  dataModelResult: ErrorExceptionResult<WebDesignerMainPageModel> = new ErrorExceptionResult<WebDesignerMainPageModel>();
  dataModelSelect: WebDesignerMainPageModel = new WebDesignerMainPageModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<WebDesignerMainPageModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionMasterPage = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<WebDesignerMainPageModel>();
  masterTemplateId = '';
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
  displayFn(model?: WebDesignerMainPageModel): string | undefined {
    return model ? (model.Title) : undefined;
  }
  displayOption(model?: WebDesignerMainPageModel): string | undefined {
    return model ? (model.Title) : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<WebDesignerMainPageModel[]> {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    // this.loading.backdropEnabled = false;
    let filter = new FilterDataModel();
    const filterChild = new FilterDataModel();
    if (text && text.length > 0) {
      filter.PropertyName = 'Title';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
      filter.ClauseType = EnumClauseType.Or;
      filterChild.Filters.push(filter);
    }
    if (text && typeof +text === 'number' && +text > 0) {
      filter = new FilterDataModel();
      filter.PropertyName = 'Id';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Equal;
      filter.ClauseType = EnumClauseType.Or;
      filterChild.Filters.push(filter);
    }
    filteModel.Filters.push(filterChild);
    if (this.optionMasterPage) {
      filter = new FilterDataModel();
      filter.PropertyName = 'PageAbilityType';
      filter.Value = EnumPageAbilityType.Master;
      filter.SearchType = EnumFilterDataModelSearchTypes.Equal;
      filter.ClauseType = EnumClauseType.And;
      filteModel.Filters.push(filter);
    }
    if (this.masterTemplateId && this.masterTemplateId.length > 0) {
      filter = new FilterDataModel();
      filter.PropertyName = 'LinkPageTemplateGuId';
      filter.Value = this.masterTemplateId;
      filter.SearchType = EnumFilterDataModelSearchTypes.Equal;
      filter.ClauseType = EnumClauseType.And;
      filteModel.Filters.push(filter);
    }
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
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
          this.loading.Stop(pName);
          return response.ListItems;
        })
      ).toPromise();
  }
  onActionSelect(model: WebDesignerMainPageModel): void {
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
  push(newvalue: WebDesignerMainPageModel): Observable<WebDesignerMainPageModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));
  }
  onActionSelectForce(id: string | WebDesignerMainPageModel): void {
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
    if (typeof id === typeof WebDesignerMainPageModel) {
      this.filteredOptions = this.push((id as WebDesignerMainPageModel));
      this.dataModelSelect = (id as WebDesignerMainPageModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }
  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new WebDesignerMainPageModel();
    // this.optionsData.Select = new WebDesignerMainPageModel();
    this.DataGetAll(null);
  }
}