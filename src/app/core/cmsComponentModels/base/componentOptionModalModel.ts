import { ComponentModalDataModel } from './componentModalDataModel';
import { ComponentOptionModel } from './componentOptionModel';



export class ComponentOptionModalModel
  implements ComponentOptionModel<ComponentOptionModalDataModel, ComponentOptionModalActionsModel, ComponentOptionModalMethodsModel> {
  childMethods: ComponentOptionModalActionsModel;
  parentMethods: ComponentOptionModalMethodsModel;
  data: ComponentOptionModalDataModel = new ComponentOptionModalDataModel();

  constructor() {
    this.data = new ComponentOptionModalDataModel();
  }
}

export class ComponentOptionModalActionsModel {
  onClose: () => void;
}
export class ComponentOptionModalMethodsModel {
  openModal: (x: ComponentModalDataModel) => void;
}
export class ComponentOptionModalDataModel {
  hidden: boolean;
  result: any;
  closeResult: string;
  reason: any;
}
