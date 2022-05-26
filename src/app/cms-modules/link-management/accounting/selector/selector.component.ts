//**msh */
import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  LinkManagementAccountingModel,
  LinkManagementAccountingService,
  EnumFilterDataModelSearchTypes,
  EnumClauseType
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-linkmanagement-accounting-selector',
  templateUrl: './selector.component.html',
})
export class LinkManagementAccountingSelectorComponent implements OnInit {
  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public categoryService: LinkManagementAccountingService) {
    this.loading.cdr = this.cdr;

  }
  dataModelResult: ErrorExceptionResult<LinkManagementAccountingModel> = new ErrorExceptionResult<LinkManagementAccountingModel>();
  dataModelSelect: LinkManagementAccountingModel = new LinkManagementAccountingModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<LinkManagementAccountingModel[]>;
  @Input() optionDisabled = false;
  @Input() optionPlaceholder = '';
  @Input() optionSelectFirstItem = false;
  @Output() optionChange = new EventEmitter<LinkManagementAccountingModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | LinkManagementAccountingModel) {
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

  displayFn(model?: LinkManagementAccountingModel): string | undefined {
    return model ? model.Id + '' : undefined;
  }
  displayOption(model?: LinkManagementAccountingModel): string | undefined {
    return model ? model.Id + '' : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<LinkManagementAccountingModel[]> {
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

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    return await this.categoryService.ServiceGetAll(filteModel)
      .pipe(
        map(response => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.Id || this.dataModelSelect.Id <= 0) &&
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
  onActionSelect(model: LinkManagementAccountingModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);

  }
  onActionSelectClear(): void {
    this.formControl.setValue(null);
    this.optionChange.emit(null);
  }
  push(newvalue: LinkManagementAccountingModel): Observable<LinkManagementAccountingModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | LinkManagementAccountingModel): void {
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
      this.categoryService.ServiceGetOneById(id).subscribe({
        next: (ret) => {
          if (ret.IsSuccess) {
            this.filteredOptions = this.push(ret.Item);
            this.dataModelSelect = ret.Item;
            this.formControl.setValue(ret.Item);
            this.optionChange.emit(ret.Item);
          } else {
            this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
          }
        }
      });
      return;
    }
    if (typeof id === typeof LinkManagementAccountingModel) {
      this.filteredOptions = this.push((id as LinkManagementAccountingModel));
      this.dataModelSelect = (id as LinkManagementAccountingModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    this.dataModelSelect = new LinkManagementAccountingModel();
    this.DataGetAll(null);
  }
}
