import { CoreModuleModel, CoreSiteModel, EnumModel, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
import { ProcessInfoModel, ProgressSpinnerModel } from '../models/progressSpinnerModel';

export interface ReducerCmsStore {
  CoreSiteResultStore: ErrorExceptionResult<CoreSiteModel>;
  CoreModuleResultStore: ErrorExceptionResult<CoreModuleModel>;
  EnumRecordStatusResultStore: ErrorExceptionResult<EnumModel>;
  processInfo: Map<string, ProcessInfoModel>;
}
