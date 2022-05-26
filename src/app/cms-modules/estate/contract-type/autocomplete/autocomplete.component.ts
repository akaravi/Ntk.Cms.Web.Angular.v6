//**msh */
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {
  EstateContractTypeModel,
  EstateContractTypeService,
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
  selector: 'app-estate-contract-type-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class EstateContractTypeCompleteComponent implements OnInit {
  constructor(
    public estateContractTypeService: EstateContractTypeService,
    private cmsToastrService: CmsToastrService) {
  }
  @Input() set optionSelectForce(x: string[]) {
    this.onActionSelectForce(x);
  }
  datatagDataModelResult: ErrorExceptionResult<EstateContractTypeModel> = new ErrorExceptionResult<EstateContractTypeModel>();
  tagDataModel = [];


  @Input() optionPlaceholder = '';
  @Input() optionDisabled = false;
  @Output() optionChange = new EventEmitter<string[]>();

  selectForceStatus = true;
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
    if (text && text.length > 0) {
      filter = new FilterDataModel();
      filter.PropertyName = 'Id';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Equal;
      filter.ClauseType = EnumClauseType.Or;
      filteModel.Filters.push(filter);
    }
    return this.estateContractTypeService.ServiceGetAll(filteModel).pipe(
      map((data) =>
        data.ListItems.map(val => ({
          value: val.Id,
          display: val.Title
        })))
    );
  }
  onActionChange(): void {
    const retIds = [];
    this.tagDataModel.forEach(x => {
      retIds.push(x.value);
    });
    this.selectForceStatus = false;
    this.optionChange.emit(retIds);
  }
  onActionSelectForce(ids: string[]): void {
    if (!this.selectForceStatus) {
      return;
    }
    if (!ids || ids.length === 0) {
      return;
    }
    const filteModel = new FilterModel();
    ids.forEach(item => {
      if (item && item.length > 0) {
        const filter = new FilterDataModel();
        filter.PropertyName = 'Id';
        filter.Value = item;
        filter.ClauseType = EnumClauseType.Or;
        filteModel.Filters.push(filter);
      }
    });

    this.estateContractTypeService.ServiceGetAll(filteModel).pipe(
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

          const title = 'برروی خطا در دریافت اطلاعات ';
          this.cmsToastrService.typeErrorGetAll(error);
        })).toPromise();
  }


}
