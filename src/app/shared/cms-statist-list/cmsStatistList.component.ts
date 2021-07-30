import { Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistModel';

@Component({
  selector: 'app-cms-statist-list',
  templateUrl: './cmsStatistList.component.html',
  styleUrls: ['./cmsStatistList.component.scss'],
})
export class CmsStatistListComponent implements OnInit {
  constructor() { }
  public optionsData: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  @Output()
  optionsChange: EventEmitter<ComponentOptionStatistModel> = new EventEmitter<ComponentOptionStatistModel>();
  @Input() set options(model: ComponentOptionStatistModel) {
    if (!model) {
      model = new ComponentOptionStatistModel();
    }
    this.optionsData = model;
    this.optionsData.childMethods = {
      setStatistValue: (x: Map<string, number>) => this.setStatistValue(x),
    };
    this.optionsChange.emit(model);
  }
  get options(): ComponentOptionStatistModel {
    return this.optionsData;
  }
  modelData: Map<string, number> = new Map<string, number>();
  ngOnInit(): void { }
  setStatistValue(model: Map<string, number>): void {
    this.modelData = model;
  }
}
