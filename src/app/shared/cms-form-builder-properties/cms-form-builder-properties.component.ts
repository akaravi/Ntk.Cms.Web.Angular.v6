import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetPropertiesInfoModel } from 'ntk-cms-api';

@Component({
  selector: 'app-cms-form-builder-properties',
  templateUrl: './cms-form-builder-properties.component.html',
})
export class CmsFormBuilderPropertiesComponent implements OnInit {
  static nextId = 0;
  id = ++CmsFormBuilderPropertiesComponent.nextId;
  constructor() { }
  @Input() field: GetPropertiesInfoModel = new GetPropertiesInfoModel();
  @Output() jsonValueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() set jsonValue(model: string) {
    this.jsonValueChange.emit(model);
  }
  fieldValue = '';
  ngOnInit(): void {

  }
}
