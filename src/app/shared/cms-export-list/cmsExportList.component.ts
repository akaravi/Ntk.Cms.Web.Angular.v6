import { EnumInfoModel, ExportFileModel, FilterDataModel, FilterModel } from 'ntk-cms-api';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ComponentOptionExportModel } from 'src/app/core/cmsComponentModels/base/componentOptionExportModel';
import { Output } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-cms-export-list',
  templateUrl: './cmsExportList.component.html',
})
export class CmsExportListComponent implements OnInit {
  static nextId = 0;
  id = ++CmsExportListComponent.nextId;
  constructor() {
    let eum = new EnumInfoModel();
    eum.value = 1;
    eum.key = 'Excel';
    eum.description = 'Excel';
    this.fileTypeListItems.push(eum);

    eum = new EnumInfoModel();
    eum.value = 2;
    eum.key = 'PDF';
    eum.description = 'PDF';
    this.fileTypeListItems.push(eum);

    eum = new EnumInfoModel();
    eum.value = 3;
    eum.key = 'Text';
    eum.description = 'Text';
    this.fileTypeListItems.push(eum);

    eum = new EnumInfoModel();
    eum.value = 4;
    eum.key = 'Report';
    eum.description = 'Report';
    this.fileTypeListItems.push(eum);

    eum = new EnumInfoModel();
    eum.value = 0;
    eum.key = 'Now';
    eum.description = 'Now';
    this.recieveMethodListItems.push(eum);

    eum = new EnumInfoModel();
    eum.value = 1;
    eum.key = 'Email';
    eum.description = 'Email';
    this.recieveMethodListItems.push(eum);

    eum = new EnumInfoModel();
    eum.value = 2;
    eum.key = 'FileManager';
    eum.description = 'FileManager';
    this.recieveMethodListItems.push(eum);
  }
  public optionsData: ComponentOptionExportModel = new ComponentOptionExportModel();
  @Output() optionsChange: EventEmitter<ComponentOptionExportModel> = new EventEmitter<ComponentOptionExportModel>();
  @Input() set options(model: ComponentOptionExportModel) {
    if (!model) {
      model = new ComponentOptionExportModel();
    }
    this.optionsData = model;
    this.optionsData.childMethods = {
      setExportLinkFile: (x: Map<string, string>) => this.setExportLinkFile(x),
      setExportFilterModel: (x: FilterModel) => this.setExportFilterModel(x),
    };
    this.optionsChange.emit(model);
  }
  get options(): ComponentOptionExportModel {
    return this.optionsData;
  }
  exportFileModel: ExportFileModel = new ExportFileModel();
  filterModel: FilterModel = new FilterModel();
  modelData: Map<string, string> = new Map<string, string>();
  fileTypeListItems: Array<EnumInfoModel> = new Array<EnumInfoModel>();
  recieveMethodListItems: Array<EnumInfoModel> = new Array<EnumInfoModel>();
  ngOnInit(): void { }
  setExportLinkFile(model: Map<string, string>): void {
    this.modelData = model;
  }
  setExportFilterModel(model: FilterModel): void {
    this.filterModel = JSON.parse(JSON.stringify(model));
    if (!this.filterModel.exportFile) {
      this.filterModel.exportFile = new ExportFileModel();
    }
  }

  onSubmit(): void {
    if (this.optionsData.parentMethods) {
      this.modelData = new Map<string, string>();
      this.optionsData.parentMethods.onSubmit(this.filterModel);
    }
  }
}
