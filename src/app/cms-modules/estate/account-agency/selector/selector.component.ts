//**msh */
import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {
  CoreEnumService,
  EnumClauseType,
  EnumFilterDataModelSearchTypes,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  EstateAccountAgencyModel,
  EstateAccountAgencyService
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-estate-accountagency-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class EstateAccountAgencySelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public categoryService: EstateAccountAgencyService) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');

  }
  dataModelResult: ErrorExceptionResult<EstateAccountAgencyModel> = new ErrorExceptionResult<EstateAccountAgencyModel>();
  dataModelSelect: EstateAccountAgencyModel = new EstateAccountAgencyModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<EstateAccountAgencyModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<EstateAccountAgencyModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: string | EstateAccountAgencyModel) {
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

  displayFn(model?: EstateAccountAgencyModel): string | undefined {
    return model ? model.Title : undefined;
  }
  displayOption(model?: EstateAccountAgencyModel): string | undefined {
    return model ? model.Title : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<EstateAccountAgencyModel[]> {
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
  onActionSelect(model: EstateAccountAgencyModel): void {
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

  push(newvalue: EstateAccountAgencyModel): Observable<EstateAccountAgencyModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | EstateAccountAgencyModel): void {
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
    if (typeof id === typeof EstateAccountAgencyModel) {
      this.filteredOptions = this.push((id as EstateAccountAgencyModel));
      this.dataModelSelect = (id as EstateAccountAgencyModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new EstateAccountAgencyModel();
    // this.optionsData.Select = new EstateAccountAgencyModel();
    this.DataGetAll(null);
  }
}
