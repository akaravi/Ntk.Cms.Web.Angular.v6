export class HtmlBuilderTemplateConfigModel {
  htmlConfig: HtmlBuilderHtmlConfigModel;
  wrapperConfig: HtmlBuilderWrapperConfigModel;
  elementConfig: HtmlBuilderElementConfigModel;
  widgetConfig: HtmlBuilderWidgetConfigModel;
}
export enum TemplateConfigDeviceEnum {
  lg = 1,
  md = 2,
  sm = 3,
  xs = 4
}

export class HtmlBuilderHtmlConfigModel {
  FontInfos: FontInfoModel[];
  placeAttributeSizeConfig: string;
  sizeListConfig: SizeConfigModel[];
  deviceSupport: DeviceSupportModel[];
}

export class FontInfoModel {
  name: string;
  description: string;
  address: string;
}

export class HtmlBuilderWrapperConfigModel {
  forceAttribute: AttributeConfigModel[];
}

export class HtmlBuilderElementConfigModel {
  forceAttribute: AttributeConfigModel[];
}

export class HtmlBuilderWidgetConfigModel {
  forceAttribute: AttributeConfigModel[];
}

export class DeviceSupportModel {
  key: number;
  device: TemplateConfigDeviceEnum;
}

export class SizeConfigModel {
  device: TemplateConfigDeviceEnum;
  key: number;
  value: string;
}

export class AttributeConfigModel {
  device: TemplateConfigDeviceEnum;
  name: string;
  value: string;
}
