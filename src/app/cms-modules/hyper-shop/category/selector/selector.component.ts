//**msh */
import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {
  CoreEnumService,
  EnumClauseType,
  EnumFilterDataModelSearchTypes,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  HyperShopCategoryModel,
  HyperShopCategoryService
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-hypershop-category-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class HyperShopCategorySelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public categoryService: HyperShopCategoryService) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  dataModelResult: ErrorExceptionResult<HyperShopCategoryModel> = new ErrorExceptionResult<HyperShopCategoryModel>();
  dataModelSelect: HyperShopCategoryModel = new HyperShopCategoryModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<HyperShopCategoryModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<HyperShopCategoryModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: string | HyperShopCategoryModel) {
    this.onActionSelectForce(x);
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

  displayFn(model?: HyperShopCategoryModel): string | undefined {
    return model ? model.name + ' # ' + model.code : undefined;
  }
  displayOption(model?: HyperShopCategoryModel): string | undefined {
    return model ? model.name + ' # ' + model.code : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<HyperShopCategoryModel[]> {
    const filteModel = new FilterModel();
    filteModel.rowPerPage = 20;
    filteModel.accessLoad = true;
    // this.loading.backdropEnabled = false;
    let filter = new FilterDataModel();
    filter.propertyName = 'Name';
    filter.value = text;
    filter.searchType = EnumFilterDataModelSearchTypes.Contains;
    filteModel.filters.push(filter);
    /* */
    filter = new FilterDataModel();
    filter.propertyName = 'Code';
    filter.value = text;
    filter.searchType = EnumFilterDataModelSearchTypes.Equal;
    filter.clauseType = EnumClauseType.Or;
    filteModel.filters.push(filter);

    
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    return await this.categoryService.ServiceGetAll(filteModel)
      .pipe(
        map(response => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.code || this.dataModelSelect.code.length === 0) &&
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
  onActionSelect(model: HyperShopCategoryModel): void {
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

  push(newvalue: HyperShopCategoryModel): Observable<HyperShopCategoryModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.code === newvalue.code)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | HyperShopCategoryModel): void {
    if (typeof id === 'string' && id.length > 0) {
      if (this.dataModelSelect && this.dataModelSelect.code === id) {
        return;
      }
      if (this.dataModelResult && this.dataModelResult.listItems && this.dataModelResult.listItems.find(x => x.code === id)) {
        const item = this.dataModelResult.listItems.find(x => x.code === id);
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
    if (typeof id === typeof HyperShopCategoryModel) {
      this.filteredOptions = this.push((id as HyperShopCategoryModel));
      this.dataModelSelect = (id as HyperShopCategoryModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    this.dataModelSelect = new HyperShopCategoryModel();
    this.DataGetAll(null);
  }
}
