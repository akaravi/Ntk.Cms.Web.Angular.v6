import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {
  EstatePropertyTypeUsageModel,
  EstatePropertyTypeUsageService,
  EnumClauseType,
  EnumFilterDataModelSearchTypes,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel
} from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';




@Component({
  selector: 'app-estate-property-type-usage-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class EstatePropertyTypeUsageCompleteComponent implements OnInit {
  constructor(
    public estatePropertyTypeUsageService: EstatePropertyTypeUsageService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    ) {
  }
  @Input() set optionSelectForce(x: string[]) {
    this.onActionSelectForce(x);
  }
  datatagDataModelResult: ErrorExceptionResult<EstatePropertyTypeUsageModel> = new ErrorExceptionResult<EstatePropertyTypeUsageModel>();
  tagDataModel = [];


  @Input() optionPlaceholder = '';
  @Input() optionDisabled = false;
  @Output() optionChange = new EventEmitter<string[]>();

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
    if (text && text.length > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Equal;
      filter.clauseType = EnumClauseType.Or;
      filteModel.filters.push(filter);
    }
    return this.estatePropertyTypeUsageService.ServiceGetAll(filteModel).pipe(
      map((data) =>
        data.listItems.map(val => ({
          value: val.id,
          display: val.title
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
        filter.propertyName = 'Id';
        filter.value = item;
        filter.clauseType = EnumClauseType.Or;
        filteModel.filters.push(filter);
      }
    });

    this.estatePropertyTypeUsageService.ServiceGetAll(filteModel).pipe(
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

          const title = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorReceivingInformation');
          this.cmsToastrService.typeErrorGetAll(error);
        })).toPromise();
  }


}
