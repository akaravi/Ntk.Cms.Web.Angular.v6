import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  CoreSiteModel,
  CoreSiteService,
  EnumFilterDataModelSearchTypes,
  EnumClauseType
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-cms-site-selector',
  templateUrl: './cmsSiteSelector.component.html',
})
export class CmsSiteSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public categoryService: CoreSiteService) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  dataModelResult: ErrorExceptionResult<CoreSiteModel> = new ErrorExceptionResult<CoreSiteModel>();
  dataModelSelect: CoreSiteModel = new CoreSiteModel();
  @Input() loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<CoreSiteModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<CoreSiteModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | CoreSiteModel) {
    this.onActionSelectForce(x);
  }

  ngOnInit(): void {
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

  displayFn(model?: CoreSiteModel): string | undefined {
    return model ? (model.title) : undefined;
  }
  displayOption(model?: CoreSiteModel): string | undefined {
    return model ? (model.title) : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<CoreSiteModel[]> {
    const filteModel = new FilterModel();
    filteModel.rowPerPage = 20;
    filteModel.accessLoad = true;
    // this.loading.backdropEnabled = false;
    if (text && text.length > 0) {
      let filter = new FilterDataModel();
      /*Filters */
      filter = new FilterDataModel();
      filter.propertyName = 'SubDomain';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Contains;
      filter.clauseType = EnumClauseType.Or;
      filteModel.filters.push(filter);
      /*Filters */
      /*Filters */
      filter = new FilterDataModel();
      filter.propertyName = 'Domain';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Contains;
      filter.clauseType = EnumClauseType.Or;
      filteModel.filters.push(filter);
      /*Filters */
      filter = new FilterDataModel();
      filter.propertyName = 'Title';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Contains;
      filter.clauseType = EnumClauseType.Or;
      filteModel.filters.push(filter);

      if (text && typeof +text === 'number' && +text > 0) {
        /*Filters */
        filter = new FilterDataModel();
        filter.propertyName = 'Id';
        filter.value = text;
        filter.searchType = EnumFilterDataModelSearchTypes.Equal;
        filter.clauseType = EnumClauseType.Or;
        filteModel.filters.push(filter);

      }
    }

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName,this.translate.instant('MESSAGE.List_of_authorized_sites'));

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
  onActionSelect(model: CoreSiteModel): void {
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
  push(newvalue: CoreSiteModel): Observable<CoreSiteModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | CoreSiteModel): void {
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
    if (typeof id === typeof CoreSiteModel) {
      this.filteredOptions = this.push((id as CoreSiteModel));
      this.dataModelSelect = (id as CoreSiteModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new CoreSiteModel();
    // this.optionsData.Select = new CoreSiteModel();
    this.DataGetAll(null);
  }
}
