
import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  EstatePropertyProjectModel,
  EstatePropertyProjectService,
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
  selector: 'app-estate-property-project-selector',
  templateUrl: './selector.component.html',
})
export class EstatePropertyProjectSelectorComponent implements OnInit {
  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public contentService: EstatePropertyProjectService) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  dataModelResult: ErrorExceptionResult<EstatePropertyProjectModel> = new ErrorExceptionResult<EstatePropertyProjectModel>();
  dataModelSelect: EstatePropertyProjectModel = new EstatePropertyProjectModel();
  formControl = new FormControl();
  filteredOptions: Observable<EstatePropertyProjectModel[]>;
  @Input() optionPlaceholder = '';
  @Input() optionSelectFirstItem = false;
  @Output() optionChange = new EventEmitter<EstatePropertyProjectModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: string | EstatePropertyProjectModel) {
    this.onActionSelectForce(x);
  }

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
  displayFn(model?: EstatePropertyProjectModel): string | undefined {
    return model ? model.title : undefined;
  }
  displayOption(model?: EstatePropertyProjectModel): string | undefined {
    return model ? model.title : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<EstatePropertyProjectModel[]> {
    const filteModel = new FilterModel();
    filteModel.rowPerPage = 20;
    filteModel.accessLoad = true;
    // this.loading.backdropEnabled = false;
    let filter = new FilterDataModel();
    filter.propertyName = 'Title';
    filter.value = text;
    filter.searchType = EnumFilterDataModelSearchTypes.Contains;
    filter.clauseType = EnumClauseType.Or;
    filteModel.filters.push(filter);
    if (text && typeof text === 'string' && text.length > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Equal;
      filter.clauseType = EnumClauseType.Or;
      filteModel.filters.push(filter);
    }
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    return this.contentService.ServiceGetAll(filteModel)
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
        })).toPromise();
  }
  onActionSelect(model: EstatePropertyProjectModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionSelectClear(): void {
    this.dataModelSelect.linkMainImageIdSrc = '';
    this.formControl.setValue(null);
    this.optionChange.emit(null);
  }
  push(newvalue: EstatePropertyProjectModel): Observable<EstatePropertyProjectModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));
  }
  onActionSelectForce(id: string | EstatePropertyProjectModel): void {
    if (typeof id === 'string' && id.length > 0) {
      this.contentService.ServiceGetOneById(id).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.filteredOptions = this.push(ret.item);
            this.dataModelSelect = ret.item;
            this.formControl.setValue(ret.item);
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
        }
      });
      return;
    }
    if (typeof id === typeof EstatePropertyProjectModel) {
      this.filteredOptions = this.push((id as EstatePropertyProjectModel));
      this.dataModelSelect = (id as EstatePropertyProjectModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }
  onActionReload(): void {
    this.dataModelSelect = new EstatePropertyProjectModel();
    this.loadOptions();
  }
}