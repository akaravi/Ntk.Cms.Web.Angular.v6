import { ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  CoreModuleTagService,
  EnumClauseType,
  EnumFilterDataModelSearchTypes,
  FilterDataModel,
  FilterModel
} from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

class chipModel {
  display: string;
  value: number;
}

@Component({
  selector: 'app-cms-tag-autocomplete',
  templateUrl: './cms-tag-autocomplete.component.html',
})
export class CmsTagAutocompleteComponent implements OnInit {
  static nextId = 0;
  id = ++CmsTagAutocompleteComponent.nextId;
  constructor(
    public service: CoreModuleTagService,
    private cmsToastrService: CmsToastrService) {

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
  @Output() optionChange = new EventEmitter<number[]>();
  @Input() set optionSelectForce(x: number[]) {
    this.onActionSelectForce(x);
  }
  tagDataModel: chipModel[] = [];
  tagLastDataModel: chipModel[] = [];
  selectForceStatus = true;
  separatorKeysCodes: number[] = [ENTER];//, COMMA];
  tagCtrl = new FormControl('');
  filteredOptions: Observable<chipModel[]>;
  addOnBlur = true;
  ngOnInit(): void {
  }

  // filter and return the values
  filter(text: string): Observable<chipModel[]> {

    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;
    let filter = new FilterDataModel();
    filter.propertyName = 'Title';
    filter.value = text;
    filter.searchType = EnumFilterDataModelSearchTypes.Contains;
    filter.clauseType = EnumClauseType.Or;
    filterModel.filters.push(filter);
    if (text && typeof +text === 'number' && +text > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Equal;
      filter.clauseType = EnumClauseType.Or;
      filterModel.filters.push(filter);
    }
    return this.service.ServiceGetAll(filterModel).pipe(
      map((data) => {
        this.tagLastDataModel = data.listItems.map(val => ({ display: val.title, value: val.id }));
        return this.tagLastDataModel;
      })
    );
  }
  checkIndex(val: number): number {
    let index = 0;
    let ret = -1;
    this.tagDataModel.forEach(element => {
      if (element.value == val) {
        ret = index;
      }
      index++;
    });
    return ret;
  }

  add(event: MatChipInputEvent): void {
    // Add our item
    let val: chipModel;
    if (event.value) {
      this.tagLastDataModel.forEach(element => {
        if ((element.display == event.value || element.value + "" == event.value)) {
          val = element;
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
    this.tagDataModel.forEach(x => {
      if (retIds.findIndex(y => y == x.value) < 0)
        retIds.push(x.value);
    });
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

    const filterModel = new FilterModel();
    ids.forEach(item => {
      if (item > 0) {
        const filter = new FilterDataModel();
        filter.propertyName = 'Id';
        filter.value = item;
        filter.clauseType = EnumClauseType.Or;
        filterModel.filters.push(filter);
      }
    });

    this.service.ServiceGetAll(filterModel).pipe(
      map((next) => {
        if (next.isSuccess) {
          next.listItems.forEach(val => {
            if (this.tagDataModel.findIndex(y => y.value == val.id) < 0)
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
          this.cmsToastrService.typeErrorGetAll(error);
        })).toPromise();
  }


}
