import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, EnumClauseType, EnumFilterDataModelSearchTypes, EnumPageAbilityType, ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  WebDesignerMainPageModel,
  WebDesignerMainPageService
} from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
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
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
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
  formControl = new FormControl();
  filteredOptions: Observable<WebDesignerMainPageModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionMasterPage = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<WebDesignerMainPageModel>();
  masterTemplateId = '';
  @Input() optionReload = () => this.onActionReload();

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
  displayFn(model?: WebDesignerMainPageModel): string | undefined {
    return model ? (model.title) : undefined;
  }
  displayOption(model?: WebDesignerMainPageModel): string | undefined {
    return model ? (model.title) : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<WebDesignerMainPageModel[]> {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;
    // this.loading.backdropEnabled = false;
    let filter = new FilterDataModel();
    const filterChild = new FilterDataModel();
    if (text && text.length > 0) {
      filter.propertyName = 'Title';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Contains;
      filter.clauseType = EnumClauseType.Or;
      filterChild.filters.push(filter);
    }
    if (text && typeof +text === 'number' && +text > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Equal;
      filter.clauseType = EnumClauseType.Or;
      filterChild.filters.push(filter);
    }
    filterModel.filters.push(filterChild);
    if (this.optionMasterPage) {
      filter = new FilterDataModel();
      filter.propertyName = 'PageAbilityType';
      filter.value = EnumPageAbilityType.Master;
      filter.searchType = EnumFilterDataModelSearchTypes.Equal;
      filter.clauseType = EnumClauseType.And;
      filterModel.filters.push(filter);
    }
    if (this.masterTemplateId && this.masterTemplateId.length > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'LinkPageTemplateGuId';
      filter.value = this.masterTemplateId;
      filter.searchType = EnumFilterDataModelSearchTypes.Equal;
      filter.clauseType = EnumClauseType.And;
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
            (!this.dataModelSelect || !this.dataModelSelect.id || this.dataModelSelect.id.length <= 0) &&
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
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));
  }
  onActionSelectForce(id: string | WebDesignerMainPageModel): void {
    if (typeof id === 'string' && id.length > 0) {
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
    if (typeof id === typeof WebDesignerMainPageModel) {
      this.filteredOptions = this.push((id as WebDesignerMainPageModel));
      this.dataModelSelect = (id as WebDesignerMainPageModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }
  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new WebDesignerMainPageModel();
    // this.optionsData.Select = new WebDesignerMainPageModel();
    this.loadOptions();
  }
}