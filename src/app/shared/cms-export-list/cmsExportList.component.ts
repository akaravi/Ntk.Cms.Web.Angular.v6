import { EnumModel, ExportFileModel, FilterDataModel, FilterModel } from 'ntk-cms-api';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ComponentOptionExportModel } from 'src/app/core/cmsComponentModels/base/componentOptionExportModel';
import { Output } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-cms-export-list',
  templateUrl: './cmsExportList.component.html',
  styleUrls: ['./cmsExportList.component.scss']
})
export class CmsExportListComponent implements OnInit {
  constructor() {
    let eum = new EnumModel();
    eum.Value = 1;
    eum.Key = 'Excel';
    eum.Description = 'Excel';
    this.fileTypeListItems.push(eum);

    eum = new EnumModel();
    eum.Value = 2;
    eum.Key = 'PDF';
    eum.Description = 'PDF';
    this.fileTypeListItems.push(eum);

    eum = new EnumModel();
    eum.Value = 3;
    eum.Key = 'Text';
    eum.Description = 'Text';
    this.fileTypeListItems.push(eum);


    eum = new EnumModel();
    eum.Value = 0;
    eum.Key = 'Now';
    eum.Description = 'Now';
    this.recieveMethodListItems.push(eum);

    eum = new EnumModel();
    eum.Value = 1;
    eum.Key = 'Email';
    eum.Description = 'Email';
    this.recieveMethodListItems.push(eum);

    eum = new EnumModel();
    eum.Value = 2;
    eum.Key = 'FileManeger';
    eum.Description = 'FileManeger';
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
  fileTypeListItems: Array<EnumModel> = new Array<EnumModel>();
  recieveMethodListItems: Array<EnumModel> = new Array<EnumModel>();
  ngOnInit(): void { }
  setExportLinkFile(model: Map<string, string>): void {
    this.modelData = model;
  }
  setExportFilterModel(model: FilterModel): void {
    this.filterModel = JSON.parse(JSON.stringify(model));
    if (!this.filterModel.ExportFile) {
      this.filterModel.ExportFile = new ExportFileModel();
    }
  }

  onSubmit(): void {
    if (this.optionsData.parentMethods) {
      this.optionsData.parentMethods.onSubmit(this.filterModel);
    }
  }
}
