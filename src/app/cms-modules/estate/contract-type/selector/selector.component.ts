//**msh */
import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import {
  CoreEnumService,
  EnumClauseType,
  EnumFilterDataModelSearchTypes,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  EstateContractTypeModel,
  EstateContractTypeService
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-estate-contract-type-selector',
  templateUrl: './selector.component.html',

})
export class EstateContractTypeSelectorComponent implements OnInit, OnDestroy {

  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public categoryService: EstateContractTypeService) {
    this.loading.cdr = this.cdr;
  }
  @Input() set optionSelectForce(x: string | EstateContractTypeModel) {
    this.onActionSelectForce(x);
  }
  @Input() set optionTypeUsageId(x: string) {
    this.typeUsageId = x;
    this.loadOptions();
  }
  dataModelResult: ErrorExceptionResult<EstateContractTypeModel> = new ErrorExceptionResult<EstateContractTypeModel>();
  dataModelSelect: EstateContractTypeModel = new EstateContractTypeModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<EstateContractTypeModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<EstateContractTypeModel>();
  @Input() optionTypeView = 1;

  typeUsageId = '';
  @Input() optionReload = () => this.onActionReload();
  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.loadOptions();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.loadOptions();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
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
  displayFn(model?: EstateContractTypeModel): string | undefined {
    return model ? model.TitleML : undefined;
  }
  displayOption(model?: EstateContractTypeModel): string | undefined {
    return model ? model.TitleML : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<EstateContractTypeModel[]> {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    let filter = new FilterDataModel();
    const filterChild = new FilterDataModel();
    if (text && text.length > 0) {
      filter.PropertyName = 'Title';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
      filter.ClauseType = EnumClauseType.Or;
      filterChild.Filters.push(filter);

      filter = new FilterDataModel();
      filter.PropertyName = 'Id';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Equal;
      filter.ClauseType = EnumClauseType.Or;
      filterChild.Filters.push(filter);
      filteModel.Filters.push(filterChild);
    }

    if (this.typeUsageId && this.typeUsageId.length > 0) {
      filter = new FilterDataModel();
      filter.PropertyName = 'PropertyTypes';
      filter.PropertyAnyName = 'LinkPropertyTypeUsageId';
      filter.Value = this.typeUsageId;
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
            (!this.dataModelSelect || !this.dataModelSelect.Id || this.dataModelSelect.Id.length === 0) &&
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
  onActionSelect(model: EstateContractTypeModel): void {
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

  push(newvalue: EstateContractTypeModel): Observable<EstateContractTypeModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | EstateContractTypeModel): void {
    if (!id || (id === 'string' && id.length === 0)) {
      this.dataModelSelect = new EstateContractTypeModel();
    }
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
    if (typeof id === typeof EstateContractTypeModel) {
      this.filteredOptions = this.push((id as EstateContractTypeModel));
      this.dataModelSelect = (id as EstateContractTypeModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new EstateContractTypeModel();
    // this.optionsData.Select = new EstateContractTypeModel();
    this.DataGetAll(null);
  }
}
