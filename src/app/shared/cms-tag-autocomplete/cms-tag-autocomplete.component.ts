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
  datatagDataModelResult: ErrorExceptionResult<CoreModuleTagModel> = new ErrorExceptionResult<CoreModuleTagModel>();
  tagDataModel = [];


  @Input() optionPlaceholder = new EventEmitter<string>();
  @Output() optionChange = new EventEmitter<number[]>();
  @Input() set optionSelectForce(x: number[]) {
    this.onActionSelectForce(x);
  }
  ngOnInit(): void {
  }

  public requestAutocompleteItems = (text: string): Observable<any> => {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
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
    return this.coreModuleTagService.ServiceGetAll(filteModel).pipe(
      map((data) => data.ListItems.map(val => ({
        value: val.Id,
        display: val.Title
      })))
    );
  }


  onActionChange(): void {
    const retIds = [];
    this.tagDataModel.forEach(x => { retIds.push(x.id); });
    this.optionChange.emit(retIds);

  }

  onActionSelectForce(ids: number[]): void {

    if (!ids || ids.length === 0) {
      return;
    }

    const filteModel = new FilterModel();
    ids.forEach(item => {
      if (item > 0) {
        const filter = new FilterDataModel();
        filter.PropertyName = 'Id';
        filter.Value = item;
        filter.ClauseType = EnumClauseType.Or;
        filteModel.Filters.push(filter);
      }
    });

    this.coreModuleTagService.ServiceGetAll(filteModel).pipe(
      map((next) => {
        if (next.IsSuccess) {
          next.ListItems.forEach(val => {
            this.tagDataModel.push({
              value: val.Id,
              display: val.Title
            });
          });
        } else {
          this.cmsToastrService.typeErrorGetAll(next.ErrorMessage);

        }

        return;
      },
        (error) => {

          const title = 'برروی خطا در دریافت طلاعات تگ';
          this.cmsToastrService.typeErrorGetAll(error);
        })).toPromise();
  }


}
