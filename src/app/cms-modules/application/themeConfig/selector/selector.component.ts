
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ApplicationThemeConfigModel,
  ApplicationThemeConfigService, CoreEnumService, EnumClauseType, EnumFilterDataModelSearchTypes, ErrorExceptionResult,
  FilterDataModel,
  FilterModel
} from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-application-themeconfig-selector',
  templateUrl: './selector.component.html',
})
export class ApplicationThemeConfigSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public categoryService: ApplicationThemeConfigService) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');

  }
  @Input() set optionSelectForce(x: number | ApplicationThemeConfigModel) {
    this.onActionSelectForce(x);
  }
  @Input() set optionSelectParentForce(x: number) {
    this.onActionSelectParentForce(x);
  }
  dataModelResult: ErrorExceptionResult<ApplicationThemeConfigModel> = new ErrorExceptionResult<ApplicationThemeConfigModel>();
  dataModelSelect: ApplicationThemeConfigModel = new ApplicationThemeConfigModel();
  formControl = new FormControl();
  filteredOptions: Observable<ApplicationThemeConfigModel[]>;
  parentId = 0;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<ApplicationThemeConfigModel>();

  @Input() optionReload = () => this.onActionReload();
  ngOnInit(): void {
    this.loadOptions();
  }

  _loading: ProgressSpinnerModel = new ProgressSpinnerModel();
  get loading(): ProgressSpinnerModel {
    return this._loading;
  }
  @Input() set loading(value: ProgressSpinnerModel) {
    this._loading = value;
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

  displayFn(model?: ApplicationThemeConfigModel): string | undefined {
    return model ? model.titleML : undefined;
  }
  displayOption(model?: ApplicationThemeConfigModel): string | undefined {
    return model ? model.titleML : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<ApplicationThemeConfigModel[]> {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;
    const filters = new Array<FilterDataModel>();
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
    if (this.parentId > 0) {
      const parent = {
        PropertyName: 'LinkSourceId',
        Value: this.parentId.toString(),
        ClauseType: 2,
        SearchType: 0
      };
      filterModel.filters.push(parent as unknown as FilterDataModel);
      const tree = {
        Filters: filters,
      };
      if (filters && filters.length > 0) {
        filterModel.filters.push(tree as unknown as FilterDataModel);
      }
    }
    else if (filters && filters.length > 0) {
      filterModel.filters = filters as FilterDataModel[];
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
  onActionSelect(model: ApplicationThemeConfigModel): void {
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

  push(newvalue: ApplicationThemeConfigModel): Observable<ApplicationThemeConfigModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | ApplicationThemeConfigModel): void {
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
      this.categoryService.ServiceGetOneById(id).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.filteredOptions = this.push(ret.item);
            this.dataModelSelect = ret.item;
            this.formControl.setValue(ret.item);
            this.optionChange.emit(ret.item);
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
        }
      });
      return;
    }
    if (typeof id === typeof ApplicationThemeConfigModel) {
      this.filteredOptions = this.push((id as ApplicationThemeConfigModel));
      this.dataModelSelect = (id as ApplicationThemeConfigModel);
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
    this.loadOptions();
  }

  onActionReload(): void {
    this.dataModelSelect = new ApplicationThemeConfigModel();
    this.loadOptions();
  }
}
