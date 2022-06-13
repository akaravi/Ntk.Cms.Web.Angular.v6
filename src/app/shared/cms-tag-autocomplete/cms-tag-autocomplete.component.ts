import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { Component, OnInit, Input, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import {
  CoreModuleTagService,
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

class chipModel {
  display: string;
  value: number;
}

@Component({
  selector: 'app-cms-tag-autocomplete',
  templateUrl: './cms-tag-autocomplete.component.html',
  styleUrls: ['./cms-tag-autocomplete.component.scss']
})
export class CmsTagAutocompleteComponent implements OnInit {
  constructor(
    public coreModuleTagService: CoreModuleTagService,
    private cmsToastrService: CmsToastrService) {

    this.filteredOptions = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      debounceTime(400),
      switchMap(val => {
        return this.filter(val || '')
      })
    );
  }
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
  separatorKeysCodes: number[] = [ENTER, COMMA];
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
    if (text && typeof +text === 'number' && +text > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = EnumFilterDataModelSearchTypes.Equal;
      filter.clauseType = EnumClauseType.Or;
      filteModel.filters.push(filter);
    }
    return this.coreModuleTagService.ServiceGetAll(filteModel).pipe(
      map((data) => {
        this.tagLastDataModel = data.listItems.map(val => ({ display: val.title, value: val.id }));
        return this.tagLastDataModel;
      })
    );

  }


  add(event: MatChipInputEvent): void {
    // Add our item
    if (event.value) {

      this.tagLastDataModel.forEach(element => {
        if ((element.display == event.value || element.value + "" == event.value) && this.tagDataModel.indexOf(element) < 0) {
          this.tagDataModel.push(element);
          this.onActionChange();
        }
      });
    }
    // Clear the input value
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }

  remove(item: chipModel): void {
    const index = this.tagDataModel.indexOf(item);
    if (index >= 0) {
      this.tagDataModel.splice(index, 1);
      this.onActionChange();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tagDataModel.push(event.option.value as unknown as chipModel);
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
