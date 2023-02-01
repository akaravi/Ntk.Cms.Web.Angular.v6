import { CoreSiteModel, WebDesignerMainPageModel, WebDesignerMainPageTemplateModel } from "ntk-cms-api";
import { HtmlBuilderModuleInfoModel } from "./htmlBuilderModuleInfoModel";
import { HtmlBuilderTemplateConfigModel } from "./htmlBuilderTemplateConfigModel";
import { HtmlBuilderWidgetBodyModel } from "./htmlBuilderWidgetBodyModel";

export class HtmlBuilderModel {
  configRouteTemplateFileImage: string;
  configRouteFileStorage: string;
  cmsSite: CoreSiteModel;
  cmsPage: WebDesignerMainPageModel;
  cmsParentPage: WebDesignerMainPageModel;
  cmsPageTemplate: WebDesignerMainPageTemplateModel;

  moduleInfoes: HtmlBuilderModuleInfoModel[];
  templateConfig: HtmlBuilderTemplateConfigModel;
  bodySetting: HtmlBuilderWidgetBodyModel;
}
