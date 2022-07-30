import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { Component, OnInit, Input, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import {
  EstatePropertyTypeLanduseService,
  EnumClauseType,
  EnumFilterDataModelSearchTypes,
  FilterDataModel,
  FilterModel
} from 'ntk-cms-api';
import { Output } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
class chipModel {
  display: string;
  value: string;
}
@Component({
  selector: 'app-estate-property-type-landuse-autocomplete',
  templateUrl: './autocomplete.component.html'
})
export class EstatePropertyTypeLanduseCompleteComponent implements OnInit {
  constructor(
    public service: EstatePropertyTypeLanduseService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    ) {
      this.filteredOptions = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        debounceTime(400),
        switchMap(val => {
          return this.filter(val || '')
        })
      );
  }
  @Input() optionDisabled = false;
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @Input() optionPlaceholder = '+ Tag';
  @Input() optionLabel = " Select"
  @Output() optionChange = new EventEmitter<string[]>();
  @Input() set optionSelectForce(x: string[]) {
    this.onActionSelectForce(x);
  }
  tagDataModel: chipModel[] = [];
  tagLastDataModel: chipModel[] = [];
  selectForceStatus = true;
  separatorKeysCodes: number[] = [ENTER];
  tagCtrl = new FormControl('');
  filteredOptions: Observable<chipModel[]>;
  addOnBlur = true;
  ngOnInit(): void {
  }

  // filter and return the values
  filter(text: string): Observable<chipModel[]> {

    const filteModel = new FilterModel();
    filteModel.rowPerPage = 20;
    filteModel.accessLoad = true;
    let filter = new FilterDataModel();
    filter.propertyName = 'Title';
    filter.value = text;
    filter.searchType = EnumFilterDataModelSearchTypes.Contains;
    filter.clauseType = EnumClauseType.Or;
    filteModel.filters.push(filter);
    if (text && typeof +text === 'string' && +text > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Equal;
      filter.clauseType = EnumClauseType.Or;
      filteModel.filters.push(filter);
    }
    return this.service.ServiceGetAll(filteModel).pipe(
      map((data) => {
        this.tagLastDataModel = data.listItems.map(val => ({ display: val.titleML, value: val.id }));
        return this.tagLastDataModel;
      })
    );

  }
  checkIndex(val: string): number {
    var index = 0;
    var ret=-1;
    this.tagDataModel.forEach(element => {
      if (element.value == val) {
        ret= index;
      }
      index++;
    });
    return ret;
  }

  add(event: MatChipInputEvent): void {
    // Add our item
    var val:chipModel;
    if (event.value) {
      this.tagLastDataModel.forEach(element => {
        if ((element.display == event.value || element.value + "" == event.value)) {
          val=element;
        }
      });
    }
    if (val && this.checkIndex(val.value) < 0) {
      this.tagDataModel.push(val);
      this.onActionChange();
    }
    // Clear the input value
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }

  remove(item: chipModel): void {
    const index = this.checkIndex(item.value);
    if (index >= 0) {
      this.tagDataModel.splice(index, 1);
      this.onActionChange();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const val = event.option.value as unknown as chipModel;
    if (this.checkIndex(val.value) < 0) {
      this.tagDataModel.push(val);
    }
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.onActionChange();
  }


  onActionChange(): void {
    const retIds = [];
    this.tagDataModel.forEach(x => { retIds.push(x.value); });
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
      if (item.length > 0) {
        const filter = new FilterDataModel();
        filter.propertyName = 'Id';
        filter.value = item;
        filter.clauseType = EnumClauseType.Or;
        filteModel.filters.push(filter);
      }
    });

    this.service.ServiceGetAll(filteModel).pipe(
      map((next) => {
        if (next.isSuccess) {
          next.listItems.forEach(val => {
            this.tagDataModel.push({
              value: val.id,
              display: val.titleML
            });
          });
        } else {
          this.cmsToastrService.typeErrorGetAll(next.errorMessage);
        }
        return;
      },
        (error) => {

          
          this.cmsToastrService.typeErrorGetAll(error);
        })).toPromise();
  }



}
