import { CoreCurrencyModel, CoreModuleModel, CoreSiteModel, EnumInfoModel, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
import { ProcessInfoModel } from '../models/progressSpinnerModel';

export interface ReducerCmsStore {
  CoreSiteResultStore: ErrorExceptionResult<CoreSiteModel>;
  CoreModuleResultStore: ErrorExceptionResult<CoreModuleModel>;
  EnumRecordStatusResultStore: ErrorExceptionResult<EnumInfoModel>;
  CurrencyResultStore: ErrorExceptionResult<CoreCurrencyModel>;
  processInfo: Map<string, ProcessInfoModel>;
}
