import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {
  CoreModuleTagModel,
  CoreModuleTagService,
  EnumClauseType,
  EnumFilterDataModelSearchTypes,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel
} from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Output } from '@angular/core';




@Component({
  selector: 'app-cms-tag-autocomplete',
  templateUrl: './cms-tag-autocomplete.component.html',
  styleUrls: ['./cms-tag-autocomplete.component.scss']
})
export class CmsTagAutocompleteComponent implements OnInit {
  constructor(
    public coreModuleTagService: CoreModuleTagService,
    private cmsToastrService: CmsToastrService) {
  }
  @Input() set optionSelectForce(x: number[]) {
    this.onActionSelectForce(x);
  }
  datatagDataModelResult: ErrorExceptionResult<CoreModuleTagModel> = new ErrorExceptionResult<CoreModuleTagModel>();
  tagDataModel = [];


  @Input() optionPlaceholder = '+ Tag';
  @Output() optionChange = new EventEmitter<number[]>();

  selectForceStatus = true;
  ngOnInit(): void {
  }

  public requestAutocompleteItems = (text: string): Observable<any> => {
    const filteModel = new FilterModel();
    filteModel.rowPerPage = 20;
    filteModel.accessLoad = true;
    let filter = new FilterDataModel();
    filter.propertyName = 'Title';
    filter.value = text;
    filter.searchType = EnumFilterDataModelSearchTypes.Contains;
    filter.clauseType = EnumClauseType.Or;
    filteModel.filters.push(filter);
    if (text && typeof +text === 'number' && +text > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Equal;
      filter.clauseType = EnumClauseType.Or;
      filteModel.filters.push(filter);
    }
    return this.coreModuleTagService.ServiceGetAll(filteModel).pipe(
      map((data) => data.listItems.map(val => ({
        value: val.id,
        display: val.title
      })))
    );
  }
  onActionChange(): void {
    const retIds = [];
    this.tagDataModel.forEach(x => { retIds.push(x.value); });
    this.selectForceStatus = false;
    this.optionChange.emit(retIds);
  }

  onActionSelectForce(ids: number[]): void {
    if (!this.selectForceStatus) {
      return;
    }
    if (!ids || ids.length === 0) {
      return;
    }

    const filteModel = new FilterModel();
    ids.forEach(item => {
      if (item > 0) {
        const filter = new FilterDataModel();
        filter.propertyName = 'Id';
        filter.value = item;
        filter.clauseType = EnumClauseType.Or;
        filteModel.filters.push(filter);
      }
    });

    this.coreModuleTagService.ServiceGetAll(filteModel).pipe(
      map((next) => {
        if (next.isSuccess) {
          next.listItems.forEach(val => {
            this.tagDataModel.push({
              value: val.id,
              display: val.title
            });
          });
        } else {
          this.cmsToastrService.typeErrorGetAll(next.errorMessage);

        }

        return;
      },
        (error) => {

          const title = 'برروی خطا در دریافت طلاعات تگ';
          this.cmsToastrService.typeErrorGetAll(error);
        })).toPromise();
  }


}
