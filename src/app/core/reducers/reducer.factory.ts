import { CoreSiteModel, EnumModel, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';

export interface ReducerCmsStore {
  CoreSiteResultStore: ErrorExceptionResult<CoreSiteModel>;
  EnumRecordStatusResultStore: ErrorExceptionResult<EnumModel>;
}
