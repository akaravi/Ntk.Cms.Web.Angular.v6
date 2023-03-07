import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { QueryBuilderFieldMap, Rule, RuleSet } from 'ngx-ntk-query-builder';
import { AccessModel, EnumClauseType, FilterDataModel } from 'ntk-cms-api';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-search-list',
  templateUrl: './cmsSearchList.component.html',
})
export class CmsSearchListComponent implements OnInit {
  static nextId = 0;
  id = ++CmsSearchListComponent.nextId;
  public optionsData: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  @Output() optionsChange: EventEmitter<ComponentOptionSearchModel> = new EventEmitter<ComponentOptionSearchModel>();
  @Input() set options(model: ComponentOptionSearchModel) {
    if (!model) {
      model = new ComponentOptionSearchModel();
    }
    this.optionsData = model;
    this.optionsData.childMethods = {
      setAccess: (x: AccessModel) => this.setAccess(x),
    };
    this.optionsChange.emit(model);

    this.checkLoadSearch(false);
  }
  get options(): ComponentOptionSearchModel {
    return this.optionsData;
  }
  allowLoadSearch = false;
  allowSaveSearch = false;
  submited = false;
  showLabel = false;
  filters: Array<FilterDataModel>;
  lang: string;
  model: any;
  query: RuleSet;
  fieldMap: QueryBuilderFieldMap = {};
  constructor(
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService,
  ) {
    this.lang = this.translate.currentLang;
  }
  ngOnInit(): void {
    this.submited = false;
  }
  setAccess(model: AccessModel): void {
    this.optionsData.data.access = model;
    if (!this.filters || this.filters.length === 0) {
      this.setFields();
    }
    this.checkLoadSearch(false);
  }
  setFields(): void {
    if (
      this.optionsData &&
      this.optionsData.data.access &&
      this.optionsData.data.access.fieldsInfo
    ) {
      this.optionsData.data.access.fieldsInfo.forEach((column) => {
        if (!column.accessSearchField) { return; }
        if (
          column.fieldTypeString === 'System.Int32' ||
          column.fieldTypeString === 'System.Int64'
        ) {
          this.fieldMap[column.fieldName] = {
            name: column.fieldTitle,
            type: 'integer',
          };
        } else if (column.fieldTypeString === 'System.String') {
          this.fieldMap[column.fieldName] = {
            name: column.fieldTitle,
            type: 'string',
          };
        } else if (column.fieldTypeString === 'MongoDB.Bson.ObjectId') {
          this.fieldMap[column.fieldName] = {
            name: column.fieldName,
            type: 'string',
          };
        } else if (column.fieldTypeString === 'System.Boolean') {
          this.fieldMap[column.fieldName] = {
            name: column.fieldTitle,
            type: 'select',

            options: [
              { name: 'بله', value: true },
              { name: 'خیر', value: false },
            ],
          };
        } else if (column.fieldTypeString === 'System.DateTime') {
          this.fieldMap[column.fieldName] = {
            name: column.fieldTitle,
            type: 'date',
            settings: {},
          };
        } else if (column.fieldTypeString === 'link') {
          this.fieldMap[column.fieldName] = {
            name: column.fieldTitle,
            type: 'string',
          };
        } else {
          // console.log("Error: Type is not defined for columns! Please add 'type' property for each columns in gridOptions.");
        }
      });
    }
  }
  getRules(): void {
    this.filters = new Array<FilterDataModel>();
    let clauseType: EnumClauseType = EnumClauseType.And;
    if (!this.query || !this.query.condition) { return; }

    if (this.query.condition === 'or') { clauseType = EnumClauseType.Or; }
    this.query.rules.forEach((column) => {
      const ruleSet = column as RuleSet;
      const rule = column as Rule;
      if (
        ruleSet &&
        ruleSet.condition &&
        ruleSet.rules &&
        ruleSet.rules.length > 0
      ) {
        const filter = new FilterDataModel();
        filter.filters = this.getRulesSetChild(ruleSet);
        filter.clauseType = clauseType;
        this.filters.push(filter);
      } else if (rule) {
        const Filter = this.getRulesChild(rule);
        Filter.clauseType = clauseType;
        this.filters.push(Filter);
      }
    });
  }
  getRulesChild(rule: Rule): FilterDataModel {
    const searchType = this.getSearchType(rule.operator);
    const filter = new FilterDataModel();
    filter.propertyName = rule.field;
    filter.value = rule.value;
    filter.searchType = searchType;
    return filter;
  }
  getRulesSetChild(ruleSetInput: RuleSet): Array<FilterDataModel> {
    const Filters = new Array<FilterDataModel>();
    let clauseType: EnumClauseType = EnumClauseType.And;
    if (ruleSetInput.condition === 'or') { clauseType = EnumClauseType.Or; }
    ruleSetInput.rules.forEach((column) => {
      const ruleSet = column as RuleSet;
      const rule = column as Rule;
      if (
        ruleSet &&
        ruleSet.condition &&
        ruleSet.rules &&
        ruleSet.rules.length > 0
      ) {
        const filter = new FilterDataModel();
        filter.filters = this.getRulesSetChild(ruleSet);
        filter.clauseType = clauseType;
        Filters.push(filter);
      } else if (rule) {
        const filter = this.getRulesChild(rule);
        filter.clauseType = clauseType;
        Filters.push(filter);
      }
    });
    return Filters;
  }

  onSubmit(): void {
    this.submited = true;
    this.allowSaveSearch = true;
    this.getRules();
    if (this.optionsData.parentMethods) {
      this.optionsData.parentMethods.onSubmit(this.filters);
    }
  }
  onActionCopied(): void {
    this.showLabel = !this.showLabel;
    setTimeout(() => {
      this.showLabel = false;
    }, 3000);
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }
  onActionLoadRules(): void {

    this.checkLoadSearch(true);


  }
  onActionSaveRules(): void {
    localStorage.setItem(this.optionsData.data.access.moduleName + "_" + this.optionsData.data.access.moduleEntityName, JSON.stringify(this.query));

  }
  onSetRules(): void {

  }
  getSearchType(operator: string): number {
    switch (operator) {
      case 'equal':
        return 0;
      case 'not_equal':
        return 1;
      case 'less':
        return 2;
      case 'greater':
        return 3;
      case 'between':
        return 4;
      case 'contains':
        return 5;
      case 'not_contains':
        return 6;
      case 'begins_with':
        return 7;
      case 'ends_with':
        return 8;
      case 'less_or_equal':
        return 9;
      case 'greater_or_equal':
        return 10;
    }
    return 0;
  }
  checkLoadSearch(loadInfield: boolean): boolean {
    if (this.optionsData && this.optionsData.data && this.optionsData.data.access) {
      const storeVal = localStorage.getItem(this.optionsData.data.access.moduleName + "_" + this.optionsData.data.access.moduleEntityName);
      if (storeVal) {
        try {
          if (loadInfield) {
            this.query = JSON.parse(storeVal);
            this.getRules()
          }
          this.allowLoadSearch = true;
          this.allowSaveSearch = true;
          return true;
        } catch (error) {
          //console.log(error);
          this.allowLoadSearch = false;
        }
      }
    }
    return false;
  }

}
