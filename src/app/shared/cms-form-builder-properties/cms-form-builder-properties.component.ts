import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetPropertiesInfoModel } from 'ntk-cms-api';

@Component({
  selector: 'app-cms-form-builder-properties',
  templateUrl: './cms-form-builder-properties.component.html',
  styleUrls: ['./cms-form-builder-properties.component.scss']
})
export class CmsFormBuilderPropertiesComponent implements OnInit {

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
