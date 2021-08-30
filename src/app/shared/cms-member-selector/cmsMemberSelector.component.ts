import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  MemberUserModel,
  MemberUserService,
  EnumFilterDataModelSearchTypes,
  EnumClauseType
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';


@Component({
  selector: 'app-cms-member-selector',
  templateUrl: './cmsMemberSelector.component.html',
  styleUrls: ['./cmsMemberSelector.component.scss']
})
export class CmsMemberSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    private cdr: ChangeDetectorRef,
    public categoryService: MemberUserService) {
      this.loading.cdr = this.cdr;
  }
  dataModelResult: ErrorExceptionResult<MemberUserModel> = new ErrorExceptionResult<MemberUserModel>();
  dataModelSelect: MemberUserModel = new MemberUserModel();
  @Input() loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<MemberUserModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionSelect = new EventEmitter<MemberUserModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | MemberUserModel) {
    this.onActionSelectForce(x);
  }

  ngOnInit(): void {
    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
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

  displayFn(model?: MemberUserModel): string | undefined {
    return model ? (model.firstName + ' # ' + model.lastName + ' # ' + model.email) : undefined;
  }
  displayOption(model?: MemberUserModel): string | undefined {
    return model ? (model.firstName + ' # ' + model.lastName + ' # ' + model.email) : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<MemberUserModel[]> {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    // this.loading.backdropEnabled = false;
    if (text && text.length > 0) {
      let filter = new FilterDataModel();
      /*Filters */
      filter = new FilterDataModel();
      filter.PropertyName = 'username';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
      filter.ClauseType = EnumClauseType.Or;
      filteModel.Filters.push(filter);
      /*Filters */
      /*Filters */
      filter = new FilterDataModel();
      filter.PropertyName = 'name';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
      filter.ClauseType = EnumClauseType.Or;
      filteModel.Filters.push(filter);
      /*Filters */
      filter = new FilterDataModel();
      filter.PropertyName = 'email';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
      filter.ClauseType = EnumClauseType.Or;
      filteModel.Filters.push(filter);
      /*Filters */
      filter = new FilterDataModel();
      filter.PropertyName = 'lastname';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
      filter.ClauseType = EnumClauseType.Or;
      filteModel.Filters.push(filter);

      if (text && typeof +text === 'number' && +text > 0) {
        /*Filters */
        filter = new FilterDataModel();
        filter.PropertyName = 'Id';
        filter.Value = text;
        filter.SearchType = EnumFilterDataModelSearchTypes.Equal;
        filter.ClauseType = EnumClauseType.Or;
        filteModel.Filters.push(filter);

      }
    }
    
    this.loading.Start(this.constructor.name + 'main');

    return await this.categoryService.ServiceGetAll(filteModel)
      .pipe(
        map(response => {
          this.dataModelResult = response;
          this.loading.Stop(this.constructor.name + 'main');

          return response.ListItems;
        })
      ).toPromise();
  }
  onActionSelect(model: MemberUserModel): void {
    if (this.optionDisabled) {
      return;
    }
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
  }
  onActionSelectClear(): void {
    if (this.optionDisabled) {
      return;
    }
    this.formControl.setValue(null);
    this.optionSelect.emit(null);
  }
  push(newvalue: MemberUserModel): Observable<MemberUserModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | MemberUserModel): void {
    if (typeof id === 'number' && id > 0) {
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
    if (typeof id === typeof MemberUserModel) {
      this.filteredOptions = this.push((id as MemberUserModel));
      this.dataModelSelect = (id as MemberUserModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new MemberUserModel();
    // this.optionsData.Select = new MemberUserModel();
    this.DataGetAll(null);
  }
}
