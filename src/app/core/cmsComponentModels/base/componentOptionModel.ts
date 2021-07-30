export interface ComponentOptionModel<TDataModel, TChildMethods, TParentMethods> {
  childMethods: TChildMethods;
  parentMethods: TParentMethods;
  data: TDataModel;
}
