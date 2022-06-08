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
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-cms-member-selector',
  templateUrl: './cmsMemberSelector.component.html',
  styleUrls: ['./cmsMemberSelector.component.scss']
})
export class CmsMemberSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public categoryService: MemberUserService) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  dataModelResult: ErrorExceptionResult<MemberUserModel> = new ErrorExceptionResult<MemberUserModel>();
  dataModelSelect: MemberUserModel = new MemberUserModel();
  @Input() loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<MemberUserModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<MemberUserModel>();
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
    filteModel.rowPerPage = 20;
    filteModel.accessLoad = true;
    // this.loading.backdropEnabled = false;
    if (text && text.length > 0) {
      let filter = new FilterDataModel();
      /*Filters */
      filter = new FilterDataModel();
      filter.propertyName = 'username';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Contains;
      filter.clauseType = EnumClauseType.Or;
      filteModel.filters.push(filter);
      /*Filters */
      /*Filters */
      filter = new FilterDataModel();
      filter.propertyName = 'name';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Contains;
      filter.clauseType = EnumClauseType.Or;
      filteModel.filters.push(filter);
      /*Filters */
      filter = new FilterDataModel();
      filter.propertyName = 'email';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Contains;
      filter.clauseType = EnumClauseType.Or;
      filteModel.filters.push(filter);
      /*Filters */
      filter = new FilterDataModel();
      filter.propertyName = 'lastname';
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

    const pName = this.constructor.name + 'categoryService.ServiceGetAll';
    this.loading.Start(pName);

    return await this.categoryService.ServiceGetAll(filteModel)
      .pipe(
        map(response => {
          this.dataModelResult = response;
          this.loading.Stop(pName);

          return response.listItems;
        })
      ).toPromise();
  }
  onActionSelect(model: MemberUserModel): void {
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
  push(newvalue: MemberUserModel): Observable<MemberUserModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | MemberUserModel): void {
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
    if (typeof id === typeof MemberUserModel) {
      this.filteredOptions = this.push((id as MemberUserModel));
      this.dataModelSelect = (id as MemberUserModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new MemberUserModel();
    // this.optionsData.Select = new MemberUserModel();
    this.DataGetAll(null);
  }
}
