//**msh */
import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  ApplicationThemeConfigModel,
  ApplicationThemeConfigService,
  EnumFilterDataModelSearchTypes,
  EnumClauseType
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TranslateService } from '@ngx-translate/core';


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
  loading = new ProgressSpinnerModel();
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

  displayFn(model?: ApplicationThemeConfigModel): string | undefined {
    return model ? model.titleML : undefined;
  }
  displayOption(model?: ApplicationThemeConfigModel): string | undefined {
    return model ? model.titleML : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<ApplicationThemeConfigModel[]> {
    const filteModel = new FilterModel();
    filteModel.rowPerPage = 20;
    filteModel.accessLoad = true;
    const filters = new Array<FilterDataModel>();
    let filter = new FilterDataModel();
    filter.propertyName = 'Title';
    filter.value = text;
    filter.searchType = EnumFilterDataModelSearchTypes.Contains;
    filter.clauseType = EnumClauseType.Or;
    filteModel.filters.push(filter);
    if (text && typeof +text === 'number' && +text > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Equal;
      filter.clauseType = EnumClauseType.Or;
      filteModel.filters.push(filter);
    }
    if (this.parentId > 0) {
      const parent = {
        PropertyName: 'LinkSourceId',
        Value: this.parentId.toString(),
        ClauseType: 2,
        SearchType: 0
      };
      filteModel.filters.push(parent  as unknown as FilterDataModel);
      const tree = {
        Filters: filters,
      };
      if (filters && filters.length > 0) {
        filteModel.filters.push(tree  as unknown as FilterDataModel);
      }
    }
    else if (filters && filters.length > 0) {
      filteModel.filters = filters as FilterDataModel[];
    }

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    return await this.categoryService.ServiceGetAll(filteModel)
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
          this.cmsToastrService.typeerrorMessage(ret.errorMessage);
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
    this.DataGetAll(null);
  }

  onActionReload(): void {
    this.dataModelSelect = new ApplicationThemeConfigModel();
    this.DataGetAll(null);
  }
}
