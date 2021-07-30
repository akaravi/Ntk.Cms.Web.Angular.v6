import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {
  CoreEnumService,
  EnumClauseType,
  EnumFilterDataModelSearchTypes,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  EstateAccountAgencyTypeUserModel,
  EstateAccountAgencyTypeUserService
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';


@Component({
  selector: 'app-estate-AccountAgencyTypeUser-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class EstateAccountAgencyTypeUserSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: EstateAccountAgencyTypeUserService) {


  }
  dataModelResult: ErrorExceptionResult<EstateAccountAgencyTypeUserModel> = new ErrorExceptionResult<EstateAccountAgencyTypeUserModel>();
  dataModelSelect: EstateAccountAgencyTypeUserModel = new EstateAccountAgencyTypeUserModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<EstateAccountAgencyTypeUserModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = new EventEmitter<string>();
  @Output() optionSelect = new EventEmitter<EstateAccountAgencyTypeUserModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: string | EstateAccountAgencyTypeUserModel) {
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

  displayFn(model?: EstateAccountAgencyTypeUserModel): string | undefined {
    return model ? model.Id  : undefined;
  }
  displayOption(model?: EstateAccountAgencyTypeUserModel): string | undefined {
    return model ? model.Id  : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<EstateAccountAgencyTypeUserModel[]> {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    // this.loading.backdropEnabled = false;
    let filter = new FilterDataModel();
    filter.PropertyName = 'Name';
    filter.Value = text;
    filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
    filteModel.Filters.push(filter);
    /* */
    filter = new FilterDataModel();
    filter.PropertyName = 'Id';
    filter.Value = text;
    filter.SearchType = EnumFilterDataModelSearchTypes.Equal;
    filter.ClauseType = EnumClauseType.Or;
    filteModel.Filters.push(filter);

    this.loading.Globally = false;
    this.loading.display = true;
    return await this.categoryService.ServiceGetAll(filteModel)
      .pipe(
        map(response => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.Id || this.dataModelSelect.Id.length === 0) &&
            this.dataModelResult.ListItems.length > 0) {
            this.optionSelectFirstItem = false;
            setTimeout(() => { this.formControl.setValue(this.dataModelResult.ListItems[0]); }, 1000);
          }
          /*select First Item */
          return response.ListItems;
        })
      ).toPromise();
  }
  onActionSelect(model: EstateAccountAgencyTypeUserModel): void {
    if(this.optionDisabled)
    {
      return;
    }
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
  }
  onActionSelectClear(): void {
    if(this.optionDisabled)
    {
      return;
    }
    this.formControl.setValue(null);
    this.optionSelect.emit(null);
  }

  push(newvalue: EstateAccountAgencyTypeUserModel): Observable<EstateAccountAgencyTypeUserModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | EstateAccountAgencyTypeUserModel): void {
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
          this.optionSelect.emit(next.Item);
        }
      });
      return;
    }
    if (typeof id === typeof EstateAccountAgencyTypeUserModel) {
      this.filteredOptions = this.push((id as EstateAccountAgencyTypeUserModel));
      this.dataModelSelect = (id as EstateAccountAgencyTypeUserModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new EstateAccountAgencyTypeUserModel();
    // this.optionsData.Select = new EstateAccountAgencyTypeUserModel();
    this.DataGetAll(null);
  }
}
