
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, EnumClauseType, EnumFilterDataModelSearchTypes, ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  SmsMainApiNumberModel,
  SmsMainApiNumberService
} from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-cms-sms-api-number-selector',
  templateUrl: './cms-sms-api-number-selector.component.html',
  styleUrls: ['./cms-sms-api-number-selector.component.scss']
})
export class CmsSmsMainApiNumberSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public categoryService: SmsMainApiNumberService) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');

  }

  dataModelResult: ErrorExceptionResult<SmsMainApiNumberModel> = new ErrorExceptionResult<SmsMainApiNumberModel>();
  dataModelSelect: SmsMainApiNumberModel = new SmsMainApiNumberModel();
  formControl = new FormControl();
  filteredOptions: Observable<SmsMainApiNumberModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionSelectFirstItemOnChangeApi = false;

  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<SmsMainApiNumberModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: string | SmsMainApiNumberModel) {
    this.onActionSelectForce(x);
  }

  _loading: ProgressSpinnerModel = new ProgressSpinnerModel();
  get loading(): ProgressSpinnerModel {
    return this._loading;
  }
  @Input() set loading(value: ProgressSpinnerModel) {
    this._loading = value;
  }

  @Input() set optionLinkApiPathId(x: string) {
    if (x == this.privateLinkApiPathId)
      return;
    if (this.privateLinkApiPathId != '')
      this.onActionSelectClear();
    this.privateLinkApiPathId = x;
    if (this.privateLinkApiPathId != this.privateLinkApiPathIdLast)
      this.optionSelectFirstItem = this.optionSelectFirstItemOnChangeApi;
    this.privateLinkApiPathIdLast = x;
    this.loadOptions();
  }
  public privateLinkApiPathId = '';
  private privateLinkApiPathIdLast = '';

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

  displayFn(model?: SmsMainApiNumberModel): string | undefined {
    return model ? (model.numberChar) : undefined;
  }
  displayOption(model?: SmsMainApiNumberModel): string | undefined {
    return model ? (model.numberChar) : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<SmsMainApiNumberModel[]> {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;
    let filter = new FilterDataModel();
    filter.propertyName = 'NumberChar';
    filter.value = text;
    filter.searchType = EnumFilterDataModelSearchTypes.Contains;
    filter.clauseType = EnumClauseType.Or;
    filterModel.filters.push(filter);
    if (this.privateLinkApiPathId && this.privateLinkApiPathId.length > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'ApiPathAndApiNumbers';
      filter.propertyAnyName = 'LinkApiPathId';
      filter.value = this.privateLinkApiPathId;
      filter.searchType = EnumFilterDataModelSearchTypes.Equal;
      filterModel.filters.push(filter);
    }
    this.loading.Start('DataGetAll');
    return await this.categoryService.ServiceGetAll(filterModel)
      .pipe(
        map(response => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem && (!this.dataModelSelect || !this.dataModelSelect.id || this.dataModelSelect.id.length <= 0) && this.dataModelResult.listItems.length > 0) {
            this.optionSelectFirstItem = false;
            setTimeout(() => {
              this.formControl.setValue(this.dataModelResult.listItems[0]);
              this.onActionSelect(this.dataModelResult.listItems[0])
            }, 1000);
          }
          /*select First Item */
          this.loading.Stop('DataGetAll');
          return response.listItems;
        })
      ).toPromise();
  }
  onActionSelect(model: SmsMainApiNumberModel): void {
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
    this.dataModelSelect = new SmsMainApiNumberModel();
    this.formControl.setValue(null);
    this.optionChange.emit(null);
  }

  push(newvalue: SmsMainApiNumberModel): Observable<SmsMainApiNumberModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | SmsMainApiNumberModel): void {
    if (typeof id === 'string' && id.length > 0) {
      if (this.dataModelSelect && this.dataModelSelect.id === id) {
        return;
      }
      if (this.dataModelResult && this.dataModelResult.listItems && this.dataModelResult.listItems.find(x => x.id === id)) {
        const item = this.dataModelResult.listItems.find(x => x.id === id);
        this.dataModelSelect = item;
        this.formControl.setValue(item);
        return;
      }
      if (this.dataModelResult && this.dataModelResult.listItems && this.dataModelResult.listItems.find(x => x.numberChar === id)) {
        const item = this.dataModelResult.listItems.find(x => x.numberChar === id);
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
    if (typeof id === typeof SmsMainApiNumberModel) {
      this.filteredOptions = this.push((id as SmsMainApiNumberModel));
      this.dataModelSelect = (id as SmsMainApiNumberModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    this.dataModelSelect = new SmsMainApiNumberModel();
    this.loadOptions();
  }
}
