import { FilterModel } from 'ntk-cms-api';
import { ComponentOptionModel } from './componentOptionModel';

export class ComponentOptionExportModel
  implements
  ComponentOptionModel<
    ComponentOptionExportDataModel,
    ComponentOptionExportChildMethodsModel,
    ComponentOptionExportParentMethodsModel
  > {
  childMethods: ComponentOptionExportChildMethodsModel;
  parentMethods: ComponentOptionExportParentMethodsModel;
  data: ComponentOptionExportDataModel = new ComponentOptionExportDataModel();
  constructor() {
    this.data = new ComponentOptionExportDataModel();
  }
}

export class ComponentOptionExportChildMethodsModel {
  setExportLinkFile: (x: Map<string, string>) => void;
  setExportFilterModel: (x: FilterModel) => void;
}
export class ComponentOptionExportParentMethodsModel {
  onSubmit: (model: FilterModel) => void;
}
export class ComponentOptionExportDataModel {
  show = false;
  inProcess = false;
}
